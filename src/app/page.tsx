"use client";
import Image from "next/image";
import { useState } from "react";
import StoryComponent from "./ui/StoryComponent";
import { Button } from "@/components/ui/button";
import { Formik } from 'formik'
import { useFormik } from "formik";
import { checkAnswers, getRandomStory } from "./lib/action";

export default async function Home() {
  const [onReading, setOnReading] = useState(false);

  //onload, get a random story and then display
  const data = await fetch




  //prep the formik form
  const formik = useFormik({
    initialValues: {
      storyId: "",
      count: 0,
    },
    onSubmit: async (values) => {
      formik.setValues({
        storyId: "2",
        count: 5,
      });
    },


  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {onReading ? (
        <>
          <Button onClick={() => {}}>Done Reading</Button>
        </>
      ) : (
        <>
            <StoryComponent title="TITLE" storyText="StoryText" />
            <Button onClick={() => {}}>Submit Questions</Button>
        </>
      )}
    </main>
  );
}
