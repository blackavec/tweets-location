import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import $ from 'jquery';
import GoogleMap from 'google-map-react';
import NotificationSystem from 'react-notification-system';
import Waiting from './waiting.jsx';
import UserTweet from './user-tweet.jsx';
import History from './history.jsx';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      waiting: false,
      center: {lat: 13.726448, lng: 100.545081},
      zoom: 14,
      mapLoaded: false,
      citySearchedPlaces: null,
      searchedResult: [],
      showHistory: false,
      historyEntities: [],
    };
  }

  /**
   * Create map options
   *
   * @param maps
   */
  createMapOptions(maps) {
    return {
      zoomControl: true,
      zoomControlOptions: {
        position: maps.ControlPosition.TOP_LEFT,
        style: maps.ZoomControlStyle.LARGE,
      },
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: maps.ControlPosition.TOP_RIGHT,
      },
      scaleControl: true,
      streetViewControl: true,
      streetViewControlOptions: {
        position: maps.ControlPosition.TOP_LEFT,
      },
      minZoom: 11,
      maxZoom: 15,
      styles: [{
        stylers: [
          {'saturation': -100},
          {'gamma': 0.8},
          {'lightness': 4},
          {'visibility': 'on'},
        ]
      }]
    }
  }

  /**
   * Display the notification
   *
   * @param message
   * @param level
   */
  showNotification(message, level) {
    this.refs.notificationSystem.addNotification({
      message: message,
      level: level,
      position: 'tr', // top right
    });
  }

  /**
   * Handle selected city name and navigate map to the location
   */
  handleSelectedCityName() {
    const places = this.state.citySearchedPlaces

    if (places.length === 0) {
      return;
    }

    let bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");

        return;
      }

      bounds.extend(place.geometry.location);
    });

    this.obj.map.fitBounds(bounds);
  }

  /**
   * Handle the click to search
   */
  clickSearch() {
    const caption = this.refs.cityNameRef.value;
    const places  = this.state.citySearchedPlaces;

    if (places.length === 0) {
      return;
    }

    // extract the city name from map search result
    const addressComponents = places[0].address_components;

    // extract the geo Location from map search result
    const geoLocation = places[0].geometry.location;

    const cityName = addressComponents.length > 0
      ? addressComponents[0].long_name
      : null;

    // validate the city name
    if (!cityName) {
      return;
    }

    this.setState({
      searchCityName: caption,
    });

    this.handleSelectedCityName();

    this.sendSearchRequest(caption, cityName, {
      lat: geoLocation.lat(),
      lng: geoLocation.lng(),
    });

    this.setState({
      newSearchPlaces: null,
    });
  }

  /**
   * Perform the Search by sending request to the server
   *
   * @param caption
   * @param cityName
   * @param geoLocation
   */
  sendSearchRequest(caption, cityName, geoLocation, noCache) {
    this.setState({
      waiting: true,
    });

    this.request = $.getJSON(
      '/api/search?' + Math.floor((Math.random() * 10000) + 1),
      {caption, cityName, geoLocation, noCache}
    );

    this.request.done((searchedResult) => {
      this.setState({searchedResult});
    });

    this.request.fail(() => {
      this.showNotification('Search has been failed', 'error');
    });

    this.request.always(() => {
      this.setState({
        waiting: false,
      });
    });
  }

  /**
   * Handle the click to history menu
   */
  clickHistory() {
    let showHistory = !this.state.showHistory;

    this.setState({
      showHistory,
    });

    if (showHistory) {
      this.sendHistoryRequest();
    }
  }

  /**
   * Handle the click to history menu entities
   */
  onHistoryEntityClick(data) {
    this.obj.map.setCenter(new google.maps.LatLng(data.lat, data.lng));

    this.refs.cityNameRef.value = data.caption;

    this.sendSearchRequest(
      data.caption,
      data.cityName,
      {
        lat: data.lat,
        lng: data.lng
      },
      true,
    );

    this.setState({
      showHistory: false,
    });
  }

  /**
   * Fetch history list
   */
  sendHistoryRequest() {
    this.setState({
      historyWaiting: true,
    });

    this.request = $.getJSON('/api/history');

    this.request.done((historyEntities) => {
      this.setState({historyEntities});
    });

    this.request.fail(() => {
      this.showNotification('Failed to fetch history', 'error');

      this.setState({
        showHistory: false,
      });
    });

    this.request.always(() => {
      this.setState({
        historyWaiting: false,
      });
    });
  }

  /**
   * Render the states of modules
   */
  render() {
    return (
      <div className="app-jsx">
        <GoogleMap
          style={{
            width: '100%',
            height: '100%',
            margin: 0,
            padding: 0,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            zIndex: 0,
          }}
          ref="map"
          className="google-map-obj"
          defaultCenter={this.state.center}
          defaultZoom={this.state.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={(obj) => {
            // Map object after google map has been loaded completly
            this.obj = obj;

            this.setState({
              mapLoaded: true,
            });

            this.searchBox = new obj.maps.places.SearchBox(
              ReactDOM.findDOMNode(this.refs.cityNameRef)
            );

            this.searchBox.addListener('places_changed', () => {
              const places = this.searchBox.getPlaces();

              if (places.length > 0) {
                this.state.citySearchedPlaces = places;
              }

              this.setState({
                citySearchedPlaces: places.length > 0
                  ? places
                  : this.state.citySearchedPlaces,
                newSearchPlaces: places,
              });
            });

            this.obj.map.addListener('bounds_changed', () => {
              this.searchBox.setBounds(this.obj.map.getBounds());
            });
          }}
          options={this.createMapOptions}
          bootstrapURLKeys={{
            key: window.googleApiKey,
            language: 'en',
          }}
        >
          {
            this.state.searchedResult.map((tweet, index) => {
              return (
                <UserTweet
                  key={index}
                  lat={tweet.lat}
                  lng={tweet.lng}
                  text={tweet.text}
                  avatar={tweet.profile_avatar}
                  date={tweet.tweet_timestamp}
                />
              )
            })
          }
        </GoogleMap>
        <div className="tweets-about-container">
          <span className={
              'tweets-about-caption' +
              (!this.state.mapLoaded || !this.state.searchCityName ? ' hidden' : '')
            }>Tweets about {this.state.searchCityName}</span>
        </div>
        <div className="lower-box-container">
          <input type="text" placeholder="City name" ref="cityNameRef" />
          <button
            onClick={this.clickSearch.bind(this)}
            disabled={!this.state.citySearchedPlaces}>
            Search
          </button>
          <button onClick={this.clickHistory.bind(this)}>
            History
          </button>
          <Waiting show={this.state.waiting} />
        </div>

        <History 
          ref="history"
          show={this.state.showHistory}
          waiting={this.state.historyWaiting}
          entities={this.state.historyEntities}
          onClick={this.onHistoryEntityClick.bind(this)}
        />
        <NotificationSystem ref="notificationSystem" />
      </div>
    );
  }
}
