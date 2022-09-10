const express = require('express');
const { CardValidator, CardLikeValidator } = require('../validators');

const cardRouter = express.Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', CardValidator, createCard);
cardRouter.delete('/cards/:cardId', deleteCard);
cardRouter.put('/cards/:cardId/likes', CardLikeValidator, likeCard);
cardRouter.delete('/cards/:cardId/likes', CardLikeValidator, dislikeCard);

module.exports = cardRouter;
