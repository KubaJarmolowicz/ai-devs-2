import { apiKey, baseUrl } from "./consts";

const fetchToken = async (taskName: string) => {
  const taskPath = `/token/${taskName}`;
  const body = {
    apikey: apiKey,
  };
  const token = await fetch(`${baseUrl}${taskPath}`, {
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => data.token);

  return token;
};

const fetchTask = async (token: string) => {
  const taskPath = `/task/${token}`;
  const task = await fetch(`${baseUrl}${taskPath}`, {
    method: "GET",
  }).then((res) => res.json());

  return task;
};

const sendAnswer = async (token: string, cookie: string) => {
  const taskPath = `/answer/${token}`;
  const body = {
    answer: cookie,
  };
  const code = await fetch(`${baseUrl}${taskPath}`, {
    method: "POST",
    body: JSON.stringify(body),
  })
    .then((res) => res.json())
    .then((data) => data.code);

  return code;
};

export const performCourseTask = async (taskName: string) => {
  try {
    const token = await fetchToken(taskName);
    const task = await fetchTask(token);
    const cookie = task.cookie;
    const responseCode = await sendAnswer(token, cookie);

    if (responseCode === 0) {
      return console.log("!!! SUCCESS !!!");
    }
  } catch (e) {
    console.log("ERROR :( => ", e);
  }
};
