import React from "react";

import "./App.css";

import Particles from "react-particles-js";
import Clarifai from "clarifai";

import Navigation from "./Components/Navigation/navigation.component";
import Logo from "./Components/Logo/logo.component";
import Rank from "./Components/Rank/Rank.component";
import ImageLinkForm from "./Components/ImageLinkForm/imagelinkform.component";
import FaceRecognition from "./Components/FaceRecognition/facerecognition.component";

//using the clarifai api to detect faces in images
const app = new Clarifai.App({
  apiKey: "65622a812f0843049fe23957ef31da60",
});

//background animation
const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulse",
      },
    },
  },
};

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      input: "",
      imageUrl: "",
      box: {},
    };
  }

  //this is to calculate face location on the picture detected
  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box; //data received from api
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    //to determine face location
    return {
      leftCol: clarifaiFace.left_col * width, //total image width * left_col value(%)
      topRow: clarifaiFace.top_row * height, //total image height * top_row value(%)
      rightCol: width - clarifaiFace.right_col * width, //total image width - width from the left side
      bottomRow: height - clarifaiFace.bottom_row * height, //total image height - height from the top side
    };
  };

  //setting state with the return values
  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input) //detect face from user input URL
      .then((response) =>
        // do something with response
        this.displayFaceBox(this.calculateFaceLocation(response))
      )
      .catch((error) => console.log(error));
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
