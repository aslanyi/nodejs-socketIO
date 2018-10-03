app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{

    $scope.messages=[  ];
    
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
        }).catch((err)=>{
            console.log(err);
        });    
    }
    
}]);