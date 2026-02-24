import axios from "axios";

const matchJob = async (jobText) => {
  const structuredCV = {
    role: "Front-End & Mobile Developer",
    experience: 4,
    skills: [
      "React",
      "React Native",
      "Flutter",
      "Kotlin",
      "TypeScript",
      "Firebase",
      "Redux",
      "Jetpack Compose",
      "Room",
      "WorkManager",
      "REST APIs",
      "Real-time systems",
    ],
    level: "Mid-Senior",
  };

  const prompt = `
You are a strict AI job matching engine.

Return ONLY valid JSON in this format:
{
  "score": number,
  "matchedSkills": [],
  "missingSkills": []
}

Rules:
- score must be integer between 0 and 100
- no decimals
- no explanation
- no markdown
- no extra text

If job is not software development related, return score 0.

Candidate:
${JSON.stringify(structuredCV)}

Job:
${jobText.slice(0, 1500)}
`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You only return strict JSON." },
          { role: "user", content: prompt },
        ],
        temperature: 0.1,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY?.replace(/^["']|["']$/g, '')}`,
          "Content-Type": "application/json",
        },
      },
    );

    let raw = response.data.choices[0].message.content.trim();

    // Remove markdown if model adds it
    raw = raw.replace(/```json|```/g, "");

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      console.log("⚠️ Invalid JSON from AI:", raw);

      return {
        score: 0,
        matchedSkills: [],
        missingSkills: [],
      };
    }

    //Score normalization safeguard
    let score = parseInt(parsed.score);

    if (isNaN(score)) score = 0;
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    return {
      score,
      matchedSkills: parsed.matchedSkills || [],
      missingSkills: parsed.missingSkills || [],
    };
  } catch (error) {
    console.log("Groq Error:", error.response?.data);

    return {
      score: 0,
      matchedSkills: [],
      missingSkills: [],
    };
  }
};

export default matchJob;
