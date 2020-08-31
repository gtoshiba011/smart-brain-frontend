import React, { Component } from "react";
import Particles from "react-particles-js";
import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import Modal from "./components/Modal/Modal";
import Profile from "./components/Profile/Profile";

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

const initialState = {
  input: "",
  imageUrl: "",
  boxs: [],
  route: "home",
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
    pet: "",
    age: "",
  },
};
// route state: home, signin, signout, register

class App extends Component {
  state = initialState;

  componentDidMount() {
    const smartBrainToken = window.sessionStorage.getItem("authToken");
    if (smartBrainToken) {
      fetch("http://localhost:3000/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          smartBrainToken,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data && data.userId) {
            console.log("success; TODO: get user profile");
          }
        })
        .catch(console.log);
    }
  }

  inputChangeHandler = (event) => {
    this.setState({ input: event.target.value });
  };

  buttonSubmitHandler = () => {
    this.setState({ imageUrl: this.state.input });
    fetch("http://localhost:3000/imageApi", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: this.state.input }),
    })
      .then((res) => res.json())
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
          )
          .catch(console.log);
        this.displayFaceBox(this.calculateFaceLocation(res));
      })
      .catch((err) => console.log(err));
  };

  calculateFaceLocation = (data) => {
    const clarifaiFaces = data.outputs[0].data.regions;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return clarifaiFaces.map((face, index) => {
      const clarifaiFace = face.region_info.bounding_box;
      return {
        index: index,
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - clarifaiFace.right_col * width,
        bottomRow: height - clarifaiFace.bottom_row * height,
      };
    });
  };

  displayFaceBox = (boxes) => {
    this.setState({ boxes: boxes });
  };

  routeChangeHandler = (route) => {
    if (route === "home") {
      this.setState({ isSignedIn: true });
    } else if (route === "signout") {
      return this.setState(initialState);
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
        age: user.age,
        pet: user.pet,
      },
    });
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen,
    }));
  };

  render() {
    const {
      isSignedIn,
      route,
      input,
      boxs,
      imageUrl,
      isProfileOpen,
      user,
    } = this.state;
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          onRouteChange={this.routeChangeHandler}
          isSignedIn={isSignedIn}
          toggleModal={this.toggleModal}
        />
        {isProfileOpen && (
          <Modal>
            <Profile
              toggleModal={this.toggleModal}
              loadUser={this.updateUserHandler}
              user={user}
            />
          </Modal>
        )}
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
