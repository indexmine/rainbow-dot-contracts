import React, { Component } from 'react'
import { Route } from 'react-router'
import HomeContainer from './pages/home/HomeContainer'
import SeasonManagerContainer from './pages/season-manager/SeasonManagerContainer'
import SeasonContainer from './pages/season/SeasonContainer'
import MarketContainer from './pages/market/MarketContainer'


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      scriptLoaded: false, // flag for hyperspace theme animation script
    };
  }

  componentDidMount () {
    // It uses hyperspace theme from HTML5UP.net/hyperspace
    // To apply animation effects using jquery, we re load main.js
    // when the components are mounted successfully.
    if(!this.state.scriptLoaded) {
      this.setState({scriptLoaded: true});
      const script = document.createElement('script');
      script.src = '/assets/js/main.js';
      document.body.appendChild(script);
    }
  }

  render() {
    return (
      <div className="App">
        <Route exact path="/" component={HomeContainer}/>
        <Route exact path="/season-manager" component={SeasonManagerContainer}/>
        <Route exact path="/season" component={SeasonContainer}/>
        <Route exact path="/market" component={MarketContainer}/>
      </div>
    );
  }
}

export default App
