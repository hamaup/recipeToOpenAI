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

app.post('/api/generate-recipe', async (req, res) => {
  try {
    const value = req.body.value;
    const useOnlyFoodstuff = req.body.useOnlyFoodstuff;
    const cuisines = req.body.cuisines;
    let useOnly = ""
    if (useOnlyFoodstuff === 0) {
      useOnly = "のみ";
    }

    const completion = await openai.createChatCompletion({
      "model": "gpt-3.5-turbo",
      "messages": [
        { "role": "system", "content": "あなたは世界で有名なコックであり、庶民に人気のコックでもあります。" },
        {
          "role": "user",
          "content":
            `以下の制約条件と入力文をもとに、 最高のレシピを出力してください

        #制約条件:
        ・わかりやすく。
        ・重要なキーワードを取り残さない。
        ・文章を簡潔に。
        ・料理の種類は、${cuisines}
        ・必ず出力文の形式で出力すること

        #入力文:
        ${value}${useOnly}を使用した料理のレシピ

        #出力文:
        ・【料理名】（料理にあったオリジナル名）
        ・【調理時間】
        ・【材料】
        ・【作り方】
        `
        },
      ],
      temperature: 0.8
    });

    console.log(completion)
    const generatedText = completion.data.choices[0].message.content;
    res.json({ generatedText });
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  }
});

module.exports = app;