import { Component, PropTypes } from 'react';

export default class HistoryEntity extends Component {
  constructor(props) {
    super(props);

    this.state = props;
  }

  /**
   * apply props to state once it changed from parent
   *
   * @param props
   */
  componentWillReceiveProps(props) {
    this.setState(props);
  }

  /**
   * Handle entity click
   */
  onEntityClick() {
    this.props.onClick({
      caption: this.state.caption,
      cityName: this.state.cityName,
      lat: this.state.lat,
      lng: this.state.lng,
    });
  }

  /**
   * Render the states
   */
  render() {
    return (
      <div className='history-entity-container' onClick={this.onEntityClick.bind(this)}>
        <span>{this.state.caption}</span>
      </div>
    )
  }
}

// Validation on props
HistoryEntity.propTypes = {
  onClick: PropTypes.func,
  caption: PropTypes.string,
  cityName: PropTypes.string,
  lat: PropTypes.any,
  lng: PropTypes.any,
};
