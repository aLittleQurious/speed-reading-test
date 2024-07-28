"use server";
import prisma from "./prisma";
import random from "random";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getItems({
  storyId,
  count,
}: {
  storyId: string;
  count: number;
}) {
  //given a story, get that number of questions
  try {
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
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export async function checkAnswers({
  storyId,
  submissions,
  timeToComplete,
}: {
  storyId: string;
  submissions: string[];
  timeToComplete: number; //assume in seconds
}) {
  //get story length
  const storyLength = await prisma.story.findUnique({
    where: {
      id: storyId,
    },
    select: {
      length: true,
    },
  });

  if (!storyLength) {
    return {
      numQuestions: 0,
      numCorrect: 0,
      wpm: 0,
    };
  }

  //get all answers for the story
  const items = await prisma.item.findMany({
    where: {
      storyId,
    },
  });

  const answers = items.map((item) => item.answer);
  console.log(answers);
  console.log(submissions);
  //for every submission, if submission in answers, increment score
  let score = 0;
  let total = 0;

  for (let submission of submissions) {
    if (answers.includes(submission)) {
      score++;
    }
    total++;
  }

  const wpm = timeToComplete ? storyLength.length / (timeToComplete / 60) : 0;

  //aggregate payload & sign it
  const payload = {
    numQuestions: total,
    numCorrect: score,
    wpm: wpm.toFixed(0),
  };

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not found in environment");
  }

  const signedPayload = jwt.sign(payload, process.env.JWT_SECRET);

  //attach to session
  cookies().set("quizResults", signedPayload);


  //return payload natively
  return payload;
}
