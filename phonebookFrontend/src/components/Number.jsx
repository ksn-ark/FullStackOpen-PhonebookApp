const Number = ( {person, handleClick} ) => {
    return <p>{person.name} {person.number} <button onClick={() => handleClick(person)}>delete</button></p>
}

export default Number