import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { useStore } from "../store/zustand";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React from "react";

const NavBar = ({ isLogin = false }) => {
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.clear(); // clear all the data from local storage
    setUser("", ""); // set the user to empty
    navigate("/"); // use auth
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ backgroundColor: "purple" }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              Quiz app
            </Link>
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Level Up !!! {/* Upcoming !! */}
          </Typography>
          <Button
            href="https://drive.google.com/file/d/1xZt-RCm8UAWdcxe0UgAm-E-OC8MgBcm0/view?usp=sharing"
            color="secondary"
            sx={{ mr: 2 }}
            variant="contained"
          >
            Contact
          </Button>
          {isLogin && (
            <Button color="error" onClick={handleLogOut} variant="contained">
              LogOut
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;
