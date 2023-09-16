import _config from '../config/config.json' assert {type: 'json'};
import { Configuration, OpenAIApi } from "openai";
import dotenv, { config } from "dotenv";
import fs from "fs"

dotenv.config();

const configuration = new Configuration({
    organization: process.env.ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const uploadfile = function(openai) {
  return openai.createFile(fs.createReadStream("./config/data.jsonl"), "fine-tune");
}

const log = async (data) => {

}

const train = async (data) => {
  console.log("training");

  const response = await openai.createFineTune({
    training_file: "file-GnU1smD9jrQUsWX371hkmu7m",
    model: 'davinci'
  });  
  
  console.log(response) // ft-9ZI3L6AH3tT5Nfhvnj9flLHd
}

const retrieve = async (data) => {
  console.log("training");

  const response = await openai.retrieveFineTune('ft-9ZI3L6AH3tT5Nfhvnj9flLHd');  

  console.log(response) // ft-9ZI3L6AH3tT5Nfhvnj9flLHd
}

const ask = async (prompt) => {
  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 1024,
      n: 1,
      stop: null,
      temperature: 0.7
    });

    return {
      success: true,
      message: completion.data.choices[0].text,
    };

  } catch (error) {
    console.log(error.message);
  }
}

const uploadFile = async (data) => {
  const openai = new OpenAIApi(configuration);

  const response = await uploadfile(openai);

  console.log(response)
}

export {
  train,
  uploadFile,
  retrieve,
  ask,
  log,
};