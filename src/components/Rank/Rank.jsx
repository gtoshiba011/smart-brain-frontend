import React from "react";

class Rank extends React.Component {
  constructor() {
    super();
    this.state = {
      emoji: "",
    };
  }

  componentDidMount() {
    this.generateEmoji(this.props.entries);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.entries === this.props.entries &&
      prevProps.name === this.props.name
    ) {
      return null;
    }
    this.generateEmoji(this.props.entries);
  }

  generateEmoji = (entries) => {
    fetch(
      `https://a18zggno4a.execute-api.us-east-1.amazonaws.com/prod/rank?rank=${entries}`
    )
      .then((res) => res.json())
      .then((data) => this.setState({ emoji: data.input }))
      .catch(console.log);
  };

  render() {
    const { name, entries } = this.props;
    return (
      <div>
        <div className="white f3">{`${name}, your current rank is...`}</div>
        <div className="white f1">{entries}</div>
        <div className="white f3">{`Rank Badge: ${this.state.emoji}`}</div>
      </div>
    );
  }
}

export default Rank;
