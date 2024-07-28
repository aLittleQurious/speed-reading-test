import prisma from "./prisma";
import random from "random";

export async function clientGetRandomStory() {
  //returns a random story. bit sloppy with double queries, but it works.

  const randomStoryId: any[] =
    await prisma.$queryRaw`SELECT id FROM "Story" ORDER BY RANDOM() LIMIT 1`;

    return await getStory({ id: randomStoryId[0].id });

}

export async function getStory({ id }: { id: string }) {



  return await prisma.story.findUnique({
    where: {
      id: id,
    },
    include: {
      quiz: true,
    },
  });
}
