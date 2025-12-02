import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ———— 模块3：生成发布文案 ————
app.post("/api/generatePost", async (req, res) => {
  const userInput = req.body.userInput;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: `你是一个校园社交活动的文案生成 AI。
请根据用户需求，生成一段适合发布在校园论坛的活动招募文案。
风格要求：简单、轻松、无压力、有吸引力、易操作。`,
        },
        {
          role: "user",
          content: `用户想发布的活动需求：${userInput}`,
        },
      ],
    });

    res.json({
      generatedPost: response.choices[0].message.content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "生成失败" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
