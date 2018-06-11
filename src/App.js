import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Cards from './Cards';

class App extends Component {
  render() {
    return (
      <div style={{
        'width': '100%',
        'height': '800px',
        'margin-left': 'auto',
        'margin-right': 'auto'
      }}>
        <Cards />
      </div>
    );
  }
}

export default App;
