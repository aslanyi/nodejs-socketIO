app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{

    $scope.messages=[  ];
    $scope.player = {};
    $scope.init=()=>{
        const userName = prompt('Please enter username');
        if(userName){
          initSocket(userName);  
        }
        else{
            return false;
        }
    };

    function initSocket(userName) {
        const connectOptions = {
            reconnectAttempts :3 ,
            reconnectionDelay :600
        };
        const url  = 'http://localhost:3000';
        indexFactory.connectSocket(url,connectOptions).then((socket)=>{
            socket.on('initPlayers',(players)=>{
                $scope.player = players;
                $scope.$apply();
                console.log(players);
                        });
            socket.emit('newUser',{userName});
            socket.on('newUser',(data)=>{
                const messageData = {
                    type:{
                        code:0,
                        message:1
                    },
                    username:data.userName
                };
                $scope.messages.push(messageData);
                $scope.player[data.id]=data;
                $scope.$apply();
                
            });

            socket.on('userDisconnected',(data)=>{
                const messageData = {
                    type:{
                        code:0,
                        message:0
                    },
                    username:data.userName
                };
                $scope.messages.push(messageData);
                $scope.$apply();
            });
            socket.on('animate',(data)=>{
                $('#'+data.socketId).animate({'left':data.x ,'top':data.y},()=>{
                    animate=false;
                });
            });
            let animate = false;
            $scope.onClickPlayer =($event)=>{
                console.log(`${$event.offsetX} ${$event.offsetY}`);
                if(!animate)
                {
                    let x = $event.offsetX;
                    let y = $event.offsetY;
                    socket.emit('animate',{x,y});
                    animate=true;
                    $('#'+socket.id).animate({'left':x ,'top':y},()=>{
                        animate=false;
                    });
                }
                
            };
            $scope.sendMessages = ()=>{
                let message = $scope.msg;
                const messageData = {
                    type:{
                        code:1
                    },
                    username:userName,
                    text : message
                };
                $scope.messages.push(messageData);
                $scope.msg=' ';
                $scope.$apply();
                
            };
        }).catch((err)=>{
            console.log(err);
        });    
    }
    
}]);