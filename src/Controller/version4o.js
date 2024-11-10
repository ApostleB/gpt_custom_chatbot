const express = require('express');
const ver4Router          = express.Router();
const fs = require("fs");

require("dotenv").config();


const OpenAI = require("openai").OpenAI;
const openai= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

ver4Router.get('/tune', async (req, res) => {
    const rtn = {};
    try{

        rtn.filePath = "./4o_qa.jsonl";

        // JSONL 파일 업로드
        const fileResponse = await openai.files.create({
            file: fs.createReadStream(rtn.filePath),
            purpose: "fine-tune"
        });

        if(fileResponse.status === "error"){
            rtn.result.status = "error";
            return res.json(rtn)
        }

        rtn.fileId = fileResponse.id ?? false;

        const runTune = await openai.fineTuning.jobs.create({
                "training_file":rtn.fileId,
                "model":"gpt-4o-mini-2024-07-18"
            }
        )

        rtn.result = runTune;
        return res.json(runTune)
    }catch (e) {
        return res.json({"result":"failed"})
    }

})

ver4Router.get('/status', async (req, res) => {

    // ftjob-6aNm13tsSFwKrcA6eFtiSa4A
    const completion = await openai.fineTuning.jobs.retrieve("ftjob-vLEyf0aoXaPM55YbHsmDrtAx")

    console.log(completion);
    return res.send({});

})
ver4Router.get('/start', async (req, res) => {
    const completion = await openai.chat.completions.create(
        {
            model: 'ft:gpt-4o-mini-2024-07-18:personal::ARLO0IjM',
            "messages":[{"role": "user", "content": "입금은 어떻게 하나요?"}],
        }
    )

    console.log(completion.choices[0].message);
    return res.send(completion.choices[0].message.content);

})

ver4Router.get('/fine-tune', async (req, res) => {


    return res.json({})
});

ver4Router.get('/delete/tune', async (req, res) => {

});


module.exports = ver4Router;
