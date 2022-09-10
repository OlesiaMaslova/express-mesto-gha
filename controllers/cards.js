const Card = require('../models/card');
const { OK } = require('../utils');
const AccessDeniedError = require('../errors/AccessDeniedError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

async function getCards(req, res, next) {
  try {
    const cards = await Card.find({});
    res.status(OK).send(cards);
  } catch (err) {
    next(err);
  }
}

async function createCard(req, res, next) {
  const { name, link } = req.body;
  const id = req.user._id;
  try {
    const card = await new Card({ name, link, owner: id }).save();
    return res.status(OK).send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Некорректные данные карточки'));
    }
    return next(err);
  }
}

async function deleteCard(req, res, next) {
  const { cardId } = req.params;
  try {
    const card = await Card.findById(cardId);
    if (!card) {
      return next(new NotFoundError('Карточка с указанным id не найдена'));
    }
    if (!card.owner.equals(req.user._id)) {
      return next(new AccessDeniedError('Недостаточно прав у пользователя'));
    }
    await card.remove();
  } catch (err) {
    next(err);
  }
  return res.status(OK).send({ message: 'Карточка удалена' });
}

async function likeCard(req, res, next) {
  let card;
  try {
    card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError('Карточка с указанным id не найдена'));
    }
  } catch (err) {
    next(err);
  }
  return res.status(OK).send(card.likes);
}

async function dislikeCard(req, res, next) {
  let card;
  try {
    card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      return next(new NotFoundError('Карточка с указанным id не найдена'));
    }
  } catch (err) {
    next(err);
  }
  return res.status(OK).send(card.likes);
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
