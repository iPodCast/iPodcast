import React from 'react';

var FilterButton = (props) =>{

  return (

    <div>
      FilterButton goes here.
      <input type="text" value={props.filterValue} onChange={props.handleFilterChange} />
      <button onClick={props.handleFilterSubmit}>Submit button.</button>
    </div>

  )
 }

 export {FilterButton}
