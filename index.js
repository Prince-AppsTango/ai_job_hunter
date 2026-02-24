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
//   console.log("Cron job running every minute!");

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


// * * * * *
// │ │ │ │ │
// │ │ │ │ └── Day of week (0–7) (Sunday = 0 or 7)
// │ │ │ └──── Month (1–12)
// │ │ └────── Day of month (1–31)
// │ └──────── Hour (0–23)
// └────────── Minute (0–59)


const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("AI Job Hunter Running 🚀");
});

cron.schedule("30 3 * * *", async () => {
  console.log("🚀 Running Job Hunter...");

  const jobs = await fetchJobs();

  const threshold = 70;

  for (let item of jobs) {

    // 🔹 Skip if already exists
    const exists = await Job.findOne({ link: item.link });
    if (exists) continue;

    // 🔹 Basic keyword filter (cheap filtering)
    const devKeywords = [
      "developer",
      "engineer",
      "frontend",
      "react",
      "javascript",
      "mobile",
      "flutter",
      "kotlin"
    ];

    const isRelevant = devKeywords.some(keyword =>
      item.title.toLowerCase().includes(keyword) ||
      item.contentSnippet.toLowerCase().includes(keyword)
    );

    if (!isRelevant) continue;

    // 🔹 AI Match
    const result = await matchJob(item.contentSnippet);
    console.log(`Job: ${item.title} | Score: ${result.score}`);
    // 🔥 Only insert if good match
    if (result.score >= threshold) {

      const job = await Job.create({
        title: item.title,
        link: item.link,
        description: item.contentSnippet,
        matchScore: result.score,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        sent: true,
      });

      const message = `
🔥 High Match Job Found

Title: ${job.title}
Score: ${result.score}

✅ Matched Skills:
${result.matchedSkills.join(", ") || "N/A"}

❌ Missing Skills:
${result.missingSkills.join(", ") || "None"}

Link:
${job.link}
`;

      await sendTelegram(message);
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
