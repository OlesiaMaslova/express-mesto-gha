const express = require('express');
const { CardValidator, CardIdValidator } = require('../validators');

const cardRouter = express.Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', CardValidator, createCard);
cardRouter.delete('/cards/:cardId', CardIdValidator, deleteCard);
cardRouter.put('/cards/:cardId/likes', CardIdValidator, likeCard);
cardRouter.delete('/cards/:cardId/likes', CardIdValidator, dislikeCard);

module.exports = cardRouter;
