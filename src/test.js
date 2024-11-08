const express = require('express');
const testRouter          = express.Router();
const fs = require("fs");

require("dotenv").config({path: "../.env"});


const OpenAI = require("openai").OpenAI;
const openai= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


testRouter.get('/fine-tune', async (req, res) => {
    const filePath = "./qa.jsonl";

    const fileResponse = await openai.files.create({
        file: fs.createReadStream("./qa.jsonl"),
        purpose: "fine-tune"
    });

    console.log(fileResponse);

    return res.json({})
});

testRouter.get('/delete/tune', async (req, res) => {

});


module.exports = testRouter;