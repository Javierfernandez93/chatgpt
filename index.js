import express, { json } from "express";
import { train, ask, uploadFile, retrieve, log } from "./controller/controller.js";
import dotenv, { config } from "dotenv";
import _config from './config/config.json' assert {type: 'json'};

dotenv.config();

const app = express();

app.use(express.json());

const port = 3000;

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
  let { query } = req.query;

  const response = await ask(query)

  res.status(200).send(response);
})

app.get("/retrieve", async (req, res) => {
  const response = await retrieve()

  res.status(200).send(response);
})

app.listen(port, () => {
  log(`ready on port ${port}`);
});
