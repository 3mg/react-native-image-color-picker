import React, { Component } from 'react';
import { WebView } from 'react-native';
import { canvasHtml } from './canvas-html';

export default class ImageColorPicker extends Component {
  state = {
    imageBlob: ''
  };

  componentWillMount() {
    if (typeof this.props.imageBlob !== 'undefined') {
      this.setState({ imageBlob: this.props.imageBlob });
    } else {
      this.getImage(this.props.imageUrl);
    }
  }

  getImage = async imageUrl => {
    try {
      const RNFetchBlob = require('react-native-fetch-blob');
      await RNFetchBlob.fetch('GET', imageUrl)
        .then(res => {
          this.setState({ imageBlob: res.base64() });
        })
        .catch((errorMessage, statusCode) => {
          this.props.pickerCallback(errorMessage, statusCode);
        });
    } catch (e) {
      this.props.pickerCallback(e);
    }
  };

  render() {
    const { imageUrl, pickerCallback, pickerStyle } = this.props;

    return (
      <WebView
        ref="imageColorPickerWebview"
        source={{ html: canvasHtml(this.state.imageBlob, this.props) }}
        javaScriptEnabled={true}
        onMessage={pickerCallback}
        style={pickerStyle}
      />
    );
  }
}
