import React, { useState, useContext } from "react";
import { AuthContext } from "../App";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logoHorizontal from "../logo-horizontal.png";
import MenuItem from "@mui/material/MenuItem";

const defaultTheme = createTheme();

export default function UploadImages() {
  const [state, setState] = useState({
    requesting: false,
    redirect: false,
    error: false,
    message: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    observation: "",
    files: [],
  });
  const authContext = useContext(AuthContext);

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
      // const auth = await singleLogin({
      //   username: state.username,
      //   password: state.password,
      //   siteId: "557418",
      // }).catch((error) => {
      //   console.log(error);
      // });
      // if (auth.error) {
      //   setState((state) => ({
      //     ...state,
      //     requesting: false,
      //     error: true,
      //     message: auth.error,
      //   }));
      // } else {
      //   authContext.setAuth({
      //     ...authContext.auth,
      //     auth,
      //     sites,
      //     loggedIn: true,
      //   });
      //   setState((state) => ({
      //     ...state,
      //     requesting: false,
      //     redirect: true,
      //   }));
      // }
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
      <CssBaseline />
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <img src={logoHorizontal} width="124" alt="Little Bellies Logo" />
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        maxWidth="md"
        sx={{ my: { xs: 3, md: 6 }, mb: 4 }}
      >
        <Typography component="h1" variant="h4" align="center">
          8K Realistic View Add-on
        </Typography>
        <Typography component="h2" variant="h5" align="center">
          Upload Photos
        </Typography>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                value={state.name}
                margin="normal"
                required
                fullWidth
                id="name"
                data-cy="name"
                label="Clients Name"
                name="name"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                value={state.email}
                margin="normal"
                required
                fullWidth
                id="email"
                data-cy="email"
                label="Clients Email"
                name="email"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                value={state.phone}
                margin="normal"
                required
                fullWidth
                id="phone"
                data-cy="phone"
                label="Clients Phone"
                name="phone"
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                size="small"
                select
                id="location"
                data-cy="location"
                label="Location"
                name="location"
                margin="normal"
                required
                fullWidth
              >
                {authContext.auth.sites.map((site) => (
                  <MenuItem key={site.id} value={site.id}>
                    {site.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                id="observation"
                data-cy="observation"
                label="Observations"
                name="observation"
                margin="normal"
                fullWidth
                multiline
                maxRows={4}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={handleFormSubmit}
                data-cy="submitButton"
                variant="contained"
                sx={{
                  width:{xs: 1, md: 0.3},
                  mt: 3,
                  mb: 2,
                  backgroundColor: "#c2608e",
                  borderColor: "#c2608e #c2608e #fff",
                }}
              >
                Sign In
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
