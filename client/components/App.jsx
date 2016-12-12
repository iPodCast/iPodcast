import React from 'react';
import ReactDOM from 'react-dom';
import {PodcastList} from './PodcastList.jsx';
import {PodcastEntry} from './PodcastEntry.jsx';
import {SelectedPodcast} from './SelectedPodcast.jsx';
import {SelectedPodcastEntry} from './SelectedPodcastEpisodes.jsx';
import {AddButton} from './AddButton.jsx';
import {FilterButton} from './FilterButton.jsx';
import {ReturnButton} from './ReturnButton.jsx';
import {SavePodcastButton} from './SavePodcastButton.jsx';
import {DeleteButton} from './DeleteButton.jsx';
var $ = require('jquery')
import ReactPlayer from 'react-player'
import ReactAudioPlayer from 'react-audio-player'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      podcasts : [],
      selectedPodcast: 0,
      podcastSelected: false,
      searchingForPodcast: false,
      submittedSearch: false,
      selectedEpisode: 0,
      podcastsFromSearch: [],
      inputVal: ' ',
      filterValue: '',
    }
  }

  handleAddClick (e){
    this.setState({
      inputVal:e.target.value,
      searchingForPodcast:true
    })
  }

  handleAddSubmit(){
    //ajax request to apple goes here.
    console.log('handleAddSubmit ran!')
    var updateLink = function (string){
    var link = "https://itunes.apple.com/search?term=";
    var newString = string.toString().replace(/\s+/g,' ').trim().split(' ').join('+');
    var finalLink = link + newString;
    return finalLink;
    };
    var targetInput = updateLink(this.state.inputVal)
    console.log('targetInput is: ',targetInput)

    var self = this
    var searchPodcasts = function (param){
      $.ajax({
        url:'http://localhost:3000/search',
        method:'GET',
        data:{
          'test':param
        },
        dataType:'json',
        success: function (data){
          console.log('it worked!')
          console.log(data)
          self.state.podcastsFromSearch.push(data)
          self.setState({
            podcastsFromSearch:self.state.podcastsFromSearch,
            inputVal:' ',
            submittedSearch:true
          })
        },
        error: function(err){
          console.log('it didnt work')
        }
      })
    }
    var test = 'https://itunes.apple.com/search?term=the+tim+ferris+show'
    searchPodcasts(targetInput)
  }

  handleFilterChange(event) {
    this.setState({filterValue: event.target.value})
  }

  handleFilterSubmit(event) {
    this.setState({filterValue: ' '});
  }

  handleReturn(){
    console.log('current list of podcasts is: ',this.state.podcasts)
    this.state.podcastsFromSearch=[]
    this.setState({
      searchingForPodcast:false,
      submittedSearch:false,
      podcastsFromSearch:this.state.podcastsFromSearch
    })
  }

  handleSelectPodcast (index){
    // console.log('i ran handleSelectPodcast!',index)
    this.state.selectedPodcast=index
    this.setState({
      selectedPodcast:this.state.selectedPodcast
    })
  }

  handleSelectEpisode (index){
    // console.log('i ran handleSelectEpisode!',index)
    this.state.selectedEpisode=index
    this.setState({
      selectedEpisode:this.state.selectedEpisode
    })
  }

   SavePodcastButton(e) {
    //  console.log('i ran!')
     this.state.podcastSelected=true
     this.state.podcasts.push(this.state.podcastsFromSearch[e.target.id])
     this.setState({
       podcastSelected:this.state.podcastSelected,
       podcasts: this.state.podcasts
     })
   }

   DeleteButton(e){

     if(this.state.podcasts.length===1){
       this.setState({
         podcasts:this.state.podcasts
       })
     } else{
       this.state.podcasts.splice(e.target.id, 1)
       this.setState({
         podcasts:this.state.podcasts
       })
     }
   }

  render () {
    if(this.state.searchingForPodcast === true){
      //create if statement here. if podcast search submitted, display list of values and pass in the search values to it from here.
      //else display the current search return.
      if(this.state.submittedSearch===false){
        return(
          <div>
            <div>
              currently searchingForPodcast
              <AddButton value={this.state.inputVal} handleAddClick={this.handleAddClick.bind(this)} handleAddSubmit={this.handleAddSubmit.bind(this)}/>
            </div>
            <div>
              <ReturnButton handleReturn={this.handleReturn.bind(this)}/>
            </div>
          </div>
        )
      }

      if(this.state.submittedSearch===true){
        return(
          <div>
            <div>
              currently searchingForPodcast
              <AddButton value={this.state.inputVal} handleAddClick={this.handleAddClick.bind(this)} handleAddSubmit={this.handleAddSubmit.bind(this)}/>
            </div>
            <div>
              <PodcastList list={this.state.podcastsFromSearch} submittedSearch={this.state.submittedSearch} SavePodcastButton={this.SavePodcastButton.bind(this)}/>
            </div>
            <div>
              <ReturnButton handleReturn={this.handleReturn.bind(this)}/>
            </div>
          </div>
        )
      }

    }

    if (this.state.podcastSelected === true){
      return (
        <div>
          <div>
            <AddButton value={this.state.inputVal} handleAddClick={this.handleAddClick.bind(this)} handleAddSubmit={this.handleAddSubmit.bind(this)}/>
          </div>

          <div>
            <FilterButton filterValue={this.state.filterValue} handleFilterChange={this.handleFilterChange.bind(this)} handleFilterSubmit={this.handleFilterSubmit.bind(this)}/>
          </div>

          <div>
            <PodcastList list={this.state.podcasts} handleSelectPodcast={this.handleSelectPodcast.bind(this)} DeleteButton={this.DeleteButton.bind(this)}/>
          </div>

          <div>
            <SelectedPodcast list={this.state.podcasts[this.state.selectedPodcast].episodes} handleSelectEpisode={this.handleSelectEpisode.bind(this)}/>
          </div>

          <div>
            Now playing: {this.state.podcasts[this.state.selectedPodcast].episodes[this.state.selectedEpisode].title}
          <div>
            <ReactAudioPlayer src={this.state.podcasts[this.state.selectedPodcast].episodes[this.state.selectedEpisode].enclosure.url} autoPlay/>
          </div>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <div>
            <AddButton value={this.state.inputVal} handleAddClick={this.handleAddClick.bind(this)} handleAddSubmit={this.handleAddSubmit.bind(this)}/>
          </div>

          <div>
            filterButton goes here
          </div>

          <div>
            Add a podcast!
          </div>


        </div>
      )
    }
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));

var searchPodcasts = function (param){
  console.log('searchPodcasts ran!')
  $.ajax({
    url:'http://localhost:3000/search',
    method:'GET',
    data:{
      'test':param
    },
    dataType:'json',
    success: function (data){
      console.log('it worked!')
      console.log(data)
    },
    error: function(){
      console.log('it didnt work')
    }
  })
}
var test = 'https://itunes.apple.com/search?term=npr'
