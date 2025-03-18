import Image from "next/image";
import Link from "next/link";

export const Banner = () => {
	return (
		<div className="mx-auto mt-10 mb-4 grid max-w-(--breakpoint-xl) grid-cols-1 space-y-2 sm:grid-cols-12 sm:space-x-2 sm:space-y-0">
			<div className="col-span-2 space-y-2">
				<Link href="/">
					{/* <Image
										src={"/movies/logo2.png"}
										priority
										width={212}
										height={200}
										className="h-auto w-auto"
										alt="Logo"
									/> */}
				</Link>
			</div>
			<div className="col-span-8 space-y-2">
				<div className="flex items-center justify-center">
					<Link href="/">
						{/* countdown to start server */}
						{/* <video className='w-[380px]' autoPlay muted playsInline loop>
												<source src="/movies/logo.webm" type="video/webm" />
											</video> */}
						<Image alt="Noctera Global Logo" src="/movies/logo2.png" width={300} height={160} />
					</Link>
				</div>
			</div>
		</div>
	);
};
