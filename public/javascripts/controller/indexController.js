app.controller('indexController',['$scope','indexFactory','configFactory',($scope,indexFactory,configFactory)=>{

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
    function scrollTop() {
        setTimeout(()=>{
            const chatElement = document.getElementById('chat-area');
            chatElement.scrollTop = chatElement.scrollHeight;
            });
      }
      
    function bubble(id,data){
        $('#'+id).find('.message').show().html(data);
        setTimeout(()=>{
            $('#'+id).find('.message').hide('slow');
        },2000)
    };

   async function initSocket(userName) {
        const connectOptions = {
            reconnectAttempts :3 ,
            reconnectionDelay :600
        };
        try {
            const url = await configFactory.getConfig();
            const socket = await indexFactory.connectSocket(url.data.socketUrl,connectOptions);
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
                scrollTop();
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
                scrollTop();
                $scope.$apply();
            });
            socket.on('animate',(data)=>{
                $('#'+data.socketId).animate({'left':data.x ,'top':data.y},()=>{
                    animate=false;
                });
            });
            socket.on('newMessage',(data) =>{
                $scope.messages.push(data);
                $scope.$apply();
                bubble(data.socketId,data.text);
                
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
                let message = $scope.message;
                const messageData = {
                    type:{
                        code:1
                    },
                    username:userName,
                    text : message
                };
                socket.emit('newMessage',messageData);
                $scope.messages.push(messageData);
                $scope.message=' ';
                bubble(socket.id,message);
                scrollTop();
                
            }; 
        } catch (error) {
          console.log(error);      
        }
       
            
    }
    
}]);