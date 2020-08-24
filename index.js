const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const nanoid = require('nanoid');

const app = express();
const PORT = process.env.PORT || 8888;

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
});

app.get('/wtf', (req, res) => {
  res.json({
    OK: 'ok',
  });
});

app.post('/url', async (req, res, next) => {
  let { alias, url } = req.body;
  try {
    await urlSchema.validate({
      alias,
      url,
    });
    if (!alias) {
      alias = nanoid();
    }
    alias = alias.toLowerCase();
    res.json({
      alias,
      url,
    });
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
