"use server";
import prisma from "./prisma";
import random from "random";


export async function getItems({
  storyId,
  count,
}: {
  storyId: string;
  count: number;
}) {
  //given a story, get that number of questions

  return await prisma.item.findMany({
      where: {
          storyId,
      },
      select: {
            question: true,
            options: true,
      },
      take: count,
  });
}

export async function getRandomStory() {
  const randomStory: any[] =
    await prisma.$queryRaw`SELECT * FROM "Story" ORDER BY RANDOM() LIMIT 1`;

  return randomStory[0];
}

export async function getStory({ id }: { id: string }) {
  return await prisma.story.findUnique({
    where: {
      id,
    },
  });
}

export async function checkAnswers({
  storyId,
  submissions,
  timeToComplete,
}: {
  storyId: string;
  submissions: string[];
  timeToComplete?: Date;
}) {
  //get all answers for the story
  const items = await prisma.item.findMany({
    where: {
      storyId,
    },
  });

  const answers = items.map((item) => item.answer);
  //for every submission, if submission in answers, increment score
  let score = 0;
  let total = 0;

  for (let submission of submissions) {
    if (answers.includes(submission)) {
      score++;
    }
    total++;
  }

  return {
    numQuestions: total,
    numCorrect: score,
    wpm: timeToComplete
      ? Math.floor((total / (timeToComplete.getTime() / 1000 / 60)) * 60)
      : 0,
  };
}
