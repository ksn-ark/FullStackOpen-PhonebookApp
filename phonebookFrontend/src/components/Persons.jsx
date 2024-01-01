import Number from "./Number";

const Persons = ({ persons, handleDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <Number key={person.id} person={person} handleClick={handleDelete}/>
      ))}
    </div>
  );
};

export default Persons;
