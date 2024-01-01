import Field from './Field'

const Filter = (p) => {
    
    return (
        <form>
            <Field text="filter shown with" value={p.filter} onChange={p.handleFilterChange} />
        </form>
    )
}

export default Filter
