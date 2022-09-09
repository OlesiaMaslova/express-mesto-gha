const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { PORT, DB_ADDRESS } = require('./config');
const { AuthorizationValidator, RegistrationValidator } = require('./validators');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');

const app = express();
app.use(bodyParser.json());

app.post('/signin', AuthorizationValidator, login);
app.post('/signup', RegistrationValidator, createUser);
app.use(auth);
app.use('/', userRouter);
app.use('/', cardRouter);

app.get('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемая страница не найдена'));
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

async function main() {
  await mongoose.connect(DB_ADDRESS, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  });

  await app.listen(PORT);
}

main();
