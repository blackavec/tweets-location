import { Component, PropTypes } from 'react';

export default class UserTweet extends Component {
  constructor(props) {
    super(props);

    this.state = props;
  }

  componentWillReceiveProps(props) {
    this.setState(props);
  }

  tweetToggle() {
    let showTweet = !this.state.showTweet;

    this.setState({showTweet});
  }

  closeTweet() {
    this.setState({showTweet: false});
  }

  parseTwitterDatestamp() {
    let date = new Date(this.state.date.replace(/^\w+ (\w+) (\d+) ([\d:]+) \+0000 (\d+)$/, "$1 $2 $4 $3 UTC"));

    return date.getFullYear() + '-' + date.getDate() + '-' + date.getMonth() + ' ' +
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

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
                  <p><strong>When</strong>: {this.parseTwitterDatestamp()}</p>
                </div>
              )
            : null
        }
      </div>
    )
  }
}

UserTweet.propTypes = {
  text: PropTypes.string,
  avatar: PropTypes.string,
  date: PropTypes.string,
};
