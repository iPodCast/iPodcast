import React from 'react';

var SavePodcastButton = (props) => {

  return (
    <div>
      <button onClick={props.SavePodcastButton} id={props.id}>Save button.</button>
    </div>
  )
}

export {SavePodcastButton};
