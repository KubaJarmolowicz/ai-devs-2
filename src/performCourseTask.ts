import { HTTP_METHODS, baseUrl } from "./consts";

const fetchToken = async (taskName: string): Promise<string> => {
  console.log("@@@ fetching token...");
  const taskPath = `/token/${taskName}`;
  const body: AIDevsAPI.FetchToken.Request = {
    apikey: `${process.env.AI_DEVS_API_KEY}`,
  };
  const token = await fetch(`${baseUrl}${taskPath}`, {
    method: HTTP_METHODS.POST,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data: AIDevsAPI.FetchToken.Response) => data.token);

  return token;
};

const fetchTask = async (token: string) => {
  console.log("@@@ fetching task...");
  const taskPath = `/task/${token}`;
  const task: AIDevsAPI.FetchTask.Response = await fetch(
    `${baseUrl}${taskPath}`,
    {
      method: HTTP_METHODS.GET,
    }
  ).then((res) => res.json());

  return task;
};

const sendAnswer = async (token: string, answer: string) => {
  const paramsOK = !!token && !!answer;

  if (!paramsOK) {
    return;
  }

  const parsedAnswer = JSON.parse(answer);
  console.log("@@@ sending the following answer => ", parsedAnswer);
  const taskPath = `/answer/${token}`;
  const body = {
    answer: parsedAnswer,
  };
  const resData: AIDevsAPI.BaseResponse = await fetch(`${baseUrl}${taskPath}`, {
    method: HTTP_METHODS.POST,
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => data);

  return resData;
};

//type AnswerGenerator<T, V> =  (task: T) => V;
//type PerformCourseTaskFn<T, V> = (taskName: string, generateAnswer: AnswerGenerator<T, V>) => void

export const performCourseTask = async (
  taskName: string,
  generateAnswer: (task: unknown) => Promise<string>
) => {
  try {
    const token = await fetchToken(taskName);
    const task = await fetchTask(token);
    console.log(`$$$ ${taskName} task needs you to do the following: `, task);
    const answer = await generateAnswer(task);
    const response = await sendAnswer(token, answer);

    if (response?.code === 0) {
      return console.log(`!!! SUCCESS !!! ${taskName} completed succesfully!`);
    }

    return console.log(
      "Something went wrong in performCourseTask =>",
      response
    );
  } catch (e) {
    console.error("ERROR in performCourseTask => ", e);
  }
};
