import { checkAnswers } from "./action";
import { getItems } from "./action";



test("check my test", async () => {
  const eOutput = {
    numQuestions: 2,
    numCorrect: 2,
    wpm: 0,
  };

  const output = await checkAnswers({
    storyId: "dummy-story-id",
    submissions: ["Dummy Answer 1", "Dummy Answer 2"],
  });

  expect(output).toEqual(eOutput);
});

test("get questions correctly", async () => {


  const response = await getItems({storyId: "dummy-story-id", count: 2});
  //list of 
  expect(response[0]).toHaveProperty("options")
  expect(response[0]).toHaveProperty("question")


});
