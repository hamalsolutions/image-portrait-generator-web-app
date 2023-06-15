import React, { useState, useContext } from "react";
import { AuthContext } from "../App";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import { MuiFileInput } from "mui-file-input";
import NavBar from "../components/NavBar";
import Alert from "@mui/material/Alert";
import "../App.css";
// validate mail required on form
const defaultTheme = createTheme({
  palette: {
    primaryLb: {
      main: "#c2608e",
      light: "#ce7fa4",
      dark: "#874363",
      contrastText: "#fff",
    },
    secondaryLb: {
      main: "#f6f6f6",
    },
    backgroundLb: {
      main: "#f6f6f6",
      light: "#757ce8",
      dark: "#002884",
      contrastText: "#c2608e",
    },
  },
});

export default function UploadImages() {
  const initialState = {
    requesting: false,
    uploadSuccess: false,
    error: false,
    message: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    observation: "",
    files: [],
  };

  const [state, setState] = useState(initialState);
  const authContext = useContext(AuthContext);

  const uploadImage = async (image) => {
    const data = new FormData();
    const payload = {
      clientName: state.name,
      clientEmail: state.email,
      userId: authContext.auth.auth.userId,
      clientPhone: state.phone,
      // location: state.location,
      comments: state.observation,
      photos: image,
    };
    const keys = Object.keys(payload);
    keys.forEach((key, index) => {
      data.append(`${key}`, payload[key]);
    });

    const uploadImageConfig = {
      method: "POST",
      body: data,
    };
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/services/portrait/uploadFile`,
      uploadImageConfig
    );
    const responseData = await response.json();
    if (response.ok) {
      return responseData;
    } else {
      return Promise.resolve({
        fileError: image.name,
        error:
          responseData?.Error?.Message ??
          "There was an error uploading the image",
      });
    }
  };

  const multiUpload = async () => {
    const files = state.files;
    const uploadAttemps = files.map((image) => uploadImage(image));
    const uploadResults = await Promise.all(uploadAttemps);
    const successfulUploads = uploadResults.filter((item) => {
      return "filesNamesList" in item;
    });
    const failedUploads = uploadResults.filter((item) => {
      return "fileError" in item;
    });
    const finalResult = {
      success: successfulUploads.length === state.files.length,
      successfulUploads,
      failedUploads
    };
    return Promise.resolve(finalResult);
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
      const upload = await multiUpload();
      if (!upload?.success) {
        let message = "There was an error uploading: ";
        upload.failedUploads.forEach(item => {
          message += item.fileError + " ";
        });
        setState((state) => ({
          ...state,
          requesting: false,
          error: true,
          message: message,
        }));
      } else {
        setState((state) => ({
          ...state,
          requesting: false,
          uploadSuccess: true,
        }));
      }
    } catch (error) {
      console.error("error", error);
      setState((state) => ({
        ...state,
        requesting: false,
        error: true,
        message: error.message,
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

  const handleFilesChange = (value) => {
    setState((state) => ({
      ...state,
      files: value,
    }));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <NavBar />
      <Container
        component="main"
        maxWidth="md"
        sx={{ my: { xs: 3, md: 6 }, mb: 4 }}
      >
        <Typography
          component="h1"
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
            color: "#c2608e",
          }}
          data-cy="mainTitle"
        >
          8K Realistic View Add-on
        </Typography>
        <Typography
          component="h2"
          variant="h5"
          align="center"
          sx={{
            color: "#a6a6a6",
          }}
        >
          Upload Photos
        </Typography>
        <Paper
          variant="outlined"
          className="main-card"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12} md={6}>
              <TextField
                className="input-lb"
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
                className="input-lb"
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
                className="input-lb"
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
                className="input-lb"
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
              <MuiFileInput
                className="input-lb"
                size="small"
                id="files"
                data-cy="files"
                label="Upload Photos"
                name="files"
                value={[...state.files]}
                multiple
                fullWidth
                hideSizeText={!state.files.length > 0}
                onChange={handleFilesChange}
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                className="input-lb"
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
              {state.uploadSuccess && (
                <Alert
                  severity="success"
                  data-cy="successMessage"
                  sx={{ width: 0.5, mx: "auto", textAlign: "center" }}
                >
                  All files were uploaded successfully
                </Alert>
              )}
              {state.error && (
                <Alert
                  severity="error"
                  data-cy="errorMessage"
                  sx={{ width: 0.5, mx: "auto", textAlign: "center" }}
                >
                  {state.message}
                </Alert>
              )}
              <Button
                onClick={handleFormSubmit}
                data-cy="submitButton"
                variant="contained"
                className="submitButton"
                color="primaryLb"
                sx={{
                  width: { xs: 1, md: 0.3 },
                  mt: 3,
                  mb: 2,
                }}
              >
                Upload
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}
