const morgan = require('morgan')

morgan.token('requestData', (req, res) => { return JSON.stringify(req.body) })
const logger = morgan(':method :url :requestData :status :res[content-length] - :response-time ms')

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization')
  if (auth && auth.toLowerCase().startsWith('bearer')) {
    req.token = auth.substring(7)
    console.log(req.token)
  } else {
    req.token = null
  }
  next()
}

const error = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

module.exports = {
  logger,
  error,
  tokenExtractor
}