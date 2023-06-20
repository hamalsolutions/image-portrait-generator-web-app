import React, { useState, useContext } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../App";
import * as crypto from "crypto-js";
import { Navigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import logo from "../img/logo.png";

const defaultTheme = createTheme({
  palette: {
    primaryLb: {
      main: "#c2608e",
      light: "#ce7fa4",
      dark: "#874363",
      contrastText: "#fff",
    },
    white:{
      main: "#fff",
    }
  },
});

const Login = () => {
  const [state, setState] = useState({
    requesting: false,
    redirect: false,
    error: false,
    message: "",
    username: "",
    password: "",
    errors: {
      username: "",
      password: "",
    },
  });

  
  const validateForm = () => {
    let validForm = true;
    const errors = {...state.errors}
    const keys = Object.keys(errors);
    keys.forEach((key, index) => {
      if(state[key] === "" || state[key].length === 0 ){
        errors[key] = "Required Input";
        validForm = false;
      }
    });
    setState((state) => ({
      ...state,
      errors
    }));
    return validForm;
  }

  const authContext = useContext(AuthContext);

  const getSites = async () => {
    let sites;

    const sitesQueryConfig = {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    };
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/config/sites`,
      sitesQueryConfig
    );
    sites = await response.json();
    if (response.ok) {
      const sitesClean = sites.sites
        .filter((site) => site.site !== "0-0")
        .map((site) => {
          return {
            id: site.site,
            siteId: site.site.split("-")[0],
            locationId: site.site.split("-")[1],
            name: site.name,
          };
        });
      return sitesClean;
    } else {
      return Promise.resolve({
        error: sites?.Error?.Message?? "There was an error obtaining the sites list",
      });
    }
  };

  const singleLogin = async ({ username, password, siteId }) => {
    const payload = {
      Username: username,
      Password: password,
    };
    const key = process.env.REACT_APP_ENCRYPTION_KEY;
    const encrypted = crypto.AES.encrypt(
      JSON.stringify(payload),
      key
    ).toString();
    const body = { data: encrypted };
    const loginConfig = {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        siteid: process.env.REACT_APP_SITE_ID,
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/userToken/`,
      loginConfig
    );
    const responseData = await response.json();
    if (response.ok) {
      const userRole = responseData.userRol.toLowerCase().trim();
      if (userRole !== "designer" && userRole !== "directiva") {
        return Promise.resolve({
          error: "Failed to authenticate against NOT AUTHORIZED",
          siteId: siteId,
        });
      } else {
        return Promise.resolve(responseData);
      }
    } else {
      return Promise.resolve({
        error: responseData?.Error?.Message?? "Failed to authenticate",
        siteId: siteId,
      });
    }
  };

  const handleFormSubmit = async (e) => {
    const validate = validateForm();
    if (state.requesting || !validate) {
      return;
    }

    setState((state) => ({
      ...state,
      requesting: true,
      error: false,
    }));

    try {
      const sites = await getSites().catch((error) => {
        console.log(error);
      });
      if (sites.error) {
        setState((state) => ({
          ...state,
          requesting: false,
          error: true,
          message: sites.error,
        }));
      }
      else{
        const auth = await singleLogin({
          username: state.username,
          password: state.password,
          siteId: `${process.env.REACT_APP_SITE_ID}`,
        }).catch((error) => {
          console.log(error);
        });
        if (auth.error) {
          setState((state) => ({
            ...state,
            requesting: false,
            error: true,
            message: auth.error,
          }));
        } else {
          authContext.setAuth({
            ...authContext.auth,
            auth,
            sites,
            loggedIn: true,
          });
          setState((state) => ({
            ...state,
            requesting: false,
            redirect: true,
          }));
        }
      }
    } catch (error) {
      console.error(error);
      setState((state) => ({
        ...state,
        requesting: false,
        error: true,
        message: JSON.stringify(error),
      }));
    }
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setState((state) => ({
      ...state,
      [name]: value,
    }));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      {state.redirect && <Navigate to="/upload-images" replace={true} />}
      <Container component="main" maxWidth="xs" sx={{ pt: 2 }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={logo} width="35%" alt="Little Bellies Logo" />
          <Typography component="h1" variant="h5" data-cy="loginTitle">
            Log in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              size="small"
              value={state.username}
              margin="normal"
              required
              fullWidth
              id="username"
              data-cy="username"
              label="Username"
              name="username"
              onChange={handleInputChange}
              error= {state.errors.password!==""}
              helperText={ state.errors.password}
            />
            <TextField
              size="small"
              value={state.password}
              margin="normal"
              required
              fullWidth
              name="password"
              data-cy="password"
              label="Password"
              type="password"
              id="password"
              onChange={handleInputChange}
              error= {state.errors.password!==""}
              helperText={ state.errors.password}
            />
            {state.error && <Alert 
              data-cy="errorAlert" severity="error">{state.message}</Alert>}
            <Button
              onClick={handleFormSubmit}
              fullWidth
              data-cy="submitButton"
              variant="contained"
              color="primaryLb"
              sx={{ mt: 3, mb: 2 }}
            >
              {state.requesting && <CircularProgress color="white" size="1.5rem"/>}
              {!state.requesting && <>Sign In</>}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
