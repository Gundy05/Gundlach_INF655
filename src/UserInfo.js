import React, { Component } from 'react';

class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Seth',
      profession: 'React Developer',
      luckyNumber: Math.floor(Math.random() * 100) + 1,
    };
  }

  generateNewLuckyNumber = () => {
    this.setState({
      luckyNumber: Math.floor(Math.random() * 100) + 1,
    });
  };

  render() {
    return (
      <div>
        <h2>User Information</h2>
        <p>Name: {this.state.name}</p>
        <p>Profession: {this.state.profession}</p>
        <p>Your lucky number is: {this.state.luckyNumber}</p>

        <button onClick={this.props.handleClick}>Show Alert</button>
        <button onClick={this.generateNewLuckyNumber}>
          Generate New Lucky Number
        </button>
      </div>
    );
  }
}

export default UserInfo;
