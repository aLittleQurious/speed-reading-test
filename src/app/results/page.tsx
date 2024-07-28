import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Results() {
  const cookieResponse = await cookies().get("quizResults");

  const data = jwt.decode(cookieResponse?.value ?? "");

  if (!cookieResponse) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-8 p-24">
        <div className="w-full flex flex-col items-center p-6 bg-slate-100 shadow-md rounded-lg">
          It appears you haven't taken a test. Plase take one first to receive results.
        </div>
      </main>
    );
  }


  return (
    <main className="flex min-h-screen flex-col items-center gap-8 p-24">
      <div className="w-full flex flex-col items-center p-6 bg-slate-100 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Results:
        </h1>
        <div className="flex flex-col gap-4 w-full text-3xl">
          You have a reading speed of {data?.wpm} words per minute. and after
          answering {data?.numQuestions} questions, you got {data?.numCorrect}{" "}
          correct. So you have a comprehension accuracy of{" "}
          {data?.numCorrect / data?.numQuestions}%.
        </div>
        <div className="mt-6">
          <Link href="/">
            <Button>Retry</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
