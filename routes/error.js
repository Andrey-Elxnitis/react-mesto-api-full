const router = require('express').Router();

// для не существующих ресурсов возвращаем ошибку 404
router.all('/', (req, res) => {
  res.status(404).send({ message: 'Такого ресурса не сушествует' });
});

module.exports = router;
