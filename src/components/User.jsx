import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useStore } from "../store/zustand";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const URL =
import.meta.env.VITE_NODE_ENV === "production"
    ? import.meta.env.VITE_SERVER_URL
    : "http://localhost:5001";

let timecount;

const User = () => {
  const { role, name } = useStore();
  const socket = useMemo(() => io(URL), []);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(-1);
  const [screentimer, setscreenTimer] = useState(0);
  const [data, setData] = useState({
    question: "Is this a question yes or no?",
    options: [
      { id: 1, votes: 5, optionText: "1234" },
      { id: 2, votes: 6, optionText: "asd" },
      { id: 3, votes: 7, optionText: "qwerty" },
      { id: 4, votes: 8, optionText: "No" },
    ],
    correctOption: -1,

    timer: 0,
  });
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (role === "") {
      navigate("/");
    }
    if (role === "admin") {
      navigate("/admin");
    }
    if (role === "user" && name !== "") {
      navigate("/user");
    }

    // when using local storage
    // if (localStorage.getItem("quizStore")) {
    //   if (
    //     JSON.parse(localStorage.getItem("quizStore")).role === "user" &&
    //     JSON.parse(localStorage.getItem("quizStore")).name == ""
    //   ) {
    //     navigate("/");
    //   } else if (
    //     JSON.parse(localStorage.getItem("quizStore")).role === "user" &&
    //     JSON.parse(localStorage.getItem("quizStore")).name !== ""
    //   ) {
    //     navigate("/user");
    //   } else if (
    //     JSON.parse(localStorage.getItem("quizStore")).role === "admin"
    //   ) {
    //     navigate("/admin");
    //   }
    // } else {
    //   navigate("/");
    // }
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      // console.log(" User Connected to server", socket.id);
    });

    socket.on("dataRec", (data) => {
      // console.log(data);

      setData(data);
      // timecount = data.timer;
      let time = data.timer;
      setscreenTimer(data.timer);
      clearInterval(timecount);
      timecount = setInterval(() => {
        if (time === 0) {
          setLoading(true);
          setStatus(null);
          clearInterval(timecount);
        } else {
          setscreenTimer((prev) => prev - 1);
          time = time - 1;
        }
      }, 1000); // 1000ms = 1s

      setLoading(false);
      setSelectedOption(null); // Reset selected option when new data is received
      setStatus(null);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  // const HandleDisplayText = () => {
  //   if(data.correctOption === selectedOption && (selectedOption !== null )){
  //     setStatus(true);
  //   }
  // console.log("status",status);
  // console.log(data.correctOption === selectedOption);
  // };

  const handleSetCorrectOptionUser = (submitId, correctOption, tile) => {
    setSelectedOption(submitId);
    // HandleDisplayText();
    // setStatus(false);
    if (correctOption == submitId) {
      setStatus(true);
      // console.log("correct");
    } else {
      setStatus(false);
      // console.log("wrong");
    }
    socket.emit("submitOption", { submitId, correctOption, tile });
    // console.log(submitId);
    // console.log(data.correctOption);
    // console.log(correctOption);
    // console.log(tile);
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Waiting For Question...
        </div>
      ) : (
        <Container
          maxWidth="xl"
          style={{ backgroundColor: "#f9ccff", height: "90vh" }}
        >
          <Stack
            direction={"col"}
            sx={{ justifyContent: "center", alignContent: "center" }}
          >
            <Box sx={{ width: "50%", height: "90vh" }}>
              <Typography
                variant="h3"
                component="div"
                gutterBottom
                style={{ textAlign: "center"}}
              >
                Time : {screentimer}
              </Typography>
              <form style={{ display: "flex", flexDirection: "column" }}>
                <TextField
                  value={data.question}
                  disabled
                  id="outlined-basic"
                  label="Question"
                  variant="outlined"
                  sx={{ width: "75%", marginX: "auto" }}
                />
                <FormControl sx={{ marginX: "auto" }}>
                  <FormLabel id="demo-radio-buttons-group-label">
                    Options
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={selectedOption}
                    name="radio-buttons-group"
                  >
                    {data.options.map((option, i) => (
                      <div key={i}>
                        <FormControlLabel
                          {...(selectedOption !== null
                            ? { disabled: true }
                            : {})}
                          value={option.id}
                          onChange={() =>
                            handleSetCorrectOptionUser(
                              option.id,
                              data.correctOption,
                              option.votes
                            )
                          }
                          control={<Radio />}
                        />
                        {/* <Box 
                          {...((data.correctOption === option.id && selectedOption !== null )? {style: {backgroundColor: "green"}} : {})} > */}
                        <TextField
                          disabled
                          // {...((data.correctOption === option.id && selectedOption !== null )? {sx:{bgcolor: "green"}}: {sx:{bgcolor: "red"}})}

                          value={option.optionText}
                        />
                        {/* </Box> */}
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              </form>
              {/* {status ==true ?<div>Correct</div>:<div>wrong</div>} */}
              {/* {status === null ? <div> </div> : status == true ? <div>Correct</div> : <div>Wrong</div>} */}
              {status != null &&
                (status ? (
                  <Box
                    sx={{
                      width: "50%",
                      marginX: "auto",
                      color: "green",
                      height: "10%",
                      textAlign: "center",
                      fontSize: 50,
                    }}
                  >
                    {" "}
                    Correct{" "}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      width: "50%",
                      marginX: "auto",
                      color: "red",
                      height: "10%",
                      textAlign: "center",
                      fontSize: 50,
                    }}
                  >
                    Wrong
                  </Box>
                ))}
            </Box>
          </Stack>
        </Container>
      )}
    </>
  );
};

export default User;
