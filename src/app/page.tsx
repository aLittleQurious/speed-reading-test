"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import StoryComponent from "./ui/StoryComponent";
import { Button } from "@/components/ui/button";
import { Formik } from "formik";
import { useFormik } from "formik";
import { checkAnswers } from "./lib/action";
import clsx from "clsx";
import { useRouter } from "next/navigation";

async function clientGetRandomStory() {
  const response = await fetch("/api/getRandomStory");
  return response.json();
}

export default function Home() {
  const router = useRouter();
  //We have 2 phases, reading and quizzing. isreading is the default state, and when the user clicks the start button, it will change to false.

  //state tracking
  const [isReading, setIsReading] = useState(true);
  const [isQuizzing, setIsQuizzing] = useState(false);
  //This is a supporting state for the blurring of the reading passage
  const [isBlurred, setIsBlurred] = useState(true);
  const [data, setData] = useState<any>(null);
  const [timeDifference, setTimeDifference] = useState(100);

  useEffect(() => {
    const fetchData = async () => {
      const story = await clientGetRandomStory();
      setData(story);
    };
    fetchData();
  }, []);

  //when user is reading, set to true.

  //time tracking
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const handleBeginReading = () => {
    setIsBlurred(false);
    setStartTime(Date.now());
  };

  const handleDoneReading = (e: any) => {
    if (!startTime) {
      return;
    }
    const now = Date.now();
    setTimeDifference((now - startTime) / 1000);

    e.preventDefault();
    setIsReading(false);
    setIsQuizzing(true);
  };

  //prep the formik form
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (submissionDict: { [key: string]: string }) => {
      const result = await checkAnswers({
        storyId: data.id,
        submissions: Object.keys(submissionDict),
        timeToComplete: timeDifference,
      });
      router.push("/results");

    },
  });

  //while reading, the user can click a button to start the quiz

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-24">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
        Click Below to Begin!
      </h1>
      {isReading && (
        <div
          className={clsx(" w-full flex flex-col gap-8 items-center", {
            "blur ": isBlurred,
          })}
          onClick={handleBeginReading}
        >
          <StoryComponent
            title={data?.title || "Loading..."}
            storyText={data?.story || "Loading story..."}
            className="text-center"
          />
          <Button
            className={isBlurred ? "hidden" : ""}
            onClick={handleDoneReading}
          >
            Done Reading
          </Button>
        </div>
      )}
      {isQuizzing && (
        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex flex-col gap-4 justify-center w-full mx-auto p-6 bg-slate-100 shadow-md rounded-lg">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                Answer the following questions:
              </h1>
              {data?.quiz.map((item: any, index: number) => {
                return (
                  <div key={index} className="">
                    <h2>{item.question}</h2>
                    {item.options.map((option: string) => {
                      return (
                        <div key={index}>
                          <input
                            type="radio"
                            id={option}
                            name={item.question}
                            onChange={formik.handleChange}
                            value={item.option}
                          />
                          <label htmlFor={option}>{option}</label>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
