import { Component, PropTypes } from 'react';

import HistoryEntity from './history-entity.jsx';
import Waiting from './waiting.jsx';

export default class History extends Component {
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
  onEntityClick(data) {
    this.props.onClick(data);
  }

  /**
   * Render the states
   */
  render() {
    return this.state.show
      ? (
        <div className='history-container'>
          {
            this.state.entities.length > 0
              ? this.state.entities.map((entity, index) => {
                return (
                  <HistoryEntity
                    key={index}
                    caption={entity.caption}
                    cityName={entity.city_name}
                    lat={entity.lat}
                    lng={entity.lng}
                    onClick={this.onEntityClick.bind(this)}
                  />
                )
              })
            : (
              !this.state.waiting
                ? <span className="no-history">No History</span>
                : null
            )
          }

          <Waiting show={this.state.waiting} />
        </div>
      )
      : null
    ;
  }
}

// Validation on props
History.propTypes = {
  onClick: PropTypes.func,
  show: PropTypes.bool,
  entities: PropTypes.any,
  waiting: PropTypes.bool,
};
