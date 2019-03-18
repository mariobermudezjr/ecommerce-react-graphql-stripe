import React from 'react';
import { Container, Box, Button, Heading, TextField } from 'gestalt';
import ToastMessage from './ToastMessage';
import { setToken } from '../utils';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.API_URL || 'http://localhost:1337';

const strapi = new Strapi(apiUrl);

class Signin extends React.Component {
  state = {
    username: '',
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

    const { username, password } = this.state;

    if (this.isFormEmpty(this.state)) {
      this.showToast('Fill in all fields');
      return;
    }

    // SIGN UP USER
    try {
      this.setState({ loading: true });
      const response = await strapi.login(username, password);
      this.setState({ loading: false });
      setToken(response.jwt);
      this.redirectUser('/');
    } catch (err) {
      this.setState({ loading: false });
      this.showToast(err.message);
    }
  };

  redirectUser = path => this.props.history.push(path);

  isFormEmpty = ({ username, password }) => {
    return !username || !password;
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
              backgroundColor: '#d6a3b1'
            }
          }}
          margin={4}
          padding={4}
          shape="rounded"
          display="flex"
          justifyContent="center"
        >
          {/* Sign In Form */}
          <form
            style={{
              diplay: 'inlineBlock',
              textAlign: 'center',
              maxWidth: 450
            }}
            onSubmit={this.handleSubmit}
          >
            {/* Sign In Form Heading */}
            <Box marginBottom={2} diplay="flex" direction="column" alignItems="center">
              <Heading color="midnight"> Welcome Back!</Heading>
            </Box>

            {/* Username Input */}
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="Username"
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

export default Signin;
