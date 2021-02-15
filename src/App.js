import React from "react";

import "./App.css";

import Particles from "react-particles-js";
import Clarifai, { COLOR_MODEL } from "clarifai";

import Navigation from "./Components/Navigation/navigation.component";
import Logo from "./Components/Logo/logo.component";
import Rank from "./Components/Rank/Rank.component";
import ImageLinkForm from "./Components/ImageLinkForm/imagelinkform.component";
import FaceRecognition from "./Components/FaceRecognition/facerecognition.component";

//using the clarifai api to detect faces in images
const app = new Clarifai.App({
  apiKey: "65622a812f0843049fe23957ef31da60",
});

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
    };
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input).then(
      function (response) {
        // do something with response
        console.log(
          response.outputs[0].data.regions[0].region_info.bounding_box
        );
      },
      function (err) {
        // there was an error
      }
    );
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
        <FaceRecognition imageUrl={this.state.imageUrl} />
      </div>
    );
  }
}

export default App;
