import React from 'react';
import { Container, Box, Button, Heading, Text, TextField } from 'gestalt';
import ToastMessage from './ToastMessage';
import { setToken } from '../utils';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337';

const strapi = new Strapi(apiUrl);

class Signup extends React.Component {
  state = {
    username: '',
    email: '',
    password: '',
    toastVisible: false,
    toastMessage: '',
    loading: false
  };

  handleChange = ({ event, value }) => {
    event.persist();
    this.setState({ [event.target.name]: value });
  };

  handleSubmit = async event => {
    event.preventDefault();

    const { username, email, password } = this.state;

    if (this.isFormEmpty(this.state)) {
      this.showToast('Fill in all fields');
      return;
    }

    // SIGN UP USER
    try {
      this.setState({ loading: true });
      const response = await strapi.register(username, email, password);
      this.setState({ loading: false });
      setToken(response.jwt);
      this.redirectUser('/');
    } catch (err) {
      this.setState({ loading: false });
      this.showToast(err.message);
    }
  };

  redirectUser = path => this.props.history.push(path);

  isFormEmpty = ({ username, email, password }) => {
    return !username || !email || !password;
  };

  showToast = toastMessage => {
    this.setState({ toastVisible: true, toastMessage });
    setTimeout(() => this.setState({ toastVisible: false, toastMessage: '' }), 3000);
  };

  render() {
    const { toastMessage, toastVisible, loading } = this.state;
    return (
      <Container>
        <Box
          dangerouslySetInlineStyle={{
            __style: {
              backgroundColor: '#ebe2da'
            }
          }}
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
        >
          {/* Sign Up Form */}
          <form
            style={{
              diplay: 'inlineBlock',
              textAlign: 'center',
              maxWidth: 450
            }}
            onSubmit={this.handleSubmit}
          >
            {/* Sign Up Form Heading */}
            <Box marginBottom={2} diplay="flex" direction="column" alignItems="center">
              <Heading color="midnight"> Let's Get Started</Heading>
              <Text italic color="orchid">
                {' '}
                Sign up to order some brews!
              </Text>
            </Box>

            {/* Username Input */}
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              onChange={this.handleChange}
            />

            {/* Email Address Input */}
            <TextField
              id="email"
              type="email"
              name="email"
              placeholder="Email Adress"
              onChange={this.handleChange}
            />

            {/* Password Input */}
            <TextField
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              onChange={this.handleChange}
            />

            <Button inline disabled={loading} color="blue" text="Submit" type="submit" />
          </form>
        </Box>
        <ToastMessage show={toastVisible} message={toastMessage} />
      </Container>
    );
  }
}

export default Signup;
