import Persons from "./components/Persons"

import PersonForm from "./components/PersonForm"

import Notification from "./components/Notification"

import Filter from "./components/Filter"

import { useState, useEffect } from "react"

import personService from "./services/persons"

const App = () => {
  //use state
  const [persons, setPersons] = useState([])

  const [shownPersons, setShownPersons] = useState([])

  const [newName, setNewName] = useState("")

  const [newNumber, setNewNumber] = useState("")

  const [filter, setFilter] = useState("")

  const [notification, setNotification] = useState(null)

  const [notificationIsError, setNotificationIsError] = useState(false)

  //use effect
  useEffect(() => {
    personService
      .getAll()
      .then((response) => {
        console.log("promise fulfilled")
        updatePersons(response)
      })
      .catch((err) => {
        console.log("promise unfulfilled", err.code)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //functions
  const updatePersons = (newPersons) => {
    setPersons(newPersons)
    const newShownPersons = filterPersons(newPersons, filter)
    setShownPersons(newShownPersons)
  }

  const filterPersons = (persons, filterValue) => {
    const newShownPersons = persons.filter((person) =>
      person.name.toLowerCase().includes(filterValue.toLowerCase())
    )
    return newShownPersons
  }

  const updatePerson = (person) => {
    if (
      window.confirm(
        `${person.name} is already added to the phonebook, replace the old number with a new one?`
      )
    ) {
      return personService
        .update(person)
        .then((updatedPerson) => {
          const newPersons = persons.map((p) =>
            p.id === updatedPerson.id ? updatedPerson : p
          ) //copy of persons with updated record
          updatePersons(newPersons)
          setNewName("")
          setNewNumber("")
          setNotification(
            `Record of ${person.name} is updated to ${person.number}`
          )
          setTimeout(() => setNotification(null), 5000)
        })
        .catch((error) => {
          setNotificationIsError(true)
          if (error.response.status === 404) {
            setNotification(
              `Record of ${person.name} has already been removed from the server`
            )
            const newPersons = persons.filter((p) => p.id !== person.id)
            updatePersons(newPersons)
          } else if (error.response.status === 400) {
            setNotification(`${error.response.data.error}`)
          } else {
            console.log(error.response)
          }
          setTimeout(() => {
            setNotification(null)
            setNotificationIsError(false)
          }, 5000)
        })
    }
    setNotification(`Record of ${person.name} is unchanged`)
    setTimeout(() => setNotification(null), 5000)
  }

  //event handlers
  const handleaddPerson = (event) => {
    event.preventDefault()

    const dupCheck = persons.find((person) => person.name === newName)

    const newpersonObject = {
      name: newName,
      number: newNumber,
      id: dupCheck === undefined ? persons.length + 1 : dupCheck.id, // id same as original if name duplicate, done to make updation possible with one argument
    }

    if (dupCheck !== undefined) {
      return updatePerson(newpersonObject)
    }

    personService
      .create(newpersonObject)
      .then((newPerson) => {
        const newPersons = persons.concat(newPerson)
        updatePersons(newPersons)
        setNewName("")
        setNewNumber("")
        setNotification(`Record of ${newPerson.name} is added`)
        setTimeout(() => setNotification(null), 5000)
      })
      .catch((error) => {
        setNotificationIsError(true)
        setNotification(`${error.response.data.error}`)
        setTimeout(() => {
          setNotification(null)
          setNotificationIsError(false)
        }, 5000)
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    const newFilter = event.target.value
    setFilter(newFilter)
    const newShownPersons = persons.filter((person) =>
      person.name.toLowerCase().includes(newFilter.toLowerCase())
    )
    setShownPersons(newShownPersons)
  }

  const handleDeletePerson = (person) => {
    if (window.confirm(`Delete ${person.name} ?`)) {
      return personService
        .deleteEntry(person)
        .then(() => {
          const newPersons = persons.filter((p) => p.id !== person.id)
          updatePersons(newPersons)
          setNotification(`Record of ${person.name} is deleted`)
          setTimeout(() => setNotification(null), 5000)
        })
        .catch(() => {
          const newPersons = persons.filter((p) => p.id !== person.id)
          updatePersons(newPersons)
          setNotificationIsError(true)
          setNotification(`Record of ${person.name} is already deleted`)
          setTimeout(() => {
            setNotificationIsError(false)
            setNotification(null)
          }, 5000)
        })
    }
    return console.log(`Delete of ${person.name} cancelled`)
  }

  //returned website
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} isError={notificationIsError} />

      <Filter filter={filter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm
        submitHandler={handleaddPerson}
        name={newName}
        handleNameChange={handleNameChange}
        number={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={shownPersons} handleDelete={handleDeletePerson} />
    </div>
  )
}

export default App
