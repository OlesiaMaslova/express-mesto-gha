const express = require('express');
const { CardValidator } = require('../validators');

const cardRouter = express.Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', CardValidator, createCard);
cardRouter.delete('/cards/:cardId', CardValidator, deleteCard);
cardRouter.put('/cards/:cardId/likes', CardValidator, likeCard);
cardRouter.delete('/cards/:cardId/likes', CardValidator, dislikeCard);

module.exports = cardRouter;
