import React from 'react';

var DeleteButton = (props) => {
  return (
    <div>
      <button onClick={props.DeleteButton} id={props.id}>Delete button.</button>
    </div>
  )
}

export {DeleteButton};
