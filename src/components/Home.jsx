import { Box, Button, Stack, TextField } from "@mui/material";
import AdminPanelSettingsTwoToneIcon from "@mui/icons-material/AdminPanelSettingsTwoTone";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";
// import SendIcon from "@mui/icons-material/Send";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store/zustand";

const Home = () => {
  const navigate = useNavigate();
  const [popup, setPopup] = useState(false);
  const [userName, setUserName] = useState(""); //input field data
  const { role, name, setUser } = useStore();
  // const {user, name, setUserType} = useStore();

  // work as auth
  useEffect(() => {
    // as i am using zustand so i dont need to check the local storage and i am setuser in handleadmin and handleuser
    // if (localStorage.getItem("quizStore")) {
    //   if (JSON.parse(localStorage.getItem("quizStore")).role === "admin") {
    //     navigate("/admin");
    //   } else if (
    //     JSON.parse(localStorage.getItem("quizStore")).role === "user" &&
    //     JSON.parse(localStorage.getItem("quizStore")).name !== ""
    //   ) {
    //     navigate("/user");
    //   }
    // } else {
    //   navigate("/");
    // }
    if (role === "" || name === "") {
      navigate("/");
    }
    if (role === "admin") {
      navigate("/admin");
    }
    if (role === "user" && name !== "") {
      navigate("/user");
    }
  }, []);

  const HandleAdmin = (e) => {
    e.preventDefault();
    // const admin = {
    //   role: "admin",
    //   name: "admin",
    // };
    // console.log(admin);
    // localStorage.setItem("quizStore", JSON.stringify(admin));
    setUser("admin", "admin");
    navigate("/admin");
  };

  const HandleUser = (e) => {
    e.preventDefault();
    // v1 only local storage
    // const user = {
    //   role: "user",
    //   name: userName,
    // };
    // console.log(user);
    // localStorage.setItem("quizStore", JSON.stringify(user));
    setUser("user", userName);
    setPopup((prev) => !prev);

    // setPopup(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // const quizStore = JSON.parse(localStorage.getItem("quizStore"));
    // quizStore.name = userName;
    // localStorage.setItem("quizStore", JSON.stringify(quizStore));
    setUser("user", userName);
    navigate("/user");
  };

  return (
    <Box
      component="section"
      sx={{
        p: 2,
        border: "1px dashed grey",
        height: "90vh",
        bgcolor: "#f9ccff",
        // borderRadius: 1,
        // bgcolor: 'primary.main',
        // '&:hover': {
        //   bgcolor: 'primary.dark',
        // },
            }}
          >
            This is Quiz app with timer real time.
            <span>
        Please Wait, <Link to="https://quiz-poll-app-backend.onrender.com" target="_blank">Check Server Running... or not, On first time load its takes 50sec as deploy on render and off after 15 mins of inactivity</Link>
            </span>
            <Box
        component="section"
        sx={{
          p: 2,
          border: "1px dashed purple",
          //   height: 200,
          width: 400,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#fbf2fc",
          //   bgcolor: "primary.main",
          //   "&:hover": {
          //     bgcolor: "primary.dark",
          //   },
        }}
      >
        SignIn As.
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
          marginTop={2}
        >
          <Button
            href="/admin"
            onClick={HandleAdmin}
            color="secondary"
            variant="outlined"
            startIcon={<AdminPanelSettingsTwoToneIcon color="secondary" />}
          >
            Admin
          </Button>
          <Button
            href="/user"
            onClick={HandleUser}
            color="secondary"
            variant="outlined"
            endIcon={<PersonAddAltTwoToneIcon color="secondary" />}
          >
            User
          </Button>
        </Stack>
        {popup && (
          <Box my={2}>
            <form onSubmit={handleSubmit}>
              <TextField
                value={userName}
                sx={{ marginRight: 2 }}
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                id="outlined-basic"
                label="User Name"
                variant="outlined"
              />

              <Button variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </form>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Home;
