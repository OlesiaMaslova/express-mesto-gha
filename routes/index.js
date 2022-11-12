const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const { AuthorizationValidator, RegistrationValidator } = require('../validators');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
router.post('/signin', AuthorizationValidator, login);
router.post('/signup', RegistrationValidator, createUser);
router.use(auth);
router.use('/', userRouter);
router.use('/', cardRouter);

// eslint-disable-next-line no-unused-vars
router.use('*', (req, res) => {
  throw new NotFoundError('Запрашиваемая страница не найдена');
});

module.exports = {
  router,
};
