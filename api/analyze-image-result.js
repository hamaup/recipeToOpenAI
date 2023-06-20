require('dotenv').config();
const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
const cors = require('cors');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors());

const openai = new OpenAIApi(configuration);

app.use(express.json());

app.post('/api/analyze-image-result', async (req, res) => {
  try {
    const value = req.body.value;
    const completion = await openai.createChatCompletion({
      "model": "gpt-3.5-turbo",
      "messages": [
        { "role": "system", "content": "あなたは世界で食材選びのプロです。" },
        {
          "role": "user",
          "content":
            `以下の制約条件と入力文をもとに、 食べれる食材名の単語を出力してください

      #制約条件:
      ・食べれる食材名の単語のみ出力する
      ・食材名を半角カンマ区切りで出力する
      ・出力文は必ず「食材名: 食材名,食材名,食材名」形式で出力する。例外はない。
      ・食材名の重複をなくす
      ・食材名を日本語で出力する

      #入力文:
      ${value}から食材名の単語を抽出してください。

      #出力文:
      食材名: 食材名,食材名,食材名
      `
        },
      ],
      temperature: 0.8
    });

    const generatedText = completion.data.choices[0].message.content;
    res.json({ generatedText });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

module.exports = app;