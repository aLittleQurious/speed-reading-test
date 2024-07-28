import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { clientGetRandomStory } from "@/app/lib/lib";

export async function GET() {
  const randomStory = await clientGetRandomStory();

  return NextResponse.json(randomStory);
}
