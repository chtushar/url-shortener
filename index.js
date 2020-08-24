const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const monk = require('monk');
const { nanoid } = require('nanoid');
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

const app = express();
const db = monk(process.env.MONGO_URI);
const PORT = process.env.PORT || 8888;

const urls = db.get('urls');
urls.createIndex({ alias: 1 }, { unique: true });

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use('/', express.static('public'));

app.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    id,
  });
});

const urlSchema = yup.object().shape({
  alias: yup
    .string()
    .trim()
    .matches(/^[\w\-]+$/i),
  url: yup.string().trim().url().required(),
  click: yup.number(),
});

app.post('/url', async (req, res, next) => {
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
