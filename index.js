const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 8888;

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

app.get('/:id', (req, res) => {
  res.json(req);
});

app.post('/url', (req, res) => {
  //set
});

app.get('/url/:id', (req, res) => {});

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
