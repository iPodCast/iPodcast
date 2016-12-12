import React from 'react';
import {PodcastEntry} from './PodcastEntry.jsx';
import {SavePodcastButton} from './SavePodcastButton.jsx';
import {DeleteButton} from './DeleteButton.jsx';


var PodcastList = (props) => {
  // console.log('podcastList rendered, this is props: ',props)
  if(props.SavePodcastButton){
    return (
      <div>
          {props.list.map((podcast, i) => <PodcastEntry podcast={podcast.a} albumCover={podcast.artworkUrl60} artistName={podcast.artistName} collectionName={podcast.collectionName} episodes={podcast.episodes} index={i} SavePodcastButton={props.SavePodcastButton}/>)}
      </div>
    )
  } else {
    return (
      <div>
        {props.list.map((podcast, i) => <PodcastEntry podcast={podcast.a} albumCover={podcast.artworkUrl60} artistName={podcast.artistName} collectionName={podcast.collectionName} episodes={podcast.episodes} index={i} handleSelectPodcast={props.handleSelectPodcast} DeleteButton={props.DeleteButton}/>)}
      </div>
    )
  }
}

export {PodcastList};
