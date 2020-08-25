const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

const urlRouter = require('./routes/url');
const app = express();
const PORT = process.env.PORT || 8888;

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use('/', express.static('public'));

app.use(urlRouter);

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});
