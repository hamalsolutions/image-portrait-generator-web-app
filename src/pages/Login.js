import React, { useState, useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../App";
import * as crypto from "crypto-js";
import { Navigate } from "react-router-dom";

const defaultTheme = createTheme();
const Login = () => {
  const [state, setState] = useState({
    requesting: false,
    redirect: false,
    status: "idle",
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
    if (response.ok) {
      sites = await response.json();
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
      return Promise.reject(
        new Error("Failed to retrieve the sitelist from /api/config/sites")
      );
    }
  };

  const singleLogin = async ({ username, password, siteId, locationId, siteName }) => {
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
    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData.userRol.trim());
      const userRole = responseData.userRol.toLowerCase().trim();
      if (userRole === "technicians") {
        return Promise.resolve({
          error:
            "Failed to authenticate against " +
            siteName +
            " " +
            siteId +
            " NOT AUTHORIZED",
          siteId: siteId,
          siteName: siteName,
        });
      } else {
        const data = {
          auth: responseData,
          siteId,
          locationId,
          siteName: siteName,
        };
        return Promise.resolve(data);
      }
    } else {
      return Promise.resolve({
        error: "Failed to authenticate against " + siteName + " " + siteId,
        siteId: siteId,
        siteName: siteName,
      });
    }
  };

  const multiLogin = async ({ username, password, sites }) => {
    const authAttemps = sites.map((site) =>
      singleLogin({
        username: username,
        password: password,
        siteId: site.siteId,
        locationId: site.locationId,
        siteName: site.name,
      })
    );
    const authResults = await Promise.all(authAttemps);
    const successfulAuths = authResults.filter((item) => {
      return "auth" in item;
    });
    return Promise.resolve(successfulAuths);
  };

  const handleFormSubmit = async (e) => {
    if (state.requesting) {
      return;
    }

    setState((state) => ({
      ...state,
      requesting: true,
    }));

    try {
      const sites = await getSites();
      const auths = await multiLogin({
        username: state.username,
        password: state.password,
        sites: sites,
      }).catch((error) => {
        console.log(error);
      });
      authContext.setAuth({
        ...authContext.auth,
        auths,
      });
      setState((state) => ({
        ...state,
        requesting: false,
        redirect: true,
      }));
    } catch (error) {
      alert(error.message);
      setState((state) => ({
        ...state,
        requesting: false,
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in {authContext.auth.status}
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              value={state.username}
              margin="normal"
              required
              fullWidth
              id="username"
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
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleInputChange}
            />
            <Button
              onClick={handleFormSubmit}
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
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
