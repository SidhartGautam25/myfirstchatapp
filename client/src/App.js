import "./App.css";
import io from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io.connect("http://localhost:8000");

function App() {
  const [room, setRoom] = useState("");

  const [message, setMessage] = useState("");
  const [totalms,setTotalms]=useState([]);
  const [name,setName]=useState("");
  const [allrooms,setAllrooms]=useState([]);
  
  
  const [allfriend,setAllfriend]=useState([]);

  const joinRoomN=(data)=>{
       if(data !== ""){
        console.log("new room==NNNNNNN> ",data);
        socket.emit("join_room",data,name);

       }
  }
  

  const sendMessage = () => {
    
       setTotalms([...totalms,{
      "sender":name,
      "msg":message,
      "room":room
    }]);
    console.log("total message ==> ",totalms);
    socket.emit("send_message", { message, room,name });
    
    
  };
  
  function roomChange(data){
    
        console.log("yha jao=> ",data);
        setRoom(data);
        joinRoomN(data);
        
  }
  
  
  useEffect(() => {

    socket.on("receive_message", (data) => {
      console.log("recieved msg=> ",data);
      setTotalms([...totalms,{
        "sender":data.name,
        "msg":data.message,
        "room":data.room
      }]);
      
    });
    socket.on("all-room",(data)=>{
      console.log("newroom event listend,data==> ",data);
      setAllrooms(data);
      console.log("rooms=> ",allrooms);
    });
    socket.on("newuser",(data)=>{
      console.log("newuser event listened,data=> ",data);
      setAllfriend([...allfriend,{
        "name":data.name,
        "id":data.socketid
      }]);
      console.log(allfriend);
    })
    return ()=>{
      socket.off("receive_message");
      socket.off("all-room");
      socket.off("newuser");
    }
  }, [totalms,allfriend,allrooms,message,name,room]);
  return (
    <div className="App">
      <div className="mainbox">
           <div className="groupbox">
                <div className="groupheading">Your Details</div>
                <div>
                  <input
                      className="roomdetail"
                      placeholder="Room Number..."
                      onChange={(event) => {
                      setRoom(event.target.value);
                      }}
                  />
                </div>
                <div>
                  <input
                    className="namedetail"
                    placeholder="your name please"
                    onChange={(event) => {
                    setName(event.target.value);
                    }}
                  />
                </div>
                <button className="submitbutton" onClick={()=>{
                    if (room !== "") {
                        console.log("new room joined name=> ",name);
                        console.log("present room==> ",room);
                        socket.emit("join_room",room,name);
                        console.log("rooms=>>> ",room);
                    }
                 }}>submit choices</button>

             
           </div>
      <div className="chatbox">
        <div className="chatboxheader">
          Room : {room}
        </div>
      
        <div className="chatboxbody">
          {totalms?.map((p)=> 
            p.sender===name?(p.room===room&&<div className="msgsmallleft">{p.sender} : {p.msg}</div>):(p.room===room&&
            <div className="msgsmallright">{p.sender} : {p.msg}</div>
          ))
          }
        </div>
        <div className="msgsentbox">
          <input className="msginput"
            placeholder="Message..."
            onChange={(event) => {
            setMessage(event.target.value);
            }}
          />
          <button className="msgbutton" onClick={sendMessage}> Send </button>
        </div>
      
      
      </div>
      <div className="groupbox">
              <div className="groupheading">Avaliable Groups</div>
              <div className="groupbody">
              {allrooms?.map((p)=><div className="roomsname" onClick={()=>{roomChange(p)}}>{p}</div>)}
              </div>
             
           </div>
      </div>
      
      
    </div>
  );
}

export default App;
