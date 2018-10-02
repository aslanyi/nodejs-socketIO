app.controller('indexController',['$scope','indexFactory',($scope)=>{
    const connectOptions = {
        reconnectAttempts :3 ,
        reconnectionDelay :600
    };
    const url  = 'http://localhost:3000'
    const socket = indexFactory.connectSocket(url,connectOptions);
}]);