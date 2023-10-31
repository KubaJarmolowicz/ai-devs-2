import { HTTP_METHODS, baseUrl } from "./consts";
import { getSimulatedFormData } from "./utils";

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

const fetchTask = async (
  token: string,
  config: AIDevsAPI.CourseTaskAdditionalParams["task"] = {}
) => {
  console.log("@@@ fetching task...");
  const { body, meta } = config;
  const taskPath = `/task/${token}`;
  const taskBody = body
    ? meta.asJSON
      ? JSON.stringify(body)
      : getSimulatedFormData(body)
    : null;
  const req: RequestInit = {
    method: taskBody ? HTTP_METHODS.POST : HTTP_METHODS.GET,
  };
  if (taskBody) {
    req.body = taskBody;
  }
  console.log("@@@ req from fetchTask =>", req);
  const task: AIDevsAPI.FetchTask.Response = await fetch(
    `${baseUrl}${taskPath}`,
    req
  ).then((res) => res.json());

  return task;
};

const sendAnswer = async (
  token: string,
  answer: string,
  config: AIDevsAPI.CourseTaskAdditionalParams["answer"] = {}
) => {
  const paramsOK = !!token && !!answer;

  if (!paramsOK) {
    return;
  }

  const { meta = { asJSON: true } } = config;

  const parsedAnswer = meta?.asJSON ? JSON.parse(answer) : answer;
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

export const performCourseTask = async (
  taskName: string,
  generateAnswer: (
    task: unknown,
    additionalParams?: unknown
  ) => Promise<string>,
  additionalparams?: AIDevsAPI.CourseTaskAdditionalParams
) => {
  try {
    const token = await fetchToken(taskName);
    const task = await fetchTask(token, additionalparams?.task);
    console.log(`$$$ ${taskName} task needs you to do the following: `, task);
    const answer = await generateAnswer(task, additionalparams?.task);
    const response = await sendAnswer(token, answer, additionalparams?.answer);

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
