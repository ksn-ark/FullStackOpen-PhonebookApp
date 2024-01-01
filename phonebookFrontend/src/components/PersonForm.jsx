import Field from "./Field";

const PersonForm = (p) => {
  return (
    <form onSubmit={p.submitHandler}>
      <Field text="name:" value={p.name} onChange={p.handleNameChange} />
      <Field text="number:" value={p.number} onChange={p.handleNumberChange} />
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;