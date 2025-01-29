import {
	type OutfitData,
	loadData,
	outfit,
} from "@/components/animations/outfits";
import { type NextRequest, NextResponse } from "next/server";

import { existsSync, readdirSync, writeFileSync } from "node:fs";
import path, { relative, resolve } from "node:path";
import { outfitImagesPath, walkSpeeds } from "@/components/animations/config";
import invariant from "tiny-invariant";

const CACHE_FILE_PATH = "./cache.generated.txt";

function getFilesSync(dir: string): string[] {
	const dirents = readdirSync(dir, { withFileTypes: true });
	const files = dirents.flatMap((dirent) => {
		const res = relative(".", resolve(dir, dirent.name));
		return dirent.isDirectory() ? getFilesSync(res) : res;
	});

	return files;
}

function generateCacheIfNeeded(): boolean {
	if (!existsSync(CACHE_FILE_PATH)) {
		const dirIterator = getFilesSync(outfitImagesPath);
		const outfits: { [outfitId: string]: OutfitData } = {};
		const frameNumbers = Array(10).fill(0);

		for (const filePath of dirIterator) {
			const normalizedFilePath = filePath.replaceAll("\\", "/");
			const outfitIdData = path.dirname(normalizedFilePath).split("/");
			const outfitId = outfitIdData[outfitIdData.length - 1];

			if (!outfits[outfitId]) {
				outfits[outfitId] = {
					files: [],
					framesNumber: 0,
					mountFramesNumber: 0,
				};
			}

			const fileName = path.basename(normalizedFilePath);
			outfits[outfitId].files.push(normalizedFilePath);

			const currentFramesNumber = Number.parseInt(fileName.charAt(0));
			if (Number.isNaN(currentFramesNumber)) {
				continue;
			}
			outfits[outfitId].framesNumber = Math.max(
				outfits[outfitId].framesNumber,
				currentFramesNumber,
			);
		}

		for (const outfitId in outfits) {
			const outfit = outfits[outfitId];
			const serializedOutfit = JSON.stringify(outfit);
			const outfitDataFilePath = path.join(
				outfitImagesPath,
				outfitId,
				"outfit.data.json",
			);

			try {
				writeFileSync(outfitDataFilePath, serializedOutfit);
			} catch (err) {
				console.error(
					`Node.js cannot write to: "${outfitDataFilePath}", check directory access rights`,
				);
			}

			frameNumbers[outfit.framesNumber]++;
		}

		const cacheGeneratedFilePath = CACHE_FILE_PATH;
		try {
			writeFileSync(cacheGeneratedFilePath, "cache generated");
		} catch (err) {
			console.error(
				`Node.js cannot write to: "${cacheGeneratedFilePath}", check directory access rights`,
			);
			process.exit(1);
		}

		return true;
	}
	return false;
}

function parseIntWithDefault(value: unknown, def = 0): number {
	if (!value) return def;

	invariant(
		typeof value === "string" || typeof value === "number",
		`value must be a string or number found ${typeof value} instead`,
	);
	if (typeof value === "number") return value;

	return Number.parseInt(value) ?? def;
}

export async function GET(request: NextRequest) {
	const url = new URL(request.url);
	const looktype = parseIntWithDefault(url.searchParams.get("looktype"));
	let outfitData = loadData(looktype, outfitImagesPath, false);
	if (!outfitData) {
		return Response.json({});
	}

	let mount = parseIntWithDefault(url.searchParams.get("mount"));

	if (mount > 0) {
		const mountOutfitData = loadData(mount, outfitImagesPath, true, outfitData);
		if (mountOutfitData) {
			outfitData = mountOutfitData;
		} else {
			mount = 0;
		}
	}

	if (!outfitData) {
		return Response.json({ error: "Outfit not found" }, { status: 404 });
	}

	const head = parseIntWithDefault(url.searchParams.get("lookhead"));
	const body = parseIntWithDefault(url.searchParams.get("lookbody"));
	const legs = parseIntWithDefault(url.searchParams.get("looklegs"));
	const feet = parseIntWithDefault(url.searchParams.get("lookfeet"));
	const addons = parseIntWithDefault(url.searchParams.get("lookaddons"));
	const direction = parseIntWithDefault(url.searchParams.get("direction"), 3);
	const resize = parseIntWithDefault(url.searchParams.get("resize"), 1);

	const frames: CanvasRenderingContext2D[] = [];
	const durations: number[] = [];

	const moveAnimFrames: number = outfitData?.framesNumber;

	for (
		let moveAnimFrame = 1;
		moveAnimFrame <= moveAnimFrames;
		++moveAnimFrame
	) {
		const frame = await outfit(
			outfitData,
			outfitImagesPath,
			looktype,
			addons,
			head,
			body,
			legs,
			feet,
			mount,
			direction,
			moveAnimFrame,
			resize === 1,
		);
		if (!frame) {
			return Response.json(
				{ error: "Failed to create canvas frame" },
				{ status: 500 },
			);
		}
		frames.push(frame as unknown as CanvasRenderingContext2D);
		durations.push(walkSpeeds[moveAnimFrames]);
	}

	return Response.json({
		frames: frames.map((frame, index) => ({
			image: frame.canvas.toDataURL(),
			duration: durations[index],
		})),
	});
}
