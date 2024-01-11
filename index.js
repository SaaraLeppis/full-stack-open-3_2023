require('dotenv').config()
const Contact = require('./models/contact')

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
//json parser to specify POST requests body as JavaScript object and places it to request object's body
app.use(express.json())
// 3.7 when only "tiny" format used
//app.use(morgan("tiny"))
//morgan - tiny(":method :url :status :res[content-length] - :response-time ms")
morgan.token('postPerson', req => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postPerson'
  )
)
app.use(cors())
// * * added for deploy
app.use(express.static('dist'))

// to generate id for new person
/* const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0
  return maxId + 1
} */
// 3.5 generate id for new person with math.random
/* const generateId = () => {
  const randomInteger = Math.floor(Math.random() * 1000)
  if (persons.find(person => person.id === randomInteger)) {
    return generateId
  } else {
    return randomInteger
  }
} */
// const isNameUnique = name => {
//   return true
//   /*   if (
//     Contact.find(person => person.name.toLowerCase() === name.toLowerCase())
//   ) {
//     return false
//   }
//   return true */
// }
app.get('/', (req, res) => {
  res.send('<h1>API to check Persons</h1>')
})
app.get('/api/persons', (req, res, next) => {
  //  res.json(persons)
  Contact.find({})
    .then(contacts => {
      res.json(contacts)
    })
    .catch(error => next(error))
})
/* app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  person ? res.json(person) : res.status(404).end()
}) */

// before expresp is taken into use
/* const app = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "application/json" })
  response.end(JSON.stringify(notes))
}) */
//3.2
app.get('/info', (req, res) => {
  Contact.find({}).then(people => {
    const timeStamp = Date()
    const contacts = people.length
    res.send(`<p>Phonebook has info for ${contacts} people. </p>
    <p>${timeStamp}</p>`)
  })
})
//3.3
app.get('/api/persons/:id', (req, res, next) => {
  /* const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  person ? res.json(person.number) : res.status(404).end() */
  Contact.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  /*  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end() */
  Contact.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body || !body.name || !body.number) {
    return res.status(400).json({
      error: 'content missing',
    })
  } /* else if (!isUnique(body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    })
  } */
  Contact.exists({ name: body.name })
    .then(isNameUnique => {
      if (!isNameUnique) {
        const person = new Contact({
          name: body.name,
          number: body.number,
        })

        return person.save()
      } else {
        return Promise.reject('name must be unique')
      }
    })
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => {
      /*  res.status(400).json({
        error: error || "Internal Server Error", */
      next(error)
    })

  /*person.save().then(savedPerson => {
    res.json(savedPerson)
  })*/
  /*   persons = persons.concat(person)
  // *** or
  //persons = [...persons, person]
  res.json(person) */
})

app.put('/api/persons/:id', (req, resp, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Contact.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then(updatedPerson => {
      resp.json(updatedPerson)
    })
    .catch(error => next(error))
})

//3.16 error Handler midware
const errorHandler = (error, request, response, next) => {
  console.error('errorHandler', error.name)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformated id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
