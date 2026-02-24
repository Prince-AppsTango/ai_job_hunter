import axios from "axios";

const matchJob = async (jobText) => {

  const shortCV = `
Front-End & Mobile Developer
4+ years experience
React, React Native, Flutter
Kotlin, TypeScript, Firebase
Built scalable production apps
`;

  const prompt = `
Candidate Profile:
${shortCV}

Job Description:
${jobText.slice(0, 1500)}

Return ONLY a number between 0-100.
`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
        max_tokens: 10
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return parseInt(response.data.choices[0].message.content.trim());

  } catch (error) {
    console.log("Groq Error:", error.response?.data);
    throw error;
  }
};

export default matchJob;