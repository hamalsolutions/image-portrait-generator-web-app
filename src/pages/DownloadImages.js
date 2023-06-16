import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../App";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import NavBar from "../components/NavBar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import axios from "axios";
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

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function DownloadImages() {
  const initialState = {
    requesting: false,
    downloadSuccess: false,
    error: false,
    message: "",
    selectedAll: false,
    downloadEnabled: false,
    fileList: [],
    displayFile: -1,
  };
  const [state, setState] = useState(initialState);
  const authContext = useContext(AuthContext);

  const [open, setOpen] = React.useState(false);
  const handleOpen = (index) => {
    downloadImage(index, false);
    setOpen(true);
  };
  const handleClose = () => {
    setState((state) => ({
      ...state,
      displayFile: -1,
    }));
    setOpen(false);
  };

  useEffect(() => {
    console.log("onMount");
    if (state.requesting) {
      return;
    }
    setState((state) => ({
      ...state,
      requesting: true,
    }));
    async function getImagesList() {
      try {
        const getImageConfig = {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        };
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/services/portrait/${authContext.auth.auth.userId}?date=2023-06-15`,
          getImageConfig
        );
        const responseData = await response.json();
        if (response.ok) {
          const fileList = [...responseData.fileList];
          if (fileList.length > 0) {
            fileList.forEach((element) => {
              element.url = "";
              element.selected = false;
            });
          }
          setState((state) => ({
            ...state,
            requesting: false,
            fileList: responseData.fileList,
          }));
        } else {
          setState((state) => ({
            ...state,
            requesting: false,
            error: true,
            message: responseData?.error?.message ?? "Error getting the list",
            fileList: [],
          }));
        }
      } catch (error) {
        console.error(error.message ?? JSON.stringify(error));
        setState((state) => ({
          ...state,
          requesting: false,
          error: true,
          message: error.message ?? JSON.stringify(error),
          fileList: [],
        }));
      }
    }
    getImagesList();
  }, []);

  const downloadImage = async (index, download) => {
    const fileList = [...state.fileList];
    
    if (fileList[index].url === "") {
      axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}/api/services/portrait?fileName=${fileList[index].fileName}`,
        responseType: "blob",
      })
        .then(function (response) {
          try {
            if (response.status === 200) {
              const url = window.URL.createObjectURL(response.data);
              if (download) {
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileList[index].imageName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
              fileList[index].url = url;
              setState((state) => ({
                ...state,
                fileList,
                ...!download && {displayFile: index}
              }));
            } else {
              console.log("error al descargar la imagen");
            }
          } catch (errorE) {
            console.error(errorE);
            // setState((state) => ({
            //   ...state,
            //   show: true,
            //   status: "ready",
            //   message: "The file couldn't be fetched: " + JSON.stringify(errorE),
            //   success: false,
            // }));
          }
        })
        .catch(async (error) => {
          console.log("error al descargar la imagen");
        });
    }
    else{
      if(download){
        const link = document.createElement("a");
        link.href = fileList[index].url;
        link.setAttribute("download", fileList[index].fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      else{
        setState((state) => ({
          ...state,
          displayFile: index
        }));
      }
    }
  };

  const multiDownload = async () => {
    const files = state.files;
    const uploadAttemps = files.map((image) => downloadImage(image));
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
      failedUploads,
    };
    return Promise.resolve(finalResult);
  };

  const handleFormSubmit = async (e) => {
    if (state.requesting) {
      return;
    }
    downloadImage(0, true);

    setState((state) => ({
      ...state,
      requesting: false,
      error: false,
    }));

    // try {
    //   const upload = await multiUpload();
    //   if (!upload?.success) {
    //     let message = "There was an error uploading: ";
    //     upload.failedUploads.forEach((item) => {
    //       message += item.fileError + " ";
    //     });
    //     setState((state) => ({
    //       ...state,
    //       requesting: false,
    //       error: true,
    //       message: message,
    //     }));
    //   } else {
    //     setState((state) => ({
    //       ...state,
    //       requesting: false,
    //       uploadSuccess: true,
    //     }));
    //   }
    // } catch (error) {
    //   console.error("error", error);
    //   setState((state) => ({
    //     ...state,
    //     requesting: false,
    //     error: true,
    //     message: error.message,
    //   }));
    // }
  };

  const handleSelectAll = (event) => {
    const localRows = [...state.fileList];
    localRows.forEach((element) => {
      element.selected = event.target.checked;
    });
    setState((state) => ({
      ...state,
      selectedAll: event.target.checked,
      fileList: localRows,
      downloadEnabled: event.target.checked,
    }));
  };

  const handleSelectItem = (event, index) => {
    let selectedAll = true;
    let downloadEnabled = false;
    const localRows = [...state.fileList];
    localRows[index].selected = event.target.checked;
    localRows.forEach((element) => {
      selectedAll = selectedAll * element.selected;
      downloadEnabled = downloadEnabled + element.selected;
    });
    setState((state) => ({
      ...state,
      selectedAll,
      downloadEnabled,
      fileList: localRows,
    }));
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <NavBar />
      <Container
        component="main"
        maxWidth="lg"
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
          Download Photos
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <TableContainer component={Paper} sx={{ mt: 4, minWidth: 1 }}>
              <Table sx={{ minWidth: 1 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        {...label}
                        checked={state.selectedAll}
                        onChange={handleSelectAll}
                        size="small"
                      />
                    </TableCell>
                    <TableCell> </TableCell>
                    <TableCell>PHOTO</TableCell>
                    <TableCell>CLIENT</TableCell>
                    <TableCell>PHONE</TableCell>
                    <TableCell>EMAIL</TableCell>
                    <TableCell>OBSERVATIONS</TableCell>
                  </TableRow>
                </TableHead>
                {state.fileList.length === 0 && (
                  <TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>THERE ARE NO REGISTRIES TO SHOW</TableCell>
                    </TableRow>
                  </TableBody>
                )}
                {state.fileList.length > 0 && (
                  <TableBody>
                    {state.fileList.map((row, index) => (
                      <TableRow
                        key={row.userId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>
                          <Checkbox
                            {...label}
                            checked={row.selected ? 1 : 0}
                            onChange={(event) => handleSelectItem(event, index)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <VisibilityIcon
                            onClick={() => {
                              handleOpen(index);
                            }}
                          />
                        </TableCell>
                        <TableCell>{row.fileName}</TableCell>
                        <TableCell>{row.clientName}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>{row.clientEmail}</TableCell>
                        <TableCell>{row.comments}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Button
              onClick={handleFormSubmit}
              data-cy="submitButton"
              variant="contained"
              className="submitButton"
              color="primaryLb"
              disabled={!state.downloadEnabled}
              sx={{
                width: { xs: 1, md: 0.3 },
                mt: 3,
                mb: 2,
              }}
            >
              Download
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
          {state.displayFile !== -1 && <img src={state.fileList[state.displayFile].url} alt="" />}
        </Box>
      </Modal>
    </ThemeProvider>
  );
}
