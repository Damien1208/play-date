/*global google*/
import React from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import Geosuggest from 'react-geosuggest';

import './index.css';

export class component extends React.Component {
  static propTypes = {
    getEvents: PropTypes.func,
    createEvent: PropTypes.func
  };

  state = {
    date: moment(),
    title: '',
    description: '',
    location: '',
    coords: { lat: null, lng: null },
    ageFrom: '',
    ageTo: '',
    price: '',
    image:
      'https://res.cloudinary.com/cjrrcrosr/image/upload/c_scale,h_200,w_300/v1541859967/play.png',
    error: null
  };

  handleChange = date => {
    this.setState({ date: date });
  };

  handleSuggestSelect = place => {
    const { lat, lng } = place.location;
    this.setState({
      location: place.gmaps.formatted_address,
      coords: [lat, lng]
    });
  };

  handleChangeInput = event => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmitForm = event => {
    event.preventDefault();
    this.props
      .createEvent({
        title: this.state.title,
        description: this.state.description,
        date: this.state.date,
        ageFrom: this.state.ageFrom,
        ageTo: this.state.ageTo,
        price: this.state.price,
        location: this.state.location,
        coords: this.state.coords,
        image: this.state.image
      })
      .then(() => {
        this.props.getEvents();
        this.props.history.push('/');
      });
  };

  handleUploadWidget = event => {
    event.preventDefault();
    window.cloudinary.openUploadWidget(
      {
        cloud_name: 'cjrrcrosr',
        upload_preset: 'k9f6baa7',
        cropping: true,
        folder: 'photos'
      },
      (error, result) => {
        if (result.info.url) {
          this.setState({ image: result.info.url });
        }
      }
    );
  };

  render() {
    return (
      <div className="add-event">
        <form onSubmit={this.handleSubmitForm} className="form">
          <button onClick={this.handleUploadWidget} className="upload-button">
            Add Image
          </button>

          <input
            name="title"
            value={this.state.title}
            onChange={this.handleChangeInput}
            type="text"
            placeholder="Title"
          />

          <DatePicker
            className="datePicker"
            placeholderText="Date"
            // selected={this.state.date}
            onChange={this.handleChange}
            showTimeSelect
            dateFormat="LLL"
          />
          <Geosuggest
            placeholder="Address"
            location={new google.maps.LatLng(41.3851, 2.1734)}
            onSuggestSelect={this.handleSuggestSelect}
            radius={20}
          />

          <textarea
            rows="4"
            cols="50"
            name="description"
            value={this.state.description}
            onChange={this.handleChangeInput}
            type="text-box"
            placeholder="Description"
          />
          <input
            name="price"
            value={this.state.price}
            onChange={this.handleChangeInput}
            type="number"
            placeholder="Price €"
          />
          <input
            name="ageFrom"
            value={this.state.ageFrom}
            onChange={this.handleChangeInput}
            type="number"
            placeholder="Age From"
          />
          <input
            name="ageTo"
            value={this.state.ageTo}
            onChange={this.handleChangeInput}
            type="number"
            placeholder="Age To"
          />
          <button className="button">Add</button>
        </form>
        {this.state.error && (
          <p className="error-message">{this.state.error}</p>
        )}
      </div>
    );
  }
}
