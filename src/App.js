import React, { Component } from "react";
import Particles from "react-particles-js";
import Clarifai from "clarifai";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";

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

const initialState = {
  input: "",
  imageUrl: "",
  boxs: [],
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};
// route state: home, signin, signout, register

class App extends Component {
  state = {
    input: "",
    imageUrl: "",
    boxs: [],
    route: "signin",
    isSignedIn: false,
    user: {
      id: "",
      name: "",
      email: "",
      entries: 0,
      joined: "",
    },
  };

  componentDidMount() {}

  inputChangeHandler = (event) => {
    this.setState({ input: event.target.value });
  };

  buttonSubmitHandler = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((res) => {
        // update the entries
        fetch("http://localhost:3000/image", {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: this.state.user.id }),
        })
          .then((res) => res.json())
          .then((count) =>
            this.setState(Object.assign(this.state.user, { entries: count }))
          );
        this.displayFaceBox(this.calculateFaceLocation(res));
      })
      .catch((err) => console.log(err));
  };

  calculateFaceLocation = (data) => {
    const clarifaiFaces = data.outputs[0].data.regions;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return clarifaiFaces.map((originData, index) => {
      const clarifaiFace = originData.region_info.bounding_box;
      return {
        index: index,
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
      };
    });
  };

  displayFaceBox = (boxs) => {
    this.setState({ boxs: boxs });
  };

  routeChangeHandler = (route) => {
    if (route === "home") {
      this.setState({ isSignedIn: true });
    } else if (route === "signout") {
      this.setState(initialState);
    }
    this.setState({ route: route });
  };

  updateUserHandler = (user) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined,
      },
    });
  };

  render() {
    const { isSignedIn, route, input, boxs, imageUrl } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          onRouteChange={this.routeChangeHandler}
          isSignedIn={isSignedIn}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              input={input}
              onInputChange={this.inputChangeHandler}
              onButtonSubmit={this.buttonSubmitHandler}
            />
            <FaceRecognition boxs={boxs} imageUrl={imageUrl} />{" "}
          </div>
        ) : route === "signin" || route === "signout" ? (
          <Signin
            onRouteChange={this.routeChangeHandler}
            onUpdateUser={this.updateUserHandler}
          />
        ) : (
          <Register
            onRouteChange={this.routeChangeHandler}
            onUpdateUser={this.updateUserHandler}
          />
        )}
      </div>
    );
  }
}

export default App;
