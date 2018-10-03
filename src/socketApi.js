const socketio = require('socket.io');
const io = socketio();

const socketApi = { };
const users = [ ];
socketApi.io = io;

io.on('connection',(socket)=>{
    console.log('user connected');

    socket.on('newUser',(data)=>{
       const defaultData={
        id : socket.id,
        position:{
            x:0,
            y:0
        }
       };
       const userData = Object.assign(data,defaultData);
       users.push(userData);
       console.log(users);
    });
});

module.exports = socketApi;