require("dotenv").config();
import { generateAnswer as heloApiGA } from "./tasks/helloapi";
import { generateAnswer as moderationGA } from "./tasks/moderation";
import { generateAnswer as bloggerGA } from "./tasks/blogger";
import { performCourseTask } from "./performCourseTask";

//performCourseTask("helloapi", heloApiGA);
//performCourseTask("moderation", moderationGA);
performCourseTask("blogger", bloggerGA);
