app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{

    
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
        }).catch((err)=>{
            console.log(err);
        });    
    }
    
}]);