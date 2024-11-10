require("dotenv").config({path: "../../.env"});
const fs = require("fs");

const OpenAI = require("openai").OpenAI;
const openai= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

exports.openai = openai;
exports.runFineTune = async (filePath) => {
    const fileResponse = await openai.files.create({
        file: fs.createReadStream(filePath),
        purpose: "fine-tune"
    });
    const fileId = fileResponse.id;
    console.log("File:", fileResponse);
    console.log("File uploaded with ID:", fileId);

    const fineTuneResponse = await openai.fineTuning.jobs.create({
            "training_file":fileId,
            "model":"gpt-4o-mini-2024-07-18"
        }
    )

    console.log(fineTuneResponse);
    if(fineTuneResponse.error !== {}){
        return "error"
    }else{
        return fineTuneResponse.id
    }

}
exports.waitForFineTuneCompletion = (fineTuneId, interval = 5000) => {

    return new Promise((resolve, reject) => {
        const intervalId = setInterval(async () => {
            try {
                const response = await openai.fineTuning.jobs.retrieve(fineTuneId);
                const status = response.status;
                console.log(`Current status: ${status}`);

                if (status === 'succeeded') {
                    clearInterval(intervalId);
                    console.log('Fine-tuning succeeded:', response);
                    resolve(response); // 작업 완료 응답
                } else if (status === 'failed') {
                    clearInterval(intervalId);
                    console.error('Fine-tuning failed:', response);
                    reject(new Error('Fine-tuning failed')); // 오류 발생 시 예외
                }
            } catch (error) {
                clearInterval(intervalId);
                reject(error);
            }
        }, interval); // 지정된 시간 간격(5초)마다 상태 확인
    });
}
