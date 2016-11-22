import { Component, PropTypes } from 'react';

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
   * Render the states
   */
  render() {
    return this.state.show
      ? (
        <div className='history-container'>
          
        </div>
      )
      : null
    ;
  }
}

// Validation on props
History.propTypes = {
  show: PropTypes.bool,
  items: PropTypes.,
};
