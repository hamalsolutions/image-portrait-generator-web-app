import React from "react";
import Alert from "@mui/material/Alert";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import logo from "../img/logo.png";
import { useRouteError } from "react-router-dom";

export function Fallback() {
  return <p>Performing initial data "load"</p>;
}

const defaultTheme = createTheme({
  palette: {
    primaryLb: {
      main: "#c2608e",
      light: "#ce7fa4",
      dark: "#874363",
      contrastText: "#fff",
    },
  },
});

export function RootErrorBoundary() {
  let error = useRouteError();
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md" sx={{ pt: 2 }}>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img src={logo} width="17%" alt="Little Bellies Logo" />
          <Typography
            component="h1"
            variant="h4"
            data-cy="errorTitle"
            sx={{ mt: 2 }}
          >
            Uh oh, something went terribly wrong 😩
          </Typography>
          <Alert severity="error" sx={{ mt: 2 }}>
            {error.message || JSON.stringify(error)}
          </Alert>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
