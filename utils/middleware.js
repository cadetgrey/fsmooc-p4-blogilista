const morgan = require('morgan')
// miks tää ei ole nuolifunktio?
morgan.token('requestData', function (req, res) { return JSON.stringify(req.body) })

const logger = morgan(':method :url :requestData :status :res[content-length] - :response-time ms')

const error = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  logger,
  error
}