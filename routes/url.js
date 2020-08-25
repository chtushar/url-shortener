const express = require('express');
const { nanoid } = require('nanoid');
const router = new express.Router();
const db = require('../db/setup');
const urlSchema = require('../models/urlSchema');

const urls = db.get('urls');
urls.createIndex({ alias: 1 }, { unique: true });

router.get('/:id', async (req, res) => {
  const { id: alias } = req.params;
  try {
    const url = await urls.findOne({ alias });
    if (url) {
      return res.redirect(url.url);
    } else {
      return res.redirect('https://www.instagram.com/xyz.tush/');
    }
  } catch (err) {
    return res.redirect('https://www.instagram.com/xyz.tush/');
  }
});

router.post('/url', async (req, res, next) => {
  let { alias, url } = req.body;
  try {
    await urlSchema.validate({
      alias,
      url,
    });
    if (!alias) {
      alias = nanoid(5);
    } else {
      const e = await urls.findOne({ alias });
      if (e) {
        throw new Error('Alias in Use.');
      }
    }

    const U = {
      url,
      alias,
      click: 0,
    };
    const created = await urls.insert(U);
    res.json(created);
  } catch (err) {
    next(err);
  }
});

//Error Handler
router.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status);
  } else {
    res.status(500);
  }
  res.json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = router;
