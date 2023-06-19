import React, { useState, useEffect, useContext, forwardRef } from "react";
import { AuthContext } from "../App";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
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
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Alert from "@mui/material/Alert";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CircularProgress from "@mui/material/CircularProgress";
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
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const StyledTableHead = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#c2608e",
}));

export default function DownloadImages() {
  const initialState = {
    requesting: false,
    requestingDownload: false,
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

  const [startDate, setStartDate] = useState(new Date());
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <Button
      data-cy="calendarButton"
      variant="contained"
      className="submitButton"
      color="secondaryLb"
      sx={{
        mt: 3,
        mb: 2,
      }}
      onClick={onClick}
      ref={ref}
    >
      <CalendarMonthIcon color="primaryLb" sx={{ px: 1 }} />
      {value}
      <KeyboardArrowDownIcon color="primaryLb" sx={{ px: 1 }} />
    </Button>
  ));

  useEffect(() => {
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
        const date = moment(startDate).format("YYYY-MM-DD");
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/services/portrait/${authContext.auth.auth.userId}?date=${date}`,
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
  }, [startDate]);

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
                link.setAttribute("download", fileList[index].fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }
              fileList[index].url = url;
              setState((state) => ({
                ...state,
                fileList,
                ...(!download && { displayFile: index }),
              }));
            } else {
              console.log("error al descargar la imagen");
            }
          } catch (errorE) {
            console.error(errorE);
            console.log("error al descargar la imagen");
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
    } else {
      if (download) {
        const link = document.createElement("a");
        link.href = fileList[index].url;
        link.setAttribute("download", fileList[index].fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        setState((state) => ({
          ...state,
          displayFile: index,
        }));
      }
    }
  };

  const handleDownloadAll = async (e) => {
    if (state.requestingDownload) {
      return;
    }

    setState((state) => ({
      ...state,
      requestingDownload: true,
      error: false,
    }));

    state.fileList.forEach((element, index) => {
      if (element.selected) {
        downloadImage(index, true);
      }
    });

    setState((state) => ({
      ...state,
      requestingDownload: false,
    }));
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
          <Grid item xs={12} sx={{ mt: 1, textAlign: "right" }}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              customInput={<ExampleCustomInput />}
            />
          </Grid>
          <Grid item xs={12}>
            <TableContainer
              className="tableComponent"
              component={Paper}
              sx={{ minWidth: 1 }}
            >
              <Table sx={{ minWidth: 1 }}>
                <TableHead>
                  <StyledTableHead theme={defaultTheme}>
                    <TableCell
                      sx={{
                        py: 1,
                        px: 0.5,
                        color: "#ffffff",
                        fontWeight: "bold",
                      }}
                    >
                      <Checkbox
                        {...label}
                        checked={state.selectedAll}
                        onChange={handleSelectAll}
                        size="small"
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        py: 1,
                        px: 0.5,
                        color: "#ffffff",
                        fontWeight: "bold",
                      }}
                    >
                      {" "}
                    </TableCell>
                    <TableCell
                      sx={{ py: 1, color: "#ffffff", fontWeight: "bold" }}
                    >
                      PHOTO
                    </TableCell>
                    <TableCell
                      sx={{ py: 1, color: "#ffffff", fontWeight: "bold" }}
                    >
                      CLIENT
                    </TableCell>
                    <TableCell
                      sx={{ py: 1, color: "#ffffff", fontWeight: "bold" }}
                    >
                      PHONE
                    </TableCell>
                    <TableCell
                      sx={{ py: 1, color: "#ffffff", fontWeight: "bold" }}
                    >
                      EMAIL
                    </TableCell>
                    <TableCell
                      sx={{ py: 1, color: "#ffffff", fontWeight: "bold" }}
                    >
                      OBSERVATIONS
                    </TableCell>
                  </StyledTableHead>
                </TableHead>
                {state.requesting && (<TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        scope="row"
                        colSpan={7}
                        align="center"
                        component="th"
                      >
                        <CircularProgress size="1.5rem" />
                      </TableCell>
                    </TableRow>
                  </TableBody>)}
                
                {!state.requesting && (
                <>
                {state.fileList.length === 0 && (
                  <TableBody>
                    <TableRow
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        scope="row"
                        colSpan={7}
                        align="center"
                        component="th"
                      >
                        THERE ARE NO REGISTRIES TO SHOW
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
                {state.fileList.length > 0 && (
                  <TableBody>
                    {state.fileList.map((row, index) => (
                      <StyledTableRow
                        key={row.userId}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell sx={{ p: 0.5 }}>
                          <Checkbox
                            {...label}
                            checked={row.selected ? 1 : 0}
                            onChange={(event) => handleSelectItem(event, index)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell sx={{ p: 0.5 }}>
                          <VisibilityIcon
                            onClick={() => {
                              handleOpen(index);
                            }}
                            color="primaryLb"
                          />
                        </TableCell>
                        <TableCell sx={{ py: 0.5, fontWeight: "bold" }}>
                          {row.fileName}
                        </TableCell>
                        <TableCell sx={{ py: 0.5 }}>{row.clientName}</TableCell>
                        <TableCell sx={{ py: 0.5 }}>{row.phone}</TableCell>
                        <TableCell sx={{ py: 0.5 }}>
                          {row.clientEmail}
                        </TableCell>
                        <TableCell sx={{ py: 0.5, 
                              maxWidth: "200px",
                              textOverflow: "ellipsis",
                              wordBreak: 'break-all'}}>
                            {row.comments}
                        </TableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                )}
                </>)}
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "right" }}>
            <Button
              onClick={handleDownloadAll}
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
          {state.error && (
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Alert severity="error" sx={{ mt: 2 }}>
                {state.message}
              </Alert>
            </Grid>
          )}
        </Grid>
      </Container>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          {state.displayFile !== -1 &&
            state.fileList[state.displayFile].url !== "" && (
              <img
                src={state.fileList[state.displayFile].url}
                width="100%"
                alt=""
              />
            )}
        </Box>
      </Modal>
    </ThemeProvider>
  );
}
