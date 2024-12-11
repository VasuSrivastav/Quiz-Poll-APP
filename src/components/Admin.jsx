import {
  Box,
  Button,
  Container,
  Stack,
  styled,
  TextField,
  Tooltip,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useStore } from "../store/zustand";

import { useNavigate } from "react-router-dom";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import Slider from "@mui/material/Slider";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
// import dotenv from 'dotenv';
// dotenv.config();

// const URL = process.env.REACT_APP_SERVER_URL;
const URL =
  import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_SERVER_URL
    : "http://localhost:5001";
const Admin = () => {
  const { role, name } = useStore();
  const socket = useMemo(() => io(URL), []);

  const [sliderTimer, setSliderTimer] = useState(30);
  const [timer, setTimer] = useState(0);
  const [wait, setWait] = useState(false);
  const [allVotes, setAllVotes] = useState(0); // for counting the percentage of the votes for each option
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [data, setData] = useState({
    question: "Is this a question ?",
    timer: 0,
    options: [
      { id: 1, votes: 5, optionText: "Yess" },
      { id: 2, votes: 6, optionText: "Yes" },
      { id: 3, votes: 7, optionText: "We will see" },
      { id: 4, votes: 8, optionText: "No" },
    ],
    correctOption: -1,
  });
  // const [bar, setBar] = useState({
  //   tiles: [{ votes: 5 }, { votes: 6 }, { votes: 7 }, { votes: 8 }],
  // });
  const [barA, setBarA] = useState(0);
  const [barB, setBarB] = useState(0);
  const [barC, setBarC] = useState(0);
  const [barD, setBarD] = useState(0);

  const navigate = useNavigate();

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  useEffect(() => {
    // when using local storage
    // if (localStorage.getItem("quizStore")) {
    //   if (JSON.parse(localStorage.getItem("quizStore")).role === "admin") {
    //     navigate("/admin");
    //   } else if (
    //     JSON.parse(localStorage.getItem("quizStore")).role === "user" &&
    //     JSON.parse(localStorage.getItem("quizStore")).name == ""
    //   ) {
    //     navigate("/");
    //   } else if (
    //     JSON.parse(localStorage.getItem("quizStore")).role === "user" &&
    //     JSON.parse(localStorage.getItem("quizStore")).name !== ""
    //   ) {
    //     navigate("/user");
    //   }
    // } else {
    //   navigate("/");
    // }
    if (role === "user" && name !== "") {
      navigate("/user");
    }
    if (role === "" || name === "") {
      navigate("/");
    }
    if (role === "admin") {
      navigate("/admin");
    }
  }, []);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Admin Connected to server", socket.id);
    });
    socket.on("userselectedID", ({ submitId, correctOption, tile }) => {
      console.log("new", submitId);
      // may be run a fx
      totalPerson(submitId, correctOption, tile);
    });
    // i need to recivedd all user data for calculation

    return () => {
      socket.disconnect();
    };
  }, []);

  const totalPerson = (receivedOption, correctOption, tile) => {
    setAllVotes((prevState) => prevState + 1);
    // console.log("", correctOption);
    if (receivedOption == correctOption) {
      setCorrect((prevState) => prevState + 1);
    } else {
      setWrong((prevState) => prevState + 1);
    }
    if (tile == 5) {
      setBarA((prevState) => prevState + 1);
    } else if (tile == 6) {
      setBarB((prevState) => prevState + 1);
    } else if (tile == 7) {
      setBarC((prevState) => prevState + 1);
    } else if (tile == 8) {
      setBarD((prevState) => prevState + 1);
    }
  };

  const handleQuestion = (value) => {
    setData({ ...data, question: value });
  };

  const handleSetCorrectOption = (e) => {
    setData({ ...data, correctOption: e.target.value });
  };
  // here i am using id for the option to change the text of the option
  const handleOption = (text, id) => {
    setData((prevState) => ({
      ...prevState,
      options: prevState.options.map((option) =>
        option.id === id ? { ...option, optionText: text } : option
      ),
    }));
  };

  const handleSendForm = (e) => {
    e.preventDefault();
    setAllVotes(0);
    setCorrect(0);
    setWrong(0);
    setBarA(0);
    setBarB(0);
    setBarC(0);
    setBarD(0);

    if (
      data.question === "" ||
      data.options[0].optionText === "" ||
      data.options[1].optionText === "" ||
      data.options[2].optionText === "" ||
      data.options[3].optionText === "" ||
      data.correctOption === -1
    ) {
      alert("Please fill all the fields");
      return;
    }
    setWait(true); //handle in useeffect
    data.timer = sliderTimer;
    startCountdown(sliderTimer);
    socket.emit("dataSend", data);
    setTimer(data.timer); //for this screen visibility
    // console.log(data);
  };

  const handleDelete = () => {
    setData((prevState) => ({
      ...prevState,
      question: "",
      options: [
        { id: 1, optionVotes: 0, optionText: "" },
        { id: 2, optionVotes: 0, optionText: "" },
        { id: 3, optionVotes: 0, optionText: "" },
        { id: 4, optionVotes: 0, optionText: "" },
      ],
      correctOption: -1,
      allVotes: 0,
    }));
  };

  function startCountdown(timer) {
    let count = timer;
    // setWait(true);
    const countdownInterval = setInterval(() => {
      if (count <= 0) {
        clearInterval(countdownInterval);
        setWait(false);
      } else {
        setTimer((prevNo) => prevNo - 1);
        count -= 1;
      }
    }, 1000); // 1 second
  }
  return (
    <Container
      maxWidth="xl"
      style={{ backgroundColor: "#f9ccff", height: "90vh" }}
    >
      <Stack direction={"row"}>
        <Box sx={{ width: "50%", height: "90vh" }}>
          <Typography variant="h3" component="div" gutterBottom style={{}}>
            what's the question ?
          </Typography>
          <form
            style={{ display: "flex", flexDirection: "column" }}
            onSubmit={handleSendForm}
          >
            <TextField
              value={data.question}
              onChange={(e) => {
                handleQuestion(e.target.value);
              }}
              id="outlined-basic"
              label="Question"
              variant="outlined"
              sx={{ width: "75%" }}
            />
            <FormControl>
              <FormLabel id="demo-radio-buttons-group-label">Options</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue=""
                name="radio-buttons-group"
              >
                {data.options.map((option, i) => (
                  <div key={i}>
                    <FormControlLabel
                      value={option.id}
                      onChange={handleSetCorrectOption}
                      control={<Radio />}
                    />
                    <TextField
                      label={`Option ${i + 1}`}
                      onChange={(e) => {
                        handleOption(e.target.value, option.id);
                      }}
                      sx={{ marginY: 1 }}
                      value={option.optionText}
                    />
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <Box sx={{ width: "70%", marginX: "auto", marginY: 2 }}>
              <Slider
                onChange={(e, value) => setSliderTimer(value)}
                aria-label="Timer"
                defaultValue={30}
                valueLabelDisplay="auto"
                shiftStep={10}
                step={10}
                marks
                min={10}
                max={60}
              />
            </Box>

            <Box sx={{ width: "70%", marginX: "auto" }}>
              <Tooltip title="Delete">
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={handleDelete}
                  disabled={wait ? true : false}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                sx={{ width: "70%", marginLeft: 2 }}
                disabled={wait ? true : false}
              >
                send Question
              </Button>
            </Box>
          </form>
        </Box>

        <Box sx={{ width: "50vw", height: "90vh" }}>
          <Stack
            sx={{ width: "90%", marginX: "auto", height: "100%" }}
            spacing={2}
          >
            <Box sx={{ width: "100%", height: "28%" }}>
              <Stack direction="row" spacing={1} sx={{ marginY: 2 }}>
                <Typography
                  variant="h4"
                  component="div"
                  gutterBottom
                  sx={{
                    width: "42%",
                    padding: 1,
                    bgcolor: "white",
                    borderColor: "pink",
                    border: 2,
                    borderRadius: 20,
                    textAlign: "center",
                  }}
                >
                  Time: {timer}
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  gutterBottom
                  sx={{
                    width: "42%",
                    padding: 1,
                    bgcolor: "white",
                    borderColor: "pink",
                    border: 2,
                    borderRadius: 20,
                    textAlign: "center",
                  }}
                >
                  TotalUser:{allVotes}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Typography
                  variant="h4"
                  component="div"
                  gutterBottom
                  sx={{
                    width: "42%",
                    padding: 1,
                    bgcolor: "white",
                    borderColor: "pink",
                    border: 2,
                    borderRadius: 20,
                    textAlign: "center",
                  }}
                >
                  Correct: {correct}
                </Typography>
                <Typography
                  variant="h4"
                  component="div"
                  gutterBottom
                  sx={{
                    width: "42%",
                    padding: 1,
                    bgcolor: "white",
                    borderColor: "pink",
                    border: 2,
                    borderRadius: 20,
                    textAlign: "center",
                  }}
                >
                  Wrong: {wrong}
                </Typography>
              </Stack>
            </Box>
            <Box sx={{ width: "100%", height: "30%" }}>
              <Typography
                variant="h4"
                component="div"
                gutterBottom
                sx={{
                  width: "89%",
                  padding: 0,
                  margin: 0,
                  textAlign: "center",
                }}
              >
                Stats ...
              </Typography>
              <Stack direction="row" spacing={1} sx={{ marginBottom: 1 }}>
                <Typography
                  variant="h5"
                  component="div"
                  gutterBottom
                  sx={{
                    width: "42%",
                    padding: 1,
                    margin: 0,
                    bgcolor: "white",
                    borderColor: "pink",
                    border: 2,
                    borderRadius: 20,
                    textAlign: "center",
                  }}
                >
                  A: {barA}
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  gutterBottom
                  sx={{
                    width: "42%",
                    padding: 1,
                    margin: 0,
                    bgcolor: "white",
                    borderColor: "pink",
                    border: 2,
                    borderRadius: 20,
                    textAlign: "center",
                  }}
                >
                  B:{barB}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Typography
                  variant="h5"
                  component="div"
                  gutterBottom
                  sx={{
                    width: "42%",
                    padding: 1,
                    bgcolor: "white",
                    borderColor: "pink",
                    border: 2,
                    borderRadius: 20,
                    textAlign: "center",
                  }}
                >
                  C: {barC}
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  gutterBottom
                  sx={{
                    width: "42%",
                    padding: 1,
                    bgcolor: "white",
                    borderColor: "pink",
                    border: 2,
                    borderRadius: 20,
                    textAlign: "center",
                  }}
                >
                  D: {barD}
                </Typography>
              </Stack>
            </Box>
            <Box sx={{ width: "82%", height: "40%" }}>
              <Stack sx={{ width: "100%", height: "25%" }} spacing={0}>
                <span
                  style={{
                    marginX: "auto",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h5"
                    component="div"
                    gutterBottom
                    sx={{
                      whiteSpace: "nowrap",
                      width: "80%",
                      padding: 1,
                      margin: 0,
                      bgcolor: "white",
                      borderColor: "pink",
                      border: 2,
                      borderRadius: 20,
                      textAlign: "center",
                    }}
                  >
                    A:
                    {barA == 0 ? (
                      "no vote"
                    ) : (
                      <span>{(barA / allVotes) * 100}%</span>
                    )}
                  </Typography>
                  <Typography
                    variant="h5"
                    component="div"
                    gutterBottom
                    sx={{
                      whiteSpace: "nowrap",
                      width: "80%",
                      padding: 1,
                      margin: 0,
                      bgcolor: "white",
                      borderColor: "pink",
                      border: 2,
                      borderRadius: 20,
                      textAlign: "center",
                    }}
                  >
                    B:
                    {barB == 0 ? (
                      "no vote"
                    ) : (
                      <span>{(barB / allVotes) * 100}%</span>
                    )}
                  </Typography>
                  <Typography
                    variant="h5"
                    component="div"
                    gutterBottom
                    sx={{
                      whiteSpace: "nowrap",
                      width: "80%",
                      padding: 1,
                      margin: 0,
                      bgcolor: "white",
                      borderColor: "pink",
                      border: 2,
                      borderRadius: 20,
                      textAlign: "center",
                      textWrap: "nowrap",
                    }}
                  >
                    C:
                    {barC == 0 ? (
                      "no vote"
                    ) : (
                      <span>{(barC / allVotes) * 100}%</span>
                    )}
                  </Typography>
                  <Typography
                    variant="h5"
                    component="div"
                    gutterBottom
                    sx={{
                      whiteSpace: "nowrap",
                      width: "80%",
                      padding: 1,
                      margin: 0,
                      bgcolor: "white",
                      borderColor: "pink",
                      border: 2,
                      borderRadius: 20,
                      textAlign: "center",
                      textWrap: "nowrap",
                    }}
                  >
                    D:
                    {barD == 0 ? (
                      "no vote"
                    ) : (
                      <span>{(barD / allVotes) * 100}%</span>
                    )}
                  </Typography>
                </span>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default Admin;
