const Card = require('../models/card');
const { OK, ERR_NOT_FOUND, ERR_BAD_REQUEST, ERR_SERVER_ERROR } = require('./utils');

async function getCards(req, res) {
  try {
    const cards = await Card.find({});
    res.status(OK).send(cards);
  } catch (err) {
    res.status(ERR_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
  }
}

async function createCard(req, res) {
  const { name, link } = req.body;
  const id = req.user._id;
  try {
    const card = await new Card({ name, link, owner: id }).save();
    res.status(OK).send(card);
  } catch (err) {
    if (err.errors.name.name || err.errors.link.name === 'ValidatorError') {
      res.status(ERR_BAD_REQUEST).send({ message: 'Некорректные данные карточки' });
      return;
    }
    res.status(ERR_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
  }
}

async function deleteCard(req, res) {
  const { cardId } = req.params;
  try {
    await Card.findByIdAndRemove(cardId);
    if (!cardId) {
      return res.status(ERR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    }
    res.status(OK).send({ message: 'Карточка удалена' });
  } catch (err) {
    res.status(ERR_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
  }
}

async function likeCard(req, res) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!req.params.cardId) {
      return res.status(ERR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    }
    res.status(OK).send(card.likes);
  } catch (err) {
    res.status(ERR_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
  }
}

async function dislikeCard(req, res) {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!req.params.cardId) {
      return res.status(ERR_NOT_FOUND).send({ message: 'Карточка с указанным id не найдена' });
    }
    res.status(OK).send(card.likes);
  } catch (err) {
    res.status(ERR_SERVER_ERROR).send({ message: 'Ошибка на сервере' });
  }
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
