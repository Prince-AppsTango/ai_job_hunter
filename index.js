import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cron from "node-cron";
import fetchJobs from "./services/jobFetcher.js";
import matchJob from "./services/aiMatcher.js";
import sendTelegram from "./services/telegram.js";
import Job from "./models/Job.js";
import connectDB from "./config/db.js";
connectDB();
const app = express();

// cron.schedule("* * * * *", async () => {
//   console.log("[TEST] Cron job running every minute!");

//   const jobs = await fetchJobs();

//   for (let item of jobs) {
//     const exists = await Job.findOne({ link: item.link });
//     if (exists) continue;

//     const score = await matchJob(item.contentSnippet);

//     const job = await Job.create({
//       title: item.title,
//       link: item.link,
//       description: item.contentSnippet,
//       matchScore: score,
//     });

//     if (score > 75) {
//       await sendTelegram(
//         `🔥 Job Match Found

// Title: ${job.title}
// Score: ${score}
// Link: ${job.link}`,
//       );

//       job.sent = true;
//       await job.save();
//     }
//   }
// });

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("AI Job Hunter Running 🚀");
});

cron.schedule("0 9 * * *", async () => {
  console.log("Running Job Hunter...");

  const jobs = await fetchJobs();

  for (let item of jobs) {
    const exists = await Job.findOne({ link: item.link });
    if (exists) continue;

    const score = await matchJob(item.contentSnippet);

    const job = await Job.create({
      title: item.title,
      link: item.link,
      description: item.contentSnippet,
      matchScore: score,
    });

    if (score > 75) {
      await sendTelegram(
        `🔥 Job Match Found

Title: ${job.title}
Score: ${score}
Link: ${job.link}`,
      );

      job.sent = true;
      await job.save();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
