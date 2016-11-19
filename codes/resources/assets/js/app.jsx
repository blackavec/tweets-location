import React, { Component } from 'react';

import $ from 'jquery';
import GoogleMap from 'google-map-react';
import Waiting from './waiting.jsx';
import NotificationSystem from 'react-notification-system';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      waiting: false,
      center: {lat: 13.726448, lng: 100.545081},
      zoom: 14,
      mapLoaded: false,
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
        position: maps.ControlPosition.TOP_LEFT
      },
      styles: [{stylers: [{'saturation': -100}, {'gamma': 0.8}, {'lightness': 4}, {'visibility': 'on'}]}]
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
   * Handle the click to search
   */
  clickSearch() {
    const cityName = this.refs.cityNameRef.value;

    // validate the city name
    if (!cityName) {
      return;
    }

    this.setState({
      searchCityName: cityName,
    });

    this.sendSearchRequest(cityName);
  }

  /**
   * Perform the Search by sending request to the server
   *
   * @param cityName
   */
  sendSearchRequest(cityName) {
    this.setState({
      waiting: true,
    });

    this.request = $.getJSON('/api/search', {cityName});

    this.request.done((searchResult) => {
      this.processSearchResult(searchResult);
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
   * process the search result
   *
   * @param searchResult
   */
  processSearchResult(searchResult) {
    console.log(this.refs.map);
  }

  /**
   * Handle the click to history menu
   */
  clickHistory() {

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
          onGoogleApiLoaded={(map, maps) => {
            this.setState({
              mapLoaded: true,
            });
          }}
          options={this.createMapOptions}
          bootstrapURLKeys={{
            key: window.googleApiKey,
            language: 'en',
          }}
        ></GoogleMap>
        <div className="tweets-about-container">
          <span className={
              'tweets-about-caption' +
              (!this.state.mapLoaded || !this.state.searchCityName ? ' hidden' : '')
            }>Tweets about {this.state.searchCityName}</span>
        </div>
        <div className="lower-box-container">
          <input type="text" placeholder="City name" ref="cityNameRef" />
          <button onClick={this.clickSearch.bind(this)}>
            Search
          </button>
          <button onClick={this.clickHistory.bind(this)}>
            History
          </button>
          <Waiting show={this.state.waiting} />
        </div>
        <NotificationSystem ref="notificationSystem" />
      </div>
    );
  }
}
