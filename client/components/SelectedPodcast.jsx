import React from 'react';
import {SelectedPodcastEntry} from './SelectedPodcastEpisodes.jsx';

var SelectedPodcast = (props) => {
  return (
    <div>
      Selected podcast List episodes start here.+++++++++
      {props.list.map((episode, i) => <SelectedPodcastEntry title={episode.title} index={i} handleSelectEpisode={props.handleSelectEpisode}/>)}
      Selected podcast List episodes end here.---------
    </div>
  )
}

export {SelectedPodcast};
