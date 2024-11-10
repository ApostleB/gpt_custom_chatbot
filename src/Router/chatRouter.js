const express = require('express');
const chatRouter          = express.Router();
const { syncFineTune, asyncFineTune, execChat } = require("../Controller/chat.js");
const fs = require("fs");
const {tuneList} = require("../Controller/chat");

require("dotenv").config();

const OpenAI = require("openai").OpenAI;
const openai= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

chatRouter.get('/sync/fine-tune', syncFineTune)
chatRouter.get('/async/fine-tune', asyncFineTune)
chatRouter.get('/list', tuneList)
chatRouter.get('/check', async (req, res) => {
    // const result = await waitForFineTuneCompletion("ftjob-rrQoJrlzcgqaNSjbE8G7Pk9K");
    // console.log(result);
    // return res.send(result);
})

chatRouter.get('/start', async (req, res) => {
    const completion = await openai.chat.completions.create(
        {
            model: 'ft:gpt-4o-mini-2024-07-18:personal::ARLO0IjM',
            "messages":[{"role": "user", "content": "입금은 어떻게 하나요?"}],
        }
    )

    return res.send(completion.choices[0].message.content);
})

module.exports = chatRouter;
