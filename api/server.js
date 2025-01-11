require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from the environment or default to 5000

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["https://tomohirokenshi.github.io", "http://localhost:3000"], // Allow multiple origins
  })
);

// POST route to handle contact form submissions
app.post("/api/contact", async (req, res) => {
  const { name, email, number, message } = req.body;

  try {
    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email options
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

    // Send the email
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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
