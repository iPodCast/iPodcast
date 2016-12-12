import React from 'react';

var AddButton = (props) => {
  return (
    <div>
      AddButton goes here.
      <input type="text" value={props.value} onChange={props.handleAddClick}></input>
      <button onClick={props.handleAddSubmit}>Submit button.</button>
    </div>
  )
}

export {AddButton};
