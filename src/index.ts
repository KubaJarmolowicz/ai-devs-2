require("dotenv").config();
import { generateAnswer as heloApiGA } from "./tasks/helloapi";
import { generateAnswer as moderationGA } from "./tasks/moderation";
import { generateAnswer as bloggerGA } from "./tasks/blogger";
import { generateAnswer as liarGA } from "./tasks/liar";
import { performCourseTask } from "./performCourseTask";

//performCourseTask("helloapi", heloApiGA);
//performCourseTask("moderation", moderationGA);
//performCourseTask("blogger", bloggerGA);
performCourseTask("liar", liarGA, {
  task: {
    body: {
      question:
        "Who is the author of the music album called 'Swordfishtrombones' from 1983?",
    },
    meta: {
      asJSON: false,
    },
  },
  answer: {
    meta: {
      asJSON: false,
    },
  },
});
