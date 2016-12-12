import React from 'react';

var ReturnButton = (props) => {
  return (
    <div>
      <button onClick={props.handleReturn}>Return button.</button>
    </div>
  )
}

export {ReturnButton};
