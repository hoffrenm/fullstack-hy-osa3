const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Insufficient arguments')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0-8uxq2.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('Phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => console.log(`${person.name} ${person.number}`))
    mongoose.connection.close()
  })
} else {
  const newPerson = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  newPerson.save().then(person => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}
