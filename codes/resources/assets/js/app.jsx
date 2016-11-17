import React, { Component } from 'react';

import GoogleMap from 'google-map-react';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      center: {lat: 13.726448, lng: 100.545081},
      zoom: 14,
      mapLoaded: true,
    };
  }

  componentDidMount() {
    this.setState({
      mapLoaded: true,
    });
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
          bootstrapURLKeys={{
            key: window.googleApiKey,
            language: 'en',
          }}
        ></GoogleMap>

        <div className="tweets-about-container">
          <span className={'tweets-about-caption' + (!this.state.mapLoaded ? ' hidden' : '')}>Tweets about Bangkok</span>
        </div>
      </div>
    );
  }
}