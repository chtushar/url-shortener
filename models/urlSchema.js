const yup = require('yup');

const urlSchema = yup.object().shape({
  alias: yup
    .string()
    .trim()
    .matches(/^[\w\-]+$/i),
  url: yup.string().trim().url().required(),
  click: yup.number(),
});

module.exports = urlSchema;
