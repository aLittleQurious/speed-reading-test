"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import StoryComponent from "./ui/StoryComponent";
import { Button } from "@/components/ui/button";
import { Formik } from "formik";
import { useFormik } from "formik";
import { checkAnswers } from "./lib/action";

async function clientGetRandomStory() {
  const response = await fetch("/api/getRandomStory");
  return response.json();
}

export default function Home() {
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
    setIsReading(true);
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

      alert(Object.keys(submissionDict));
      const result = await checkAnswers({
        storyId: data.id,
        submissions: Object.keys(submissionDict),
        timeToComplete: timeDifference,
      });

      alert(JSON.stringify(result));
    },
  });

  //while reading, the user can click a button to start the quiz

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {JSON.stringify(data)}
      {isReading && (
        <div
          className={isBlurred ? "blur " : " " + "bg-slate-700"}
          onClick={handleBeginReading}
        >
          <StoryComponent
            title={data?.title || "Loading..."}
            storyText={data?.story || "Loading story..."}
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
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold text-black">
                Answer the following questions:
              </h1>
              //map through the questions and options
              {data?.quiz.map((item: any, index: number) => {
                return (
                  <div key={index}>
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
