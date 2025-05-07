const express = require("express");
const router = express.Router();
const { Theme } = require("../../db/models");

router.get("/", async (req, res) => {
  try {
    const themes = await Theme.findAll();
    res.json(themes);
  } catch (error) {
    console.error("Ошибка при получении тем:", error);
    res.status(500).json({ error: "Ошибка при получении тем" });
  }
});

router.post("/", async (req, res) => {
  const { name, imagePath } = req.body;
  try {
    const theme = await Theme.create({ name, imagePath });
    res.json(theme);
  } catch (error) {
    console.error("Ошибка при создании темы:", error);
    res.status(500).json({ error: "Ошибка при создании темы" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const themes = await Theme.findAll();

    // const mapedThemes = themes.map((theme) => theme.get({plain: true}));
    // console.log(mapedThemes);
    res.json(themes);
  } catch (error) {
    console.log(error);

    res.status(400).json(error);
  }
});

module.exports = router;
