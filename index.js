require('dotenv').config()

const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

morgan.token('body', request => {
  if (request.method === 'POST') {
    return JSON.stringify(request.body)
  }
})

app.use(
  morgan(':method :url :status :res[content-length] :response-time ms :body')
)

// let persons = [
//   {
//     name: 'Arto Hellas',
//     number: '040-123456',
//     id: 1
//   },
//   {
//     name: 'Ada Lovelace',
//     number: '39-44-5323523',
//     id: 2
//   },
//   {
//     name: 'Dan Abramov',
//     number: '12-43-234345',
//     id: 3
//   },
//   {
//     name: 'Mary Poppendieck',
//     number: '39-23-6423122',
//     id: 4
//   }
// ]

app.get('/info', (request, response) => {
  Person.find({}).then(result => {
    response.send(
      `<div>
        <p>Phonebook has info for ${result.length} people</p>
        <p>${new Date()}</p>
      </div>`
    )
  })
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => response.json(people))
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person.toJSON())
  })
})

app.delete('/api/persons/:id', (request, response) => {
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
})

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
