import React, { Component } from "react";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";

const particlesOptions = {
  particles: {
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5,
      },
    },
  },
};

const app = new Clarifai.App({
  apiKey: "923bdb65ba984677ac69f43368456e4f",
});

class App extends Component {
  state = {
    input: "",
  };

  inputChangeHandler = (event) => {
    this.setState({ input: event.target.value });
  };

  buttonSubmitHandler = () => {
    app.models
      .predict(
        "a403429f2ddf4b49b307e318f00e528b",
        "https://www.thestatesman.com/wp-content/uploads/2017/08/1493458748-beauty-face-517.jpg"
      )
      .then((res) => console.log(res.outputs))
      .catch((err) => console.log(err));
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          input={this.state.input}
          onInputChange={this.inputChangeHandler}
          onButtonSubmit={this.buttonSubmitHandler}
        />
        {/* <FaceRecognition /> */}
      </div>
    );
  }
}

export default App;
