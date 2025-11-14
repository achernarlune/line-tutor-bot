import express from "express";
import line from "@line/bot-sdk";

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const app = express();

app.post("/webhook", line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.status(200).end());
});

function handleEvent(event) {
  const client = new line.Client(config);
  return client.replyMessage(event.replyToken, {
    type: "text",
    text: "Halo! Bot kamu sudah jalan!"
  });
}

app.listen(3000, () => {
  console.log("Bot berjalan di port 3000");
});
