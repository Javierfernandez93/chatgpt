import _config from '../config/config.json' assert {type: 'json'};
import OpenAI from "openai";
import dotenv, { config } from "dotenv";
import fs from "fs"

dotenv.config();

const DEFAULT_PROCESSOR = "gpt-3.5-turbo"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.ORGANIZATION
});

const ask = async (data = null) => {
  
  try {
    if (data.prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }

    data.messages.push({
      "role" : "user", 
      "content" : data.prompt
    })

    const chatCompletion = await openai.chat.completions.create({
      model: data.processor ? data.process : DEFAULT_PROCESSOR,
      messages : data.messages
    });

    return {
      success: true,
      message: chatCompletion.choices[0].message.content
    };

  } catch (error) {
    console.log(error.message);

    return {
      s : 0
    }
  }

  return {
    s: 0
  }
}

const createImage = async (prompt) => {
  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }

    const image = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "512x512"
    });

    log(image)

    return {
      success: true,
      url: image.data[0].url
    };

  } catch (error) {
    console.log(error.message);
  }
}

const uploadfile = function(openai) {
  return openai.createFile(fs.createReadStream("./config/data.jsonl"), "fine-tune");
}

const uploadFile = async (data) => {
  const openai = new OpenAIApi(configuration);

  const response = await uploadfile(openai);

  console.log(response)
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

const ask2 = async (prompt) => {
  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }

    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 50
    });

    return {
      success: true,
      message: completion.choices[0].text
    };

  } catch (error) {
    console.log(error.message);
  }
}

const log = (args) =>
{
  console.log('SERVER', args)
}

export {
  train,
  uploadFile,
  retrieve,
  createImage,
  ask,
  log
};
