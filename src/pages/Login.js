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
import logo from "../logo.png";

const defaultTheme = createTheme();
const Login = () => {
  const [state, setState] = useState({
    requesting: false,
    redirect: false,
    error: false,
    message: "",
    username: "",
    password: "",
  });

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
        siteid: siteId,
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
      if (userRole === "technicians") {
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
    if (state.requesting) {
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
          siteId: "557418",
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
      <Container component="main" maxWidth="xs" sx={{ pt: 5 }}>
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
              value={state.username}
              margin="normal"
              required
              fullWidth
              id="username"
              data-cy="username"
              label="Username"
              name="username"
              autoFocus
              onChange={handleInputChange}
            />
            <TextField
              value={state.password}
              margin="normal"
              required
              fullWidth
              name="password"
              data-cy="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleInputChange}
            />
            {state.error && <Alert 
              data-cy="errorAlert" severity="error">{state.message}</Alert>}
            <Button
              onClick={handleFormSubmit}
              fullWidth
              data-cy="submitButton"
              variant="contained"
              sx={{ mt: 3, mb: 2,
                backgroundColor: "#c2608e",
                borderColor: "#c2608e #c2608e #fff",}}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
