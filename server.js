require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(
  cors({
    origin: [
      "https://tomohirokenshi.github.io/portfolio/",
      "http://localhost:3000",
    ],
  })
);
app.use((req, res, next) => {
  res.header({ "Access-Control-Allow-Origin": "*" });
  next();
});

app.post("/api/contact", async (req, res) => {
  const { name, email, number, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `New Message from ${name}`,
      text: `
You have received a new message from:
Name: ${name}
Email: ${email}
Phone: ${number}

Message:
${message}
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Message sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      error: "Failed to send message.",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
