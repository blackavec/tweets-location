import React, { Component } from 'react';

import GoogleMap from 'google-map-react';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: {lat: 13.726448, lng: 100.545081},
      zoom: 14,
      mapLoaded: false,
    };
  }

  componentDidMount() {
  }

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
          <span className={'tweets-about-caption' + (!this.state.mapLoaded ? ' hidden' : '')}>Tweets about Bangkok</span>
        </div>
        <div className="lower-box-container">
          <input type="text"/>
          <button className="">
            Search
          </button>
          <button className="">
            History
          </button>
        </div>
      </div>
    );
  }
}
