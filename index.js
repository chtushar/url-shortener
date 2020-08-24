const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const monk = require('monk');
const { nanoid } = require('nanoid');
require('dotenv').config();

const app = express();
const db = monk(process.env.MONGO_URI);
const PORT = process.env.PORT || 8888;

const urls = db.get('urls');
urls.createIndex('name');

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

const urlSchema = yup.object().shape({
  alias: yup
    .string()
    .trim()
    .matches(/[\w\-]/i),
  url: yup.string().trim().url().required(),
  clicks: yup.number(),
});

// app.get('/:id', (req, res) => {});

app.post('/url', async (req, res, next) => {
  let { alias, url } = req.body;
  try {
    await urlSchema.validate({
      alias,
      url,
    });
    if (!alias) {
      alias = nanoid(4);
    } else {
      const check = await urls.findOne({ alias });
      if (check) {
        throw new Error('Alias in use.');
      }
    }
    //alias = alias.toLowerCase();
    const U = {
      alias,
      url,
      clicks: 0,
    };
    const created = await urls.insert(U);
    res.json(created);
  } catch (error) {
    next(error);
  }
});

// app.get('/url/:id', (req, res) => {});

app.use((err, req, res, next) => {
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

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
