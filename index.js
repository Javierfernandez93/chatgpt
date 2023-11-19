import express, { json } from "express";
import { train, ask, createImage, uploadFile, retrieve, log } from "./controller/controller.js";
import dotenv, { config } from "dotenv";
import bodyParser from "body-parser";
import _config from './config/config.json' assert {type: 'json'};
import cors from 'cors'

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 3001;

app.get("/", async (req, res) => {
  res.status(200).send({ s: 1, r: "all_services_working" });
});

app.get("/uploadFile", async (req, res) => {
  await uploadFile()

  res.status(200).send({s:1});  
})

app.get("/train", async (req, res) => {
  await train()

  res.status(200).send({s:1});
})

app.get("/ask", async (req, res) => {
  let { query, prompts, schema, clearMessages, id } = req.query;

  log(`GET ask ${query} [clearMessages:${clearMessages}]`)

  const response = await ask({
    clearMessages : clearMessages && clearMessages == 'true' ? false : false,
    schema : schema,
    id : id,
    prompts : prompts ?? null,
    query : query
  })

  log(`reply ${response.message}`)

  res.status(200).send(response);
})

app.post("/ask", async (req, res) => {
  let { query, messages, clearMessages } = req.body;

  log(`ask ${query} = clearMessages ${clearMessages}`)
  
  const response = await ask({
    clearMessages : clearMessages && clearMessages == 'true' ? false : false,
    messages : messages ?? null,
    prompt : query
  })

  log(`reply ${response.message}`)

  res.status(200).send(response);
})

app.post("/ask", async (req, res) => {
  let { query, messages } = req.body;

  log(`ask ${req.body}`)
  
  const response = await ask({
    messages : messages ?? null,
    prompt : query
  })

  log(`reply ${response.message}`)

  res.status(200).send(response);
})

app.get("/image", async (req, res) => {
  let { query } = req.query;

  console.log(`ask ${query}`)
  
  const response = await createImage(query)

  res.status(200).send(response);
})

app.get("/retrieve", async (req, res) => {
  const response = await retrieve()

  res.status(200).send(response);
})

app.listen(port, () => {
  log(`ready on port ${port}`);
});
