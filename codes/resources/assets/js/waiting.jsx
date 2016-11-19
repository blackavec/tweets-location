import { Component, PropTypes } from 'react';

export default class Waiting extends Component {
  constructor(props) {
    super(props);

    this.state = props;
  }

  componentWillReceiveProps(props) {
    this.setState(props);
  }

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

Waiting.propTypes = {
  show: PropTypes.bool,
};
