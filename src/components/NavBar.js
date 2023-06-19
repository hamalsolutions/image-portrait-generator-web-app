import React, { useContext } from "react";
import { AuthContext } from "../App";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import logoHorizontal from "../img/logo-horizontal.png";
import avatar from "../img/avatar.jpg";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Stack } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { pages } from "../config/constants";
import { Navigate } from "react-router-dom";

const theme = createTheme({
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
      main: "#fff",
      light: "#757ce8",
      dark: "#002884",
      contrastText: "#c2608e",
    },
    text: {
      primaryLb: "#c2608e",
      secondaryLb: "#8c8c8c",
    },
  },
});

const initalAuthState = {
  loggedIn: false,
  auth: {},
  status: "idle",
  sites: [],
};

function NavBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [redirect, setRedirect] = React.useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const authContext = useContext(AuthContext);

  const logout = () => {
    authContext.setAuth(initalAuthState);
    setRedirect(true);
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="backgroundLb">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <img src={logoHorizontal} width="124" alt="Little Bellies Logo" />
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page.title}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "block", md: "none" } }}>
              <img src={logoHorizontal} width="124" alt="Little Bellies Logo" />
            </Box>
            <Box
              sx={{ flexGrow: 1, ml: 3, display: { xs: "none", md: "flex" } }}
            >
              {pages.map((page) => (
                <Link to={page.url} key={page.title} className="header-link">
                  <Button
                    data-cy={page.dataCy}
                    color="primaryLb"
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, display: "block" }}
                  >
                    {page.title}
                  </Button>
                </Link>
              ))}
            </Box>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1}
              sx={{ flexGrow: 0 }}
            >
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src={avatar} />
              </IconButton>

              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
              <Stack
                direction="column"
                justifyContent="center"
                alignItems="flex-start"
                spacing={-1}
                sx={{ display: { xs: "none", md: "block" } }}
              >
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {authContext.auth.auth.userName}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondaryLb" }}>
                  <small>{authContext.auth.auth.userRol}</small>
                </Typography>
              </Stack>
              <LogoutIcon
                size="small"
                sx={{ pl: 2, display: { xs: "none", md: "block" } }}
                onClick={logout}
              />
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      {redirect && <Navigate to="/upload-images" replace={true} />}
    </ThemeProvider>
  );
}
export default NavBar;
