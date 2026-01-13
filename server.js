import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.post("/agent", async (req, res) => {
  const userTask = req.body.task;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a coding agent." },
        { role: "user", content: userTask }
      ]
    })
  });

  const data = await response.json();
  const output = data.choices[0].message.content;

  fs.writeFileSync("output.txt", output);

  res.json({ result: output });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Mini Antigravity running on", PORT);
});
