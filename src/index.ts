require("dotenv").config();
import { generateAnswer as heloApiGA } from "./tasks/helloapi";
import { generateAnswer as moderationGA } from "./tasks/moderation";
import { generateAnswer as bloggerGA } from "./tasks/blogger";
import { generateAnswer as liarGA } from "./tasks/liar";
import { generateAnswer as inPromptGA } from "./tasks/inprompt";
import { generateAnswer as embeddingGA } from "./tasks/embedding";
import { generateAnswer as whisperGA } from "./tasks/whisper";
import { generateAnswer as functionsGA } from "./tasks/functions";
import { generateAnswer as rodoGA } from "./tasks/rodo";
import { generateAnswer as scraperGA } from "./tasks/scraper";
import { generateAnswer as whoamiGA } from "./tasks/whoami";
import { performCourseTask } from "./performCourseTask";

//performCourseTask("helloapi", heloApiGA);
//performCourseTask("moderation", moderationGA);
//performCourseTask("blogger", bloggerGA);
// performCourseTask("liar", liarGA, {
//   task: {
//     body: {
//       question:
//         "Who is the author of the music album called 'Swordfishtrombones' from 1983?",
//     },
//     meta: {
//       asJSON: false,
//     },
//   },
//   answer: {
//     meta: {
//       asJSON: false,
//     },
//   },
// });
//performCourseTask("inprompt", inPromptGA);
//performCourseTask("embedding", embeddingGA);
// performCourseTask("whisper", whisperGA, {
//   answer: {
//     meta: {
//       asJSON: false,
//     },
//   },
// });
//performCourseTask("functions", functionsGA);
// performCourseTask("rodo", rodoGA, {
//   answer: {
//     meta: {
//       asJSON: false,
//     },
//   },
// });
// performCourseTask("scraper", scraperGA, {
//   answer: {
//     meta: {
//       asJSON: false,
//     },
//   },
// });
performCourseTask("whoami", whoamiGA, {
  answer: {
    meta: {
      asJSON: false,
    },
  },
});
