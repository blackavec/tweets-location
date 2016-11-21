import { Component, PropTypes } from 'react';

export default class UserTweet extends Component {
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
   * Display/hide the Tweet text
   */
  tweetToggle() {
    let showTweet = !this.state.showTweet;

    this.setState({showTweet});
  }

  /**
   * Hide the Tweet text
   */
  closeTweet() {
    this.setState({showTweet: false});
  }

  /**
   * Parse Received date from tweet object to readable format
   */
  parseTweetTimestamp() {
    let date = new Date(this.state.date.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/, "$1 $2 $4 $3 UTC"));

    return date.getFullYear() + '-' + date.getDate() + '-' + date.getMonth() + ' ' +
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  /**
   * Render the states
   */
  render() {
    return (
      <div className="user-tweet">
        <img src={this.state.avatar} className="avatar" onClick={this.tweetToggle.bind(this)} />
        {
          this.state.showTweet
            ? (
                <div className="text">
                  <i className="close glyphicon glyphicon-remove" onClick={this.closeTweet.bind(this)}></i>
                  <p><strong>Tweet</strong>: {this.state.text}</p>
                  <p><strong>When</strong>: {this.parseTweetTimestamp()}</p>
                </div>
              )
            : null
        }
      </div>
    )
  }
}

// Validation on props
UserTweet.propTypes = {
  text: PropTypes.string,
  avatar: PropTypes.string,
  date: PropTypes.string,
};
