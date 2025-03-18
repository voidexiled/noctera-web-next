import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";
import type { GuildsImagesFilenameGETRequest, GuildsImagesFilenameGETResponse } from "@/app/api/types";
import { type NextRequest, NextResponse } from "next/server";

type Params = Promise<GuildsImagesFilenameGETRequest>;

export async function GET(request: NextRequest, segmentData: { params: Params }) {
	const { filename } = await segmentData.params;
	// console.log(`fileName ${filename}`);
	// console.log(`fileName ${typeof filename}`);
	if (!filename || typeof filename !== "string") {
		return NextResponse.json({ error: "No valid filename provided" }, { status: 400 });
	}

	const imagePath = join(process.cwd(), "uploads", "guilds", filename);
	console.log(`imagePath ${imagePath}`);

	if (!existsSync(imagePath)) {
		return NextResponse.json({ error: "File not found" }, { status: 404 });
	}

	try {
		const fileStream = createReadStream(imagePath);
		const contentType = `image/${filename.split(".").pop()}`;
		console.log(`contentType ${contentType}`);

		const readableStream: GuildsImagesFilenameGETResponse = new ReadableStream({
			start(controller) {
				fileStream.on("data", (chunk) => {
					controller.enqueue(chunk);
				});
				fileStream.on("end", () => {
					controller.close();
				});
				fileStream.on("error", (error) => {
					console.log("Error reading file stream:", error);
					controller.error(error);
				});
			},
		});
		console.log(`readableStream ${readableStream}`);

		return new NextResponse(readableStream, {
			headers: {
				"Content-Type": contentType,
			},
		});
	} catch (error) {
		console.log("Error serving image:", error);
		return NextResponse.json({ error: "Error al servir la imagen." }, { status: 500 });
	}
}
