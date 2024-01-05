const express = require("express")
const app = express()
//json parser to specify POST requests body as JavaScript object and places it to request object's body
app.use(express.json())
let persons = [
  {
    name: "Arto Hellas",
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
// to generate id for new note
const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0
  return maxId + 1
}

app.get("/", (req, res) => {
  res.send("<h1>API to check Persons</h1>")
})
app.get("/api/persons", (req, res) => {
  res.json(persons)
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

  if (!body) {
    return res.status(400).json({
      error: "content missing",
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }
  persons = persons.concat(person)
  resp.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
