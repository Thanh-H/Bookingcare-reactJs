
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl'

class DeufauClass extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
  }

  async componentDidMount() {
  }


  render() {
    return (
      <div></div>
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.app.language,

  };
};

const mapDispatchToProps = dispatch => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DeufauClass);
