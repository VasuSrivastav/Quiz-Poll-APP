import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
// import { io } from "socket.io-client";
import { Button, Container, Input, Stack, TextField, Typography } from "@mui/material";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import User from "./components/User";
import Admin from "./components/Admin";


// import { purple } from "@mui/material/colors";

// admin pg

const App = () => {
  // const socket = useMemo(() => io("http://localhost:5001"), []);

  const [secret, setSecret] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [message, setMessage] = useState([]);
  const [roomName, setRoomName] = useState("");



  // const handleJoinRoom = (e) => {
  //   e.preventDefault();
  //   socket.emit("join-room",roomName );
  //   setRoomName("");
  // }



  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // const message = e.target.elements.message.value;
  //   // console.log(message);
  //   socket.emit("message",{ secret, room});
  //   setSecret("");
  //   // setRoom("");
  // };  

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     setSocketId(socket.id);
  //     console.log("Connected to server", socket.id);
  //   });

  //   // socket.on("welcome", (message) => {
  //   //   console.log(message);
  //   // } );
  //   socket.on("rec-message", (data) => {
  //     console.log(data);
  //     setMessage((prev) => [...prev, data]);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  return (
    <>
 {/* <Container maxWidth="xl" style={{backgroundColor: "purple", height:"100vh"}}  >
     <Box sx={{ height: 400}}  />  */}
     {/* <Typography variant="h1" component="div" gutterBottom style={{backgroundColor: "purple"}}>
Welcome to Socket.io Admin Page
    </Typography>
    <Typography variant="h2" component="div" gutterBottom>
      {socketId}
    </Typography>
    <form onSubmit={handleJoinRoom}>
      <TextField value={roomName} onChange={(e)=>{setRoomName(e.target.value)}} id="outlined-basic" label="roomName" variant="outlined" />

      <Button variant="contained" color="primary" type="submit" >Join</Button>
    </form>
    <form onSubmit={handleSubmit}>
      <TextField value={secret} onChange={(e)=>{setSecret(e.target.value)}} id="outlined-basic" label="Message" variant="outlined" />
      <TextField value={room} onChange={(e)=>{setRoom(e.target.value)}} id="outlined-basic" label="room" variant="outlined" />

      <Button variant="contained" color="primary" type="submit" >send</Button>
    </form>
    <Stack>
      {message.map((msg, index) => (
        <Typography key={index} variant="h5" component="div" gutterBottom>
          {msg}
        </Typography>
      ))}

      </Stack> 
   </Container> */}
   <BrowserRouter>
      <Routes >
        <Route path='/' element={<><NavBar /><Home /></>} />
        <Route path='/user' element={<><NavBar isLogin={true} /><User /></>} />
        <Route path='/admin' element={<><NavBar isLogin={true} /> <Admin /></>} />
      </Routes>
    </BrowserRouter>
  </>
);
};

export default App;
