const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const filePath = "./data/members.json";
router.get("/", (req, res) => {
  try {
    const data = fs.readFileSync(filePath);
    const members = JSON.parse(data);
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Error reading members" });
  }
});
