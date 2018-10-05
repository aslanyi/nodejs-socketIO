const socketio = require('socket.io');
const io = socketio();

const socketApi = { };
const users ={ };
socketApi.io = io;

const randomColor = require('../helpers/randomColors');

io.on('connection',(socket)=>{
    console.log('user connected');
    socket.on('newUser',(data)=>{
       const defaultData={
        id : socket.id,
        position:{
            x:0,
            y:0
        },
        color : randomColor()
       };
       const userData = Object.assign(data,defaultData);
       users[socket.id]=(userData);
       socket.broadcast.emit('newUser', users[socket.id]);
       socket.emit('initPlayers',users);
    });
    socket.on('animate',(data)=>{
        users[socket.id].position.x=data.x;
        users[socket.id].position.y=data.y;

        socket.broadcast.emit('animate',{socketId:socket.id,x:data.x,y:data.y});
    });
    socket.on('disconnect',()=>{
        socket.broadcast.emit('userDisconnected',users[socket.id]);
        delete users[socket.id];
    });
});

module.exports = socketApi;