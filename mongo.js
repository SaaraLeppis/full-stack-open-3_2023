const mongoose = require("mongoose")

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://saara:${password}@leppis.meqgdmm.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Contact = mongoose.model("Contact", personSchema)

const saveContact = () => {
  const contact = new Contact({
    name: newName,
    number: newNumber,
  })
  contact.save().then(result => {
    console.log(`added ${newName} number ${newNumber} to phonebook`)
    mongoose.connection.close()
  })
}
const listContacts = () => {
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length === 5) {
  saveContact()
} else if (process.argv.length === 3) {
  listContacts()
} else if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
} else if (process.argv.length > 5) {
  console.log("too many arguments")
  process.exit(1)
}
