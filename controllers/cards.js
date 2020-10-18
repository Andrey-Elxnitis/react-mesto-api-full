const Card = require('../models/card');
const BadRequestErr = require('../errors/BadRequestErr');
const NotFoundErr = require('../errors/NotFoundErr');
const ForbiddenErr = require('../errors/ForbiddenErr');

// по запросу возвращаем все карточки
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(next);
};

// по запросу создаем карточку
const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .catch((err) => {
      throw new BadRequestErr({ message: `Переданы не корректные данные: ${err.message}` });
    })
    .then((card) => res.status(201).send(card))
    .catch(next);
};

// по запросу удаляем карточку
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .catch(() => {
      throw new NotFoundErr({ message: 'Нет такой карточки' });
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenErr({ message: 'Удалять можно только свои карточки' });
      }
      Card.findByIdAndDelete(req.params.cardId)
        .then(() => res.status(200).send({ message: 'Карточка удалена' }))
        .catch(next);
    })
    .catch(next);
};

// по запросу добавляем в массив лайк
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .catch(() => {
      throw new NotFoundErr({ message: 'Упс, такой карточки не существует' });
    })
    .then((likes) => {
      res.status(200).send(likes);
    })
    .catch(next);
};

// по запросу удаляем лайк из массива
const deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .catch(() => {
      throw new NotFoundErr({ message: 'Упс, такой карточки не существует' });
    })
    .then((likes) => {
      res.status(200).send(likes);
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
