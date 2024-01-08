require("dotenv").config()
const mongoose = require("mongoose")
const Contact = require("./models/contact")

const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

const app = express()
//json parser to specify POST requests body as JavaScript object and places it to request object's body
app.use(express.json())
// 3.7 when only "tiny" format used
//app.use(morgan("tiny"))
//morgan - tiny(":method :url :status :res[content-length] - :response-time ms")
morgan.token("postPerson", (req, res) => {
  return req.method === "POST" ? JSON.stringify(req.body) : ""
})
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :postPerson"
  )
)
app.use(cors())
// * * added for deploy
app.use(express.static("dist"))

// * * MONGOOSE * *
/* const url = process.env.MONGODB_URI
mongoose.set("strictQuery", false)
mongoose.connect(url)

const PersonSchema = new mongoose.Schema({
  name: String,
  number: String,
})
PersonSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Contact = mongoose.model("contact", PersonSchema) */

let persons = [
  {
    name: "Artö Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
]

/* let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
] */

// to generate id for new person
/* const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0
  return maxId + 1
} */
// 3.5 generate id for new person with math.random
const generateId = () => {
  const randomInteger = Math.floor(Math.random() * 1000)
  if (persons.find(person => person.id === randomInteger)) {
    return generateId
  } else {
    return randomInteger
  }
}
const isUnique = name => {
  if (
    persons.find(person => person.name.toLowerCase() === name.toLowerCase())
  ) {
    return false
  }
  return true
}
app.get("/", (req, res) => {
  res.send("<h1>API to check Persons</h1>")
})
app.get("/api/persons", (req, res) => {
  //  res.json(persons)
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
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
app.get("/info", (req, res) => {
  res.send(
    ` <p>Phonebook has info for ${persons.length} people</p>
      <p>${Date()}</p>
    `
  )
})
//3.3
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  person ? res.json(person.number) : res.status(404).end()
})

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post("/api/persons", (req, res) => {
  const body = req.body
  console.log(body, "is body")

  if (!body || !body.name || !body.number) {
    return res.status(400).json({
      error: "content missing",
    })
  } else if (!isUnique(body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  persons = persons.concat(person)
  // *** or
  //persons = [...persons, person]
  res.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
