import { Component, PropTypes } from 'react';

export default class Waiting extends Component {
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
        <div className='waiting-background'>
          <div></div>
        </div>
      )
      : null
    ;
  }
}

// Validation on props
Waiting.propTypes = {
  show: PropTypes.bool,
};
