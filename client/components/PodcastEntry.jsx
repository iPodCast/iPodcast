import React from 'react';
import {SelectedPodcastEntry} from './SelectedPodcastEpisodes.jsx';
import {SavePodcastButton} from './SavePodcastButton.jsx';
import {DeleteButton} from './DeleteButton.jsx';


var PodcastEntry = (props) => {
  // console.log('podcastEntry run. this is props: ',props)

  if(props.SavePodcastButton){
    // console.log('props.SavePodcastButton ran!')
    return (
      <div>
        Podcast list and entries start here.&&&&&&
        {props.podcast}
        <div><img src={props.albumCover} /></div>
        <div>{props.artistName}</div>
        <div>{props.collectionName}</div>
        <div>{props.index}</div>
        Podcast list and entries end here.!!!!!!!!
        <SavePodcastButton SavePodcastButton={props.SavePodcastButton} id={props.index}/>
      </div>
    )
  } else {
    return (
      <div>
        Podcast list and entries start here.&&&&&&
        {props.podcast}
        <div onClick={()=>props.handleSelectPodcast(props.index)}><img src={props.albumCover} /></div>
        <div>{props.artistName}</div>
        <div>{props.collectionName}</div>
        <div>{props.index}</div>
        Podcast list and entries end here.!!!!!!!!
        <DeleteButton DeleteButton={props.DeleteButton} id={props.index}/>
      </div>
    )
  }
}

export {PodcastEntry};
