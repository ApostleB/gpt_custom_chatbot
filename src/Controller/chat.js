const fs = require("fs");
require("dotenv").config();
const { openai, runFineTune, waitForFineTuneCompletion } = require("../Util/chatbot");

exports.syncFineTune = async (req, res) => {
    const tuneId = await runFineTune("./4o_qa.jsonl")
    if(tuneId === "error"){
        return res.send("error")
    }else{
        const result = await waitForFineTuneCompletion(tuneId);
        return res.send(result);
    }
}

exports.asyncFineTune = async (req, res) => {
    const tuneId = await runFineTune("./4o_qa.jsonl")
    if(tuneId === "error") return res.json({});
    else return res.json({"id":tuneId});
}

//현재 프로세스 리스트
exports.tuneList = async (req, res) => {
    const list = await openai.fineTuning.jobs.list()
    let result = [];
    list.data.forEach((item) => {
        const data = {
            "id":item.id,
            "status":item.status,
            "error":item.error?.code,
            "created_at":item.created_at,
        }
        result.push(data)
    })
    return res.json(result)
}

exports.execChat = async (req, res) => {
    const sucTuneId = "personal::ARLO0IjM"
    const currentModel = "ft:"+process.env.OPENAI_MODEL + ":" + sucTuneId
    const content = req.body.content ?? "너는 어떤 서비스야??"

    const completion = await openai.chat.completions.create(
        {
            model: currentModel,
            "messages":[{"role": "user", "content": content}],
        }
    )
    return res.send(completion.choices[0].message.content);
}

