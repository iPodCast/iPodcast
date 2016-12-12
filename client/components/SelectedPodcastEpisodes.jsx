import React from 'react';

var SelectedPodcastEntry = (props) => {
  return (
    <div onClick={()=>props.handleSelectEpisode(props.index)}>
      {props.title}
    </div>
  )
}

export {SelectedPodcastEntry};
