import express from "express";
import line from "@line/bot-sdk";

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const app = express();
app.use(express.json());

// Data tutor (bisa kamu ganti)
const subjects = {
  Fisika: [
    {
      name: "Bu Rina",
      skill: "Fisika Dasar",
      edu: "S2 Pendidikan Fisika",
      rating: "4.8/5 ⭐",
      phone: "08123456789",
    },
    {
      name: "Pak Arman",
      skill: "Fisika SMA",
      edu: "S1 Fisika",
      rating: "4.6/5 ⭐",
      phone: "08561234567",
    },
  ],
  Matematika: [
    {
      name: "Bu Lilis",
      skill: "Kalkulus & Aljabar",
      edu: "S2 Matematika",
      rating: "4.9/5 ⭐",
      phone: "08987654321",
    },
  ],
  Bahasa: [
    {
      name: "Pak Budi",
      skill: "Bahasa Indonesia",
      edu: "S1 Pendidikan Bahasa",
      rating: "4.7/5 ⭐",
      phone: "08129876543",
    },
  ],
};

// Handle event
app.post("/webhook", line.middleware(config), async (req, res) => {
  const events = req.body.events;
  const client = new line.Client(config);

  for (const event of events) {
    if (event.type === "message" && event.message.type === "text") {
      const msg = event.message.text;

      // Step 1: tanya pelajaran
      if (msg === "mulai" || msg === "start") {
        await client.replyMessage(event.replyToken, {
          type: "text",
          text:
            "Mau belajar apa?\n\nPilih salah satu:\n- Fisika\n- Matematika\n- Bahasa",
        });
        continue;
      }

      // Step 2: jika user pilih pelajaran yang ada
      if (subjects[msg]) {
        const tutorList = subjects[msg]
          .map(
            (t, i) =>
              `${i + 1}. ${t.name}\nKeahlian: ${t.skill}\nPendidikan: ${
                t.edu
              }\nRating: ${t.rating}\n`
          )
          .join("\n");

        await client.replyMessage(event.replyToken, {
          type: "text",
          text:
            `Tutor untuk pelajaran *${msg}*:\n\n` +
            tutorList +
            `\nKetik angka tutor yang ingin dipilih (contoh: 1)`,
        });
        continue;
      }

      // Step 3: pilih tutor (angka)
      const num = parseInt(msg);
      if (!isNaN(num)) {
        for (const key in subjects) {
          const selected = subjects[key][num - 1];
          if (selected) {
            await client.replyMessage(event.replyToken, {
              type: "text",
              text: `Kontak tutor:\n\n${selected.name}\nTelp: ${selected.phone}`,
            });
            return;
          }
        }
      }

      // Default reply
      await client.replyMessage(event.replyToken, {
        type: "text",
        text:
          "Halo! Ketik *mulai* untuk memilih pelajaran dan menemukan tutor 😊",
      });
    }
  }

  res.status(200).end();
});

app.get("/", (req, res) => {
  res.send("LINE Tutor Bot is running!");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Bot running on port " + port));
