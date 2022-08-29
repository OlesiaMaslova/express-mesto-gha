const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { ERR_NOT_FOUND } = require('./utils');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6309610ef3128c02972ba531',
  };
  next();
});
app.use('/', userRouter);

app.use('/', cardRouter);

app.get('*', (req, res) => {
  res.status(ERR_NOT_FOUND).send({ message: 'Запрашиваемая страница не найдена' });
});

async function main() {
  await mongoose.connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
