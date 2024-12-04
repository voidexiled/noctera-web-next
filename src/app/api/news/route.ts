import { prisma } from "@/lib/prisma";
import { convertBigIntsToNumbers } from "@/utils/functions/convertBigIntsToNumbers";

import { NextResponse, type NextRequest } from "next/server";

// const find = async (req: Request) => {
//   const news = await prisma.posts.findMany({});
//   //return NextResponse.json(convertBigIntsToNumbers(news), { status: 200 })
//   return NextResponse.json(news, { status: 200 })
// }


export async function GET(request: NextRequest){
  const news = await prisma.posts.findMany({});
  return NextResponse.json(news, { status: 200 })
}