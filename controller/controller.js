import _config from "../config/config.json" assert { type: "json" };
import OpenAI from "openai";
import dotenv, { config } from "dotenv";
import fs from "fs";
import { User } from "./user.js"

dotenv.config();

let users = [];

const DEFAULT_PROCESSOR = "gpt-3.5-turbo-1106";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.ORGANIZATION,
});

// const appendPrompt = async (prompts = null) => {
//   if (prompts != undefined) {
//     prompts.map((_prompt) => {
//       messages.push(_prompt);
//     });
//   }
// };

const existUser = (id) => {
  return users.find((user) => {
    return user.getId() == id
  })
}

const getUser = (id) => {
  let user = existUser(id);

  if(!user)
  {
    user = new User(id)

    users.push(user);
  }

  return user
}

const sanitizeOutput = async (choice = null) => {
  if (choice.finish_reason == "stop") {
    return {
      s: 1,
      method: "message",
      message: choice.message.content,
    };
  } else if (choice.finish_reason == "function_call") {
    return {
      s: 1,
      method: "function_call",
      function_call: choice.message.function_call.name,
      arguments: JSON.parse(choice.message.function_call.arguments),
    };
  }
};

// const appendMessage = async (message = null) => {
//   if (message != undefined) {
//     messages.push(message);
//   }
// };

const getFunctionsBySchema = async (data = null) => {
  if (data.schema != undefined) {
    return {
      functions: [
        {
          name: "getCity",
          description: "Toma la ciudad donde vive el usuario",
          parameters: {
            type: "object",
            properties: {
              city: {
                type: "string",
                description: "Ciudad donde vive el usuario",
              },
            },
            required: ["city"],
          },
        },
        {
          name: "getUserEmail",
          description: "toma el correo electrónico del usuario",
          parameters: {
            type: "object",
            properties: {
              email: {
                type: "string",
                description: "Correo electrónico proporcionado por el usuario",
              },
            },
            required: ["email"],
          },
        },
        {
          name: "getUserName",
          description: "toma el nombre del usuario",
          parameters: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "nombre proporcionado por el usuario",
              },
            },
            required: ["name"],
          },
        },
        {
          name: "setFunnel",
          parameters: data.schema,
        },
      ],
      function_call: "auto",
    };
  }

  return [];
};

const ask = async (data = null) => {
  try {
    if (data.query == null) {
      throw new Error("Uh oh, no query was provided");
    }
   
    if (data.id == null) {
      throw new Error("Uh oh, no user id was provided");
    }

    let user = getUser(data.id)

    console.log("total_tokens",user.total_tokens)

    if(data.clearMessages)
    {
      user.clearMessages()
    } else {
      if(user.isExceded())
      {
        console.log("Excedding")
        user.clearMessages()
      }
    }

    user.appendPrompt(data.prompts);
    user.appendMessage({
      role: "user",
      content: data.query,
    });
    
    let functionsArray = await getFunctionsBySchema(data);
    
    let options = {
      model: data.processor ? data.process : DEFAULT_PROCESSOR,
      messages: user.messages,
      max_tokens: 4096
    }
    
    options = {...options, ...functionsArray}

    const chatCompletion = await openai.chat.completions.create(options);

    if (chatCompletion.choices[0].finish_reason == "stop") {
      user.appendMessage({
        role: "assistant",
        content: chatCompletion.choices[0].message.content,
      });
    }
    
    user.total_tokens = chatCompletion.usage.total_tokens

    return sanitizeOutput(chatCompletion.choices[0]);
  } catch (error) {
    console.error('error',error.message);

    return {
      s: 0,
      r: error.message,
    };
  }
};

const createImage = async (prompt) => {
  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }

    const image = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });

    log(image);

    return {
      success: true,
      url: image.data[0].url,
    };
  } catch (error) {
    console.log(error.message);
  }
};

const uploadfile = function (openai) {
  return openai.createFile(
    fs.createReadStream("./config/data.jsonl"),
    "fine-tune"
  );
};

const uploadFile = async (data) => {
  const openai = new OpenAIApi(configuration);

  const response = await uploadfile(openai);

  console.log(response);
};

const train = async (data) => {
  console.log("training");

  const response = await openai.createFineTune({
    training_file: "file-GnU1smD9jrQUsWX371hkmu7m",
    model: "davinci",
  });

  console.log(response); // ft-9ZI3L6AH3tT5Nfhvnj9flLHd
};

const retrieve = async (data) => {
  console.log("training");

  const response = await openai.retrieveFineTune("ft-9ZI3L6AH3tT5Nfhvnj9flLHd");

  console.log(response); // ft-9ZI3L6AH3tT5Nfhvnj9flLHd
};

const ask2 = async (prompt) => {
  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }

    const completion = await openai.completions.create({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 4096,
    });

    return {
      success: true,
      message: completion.choices[0].text,
    };
  } catch (error) {
    console.log(error.message);
  }
};

const log = (args) => {
  console.log("SERVER", args);
};

export { train, uploadFile, retrieve, createImage, ask, log };
