app.controller('indexController',['$scope','indexFactory',($scope,indexFactory)=>{
    const connectOptions = {
        reconnectAttempts :3 ,
        reconnectionDelay :600
    };
    const url  = 'http://localhost:3000';
    indexFactory.connectSocket(url,connectOptions).then((socket)=>{
        console.log('Bağlantı gerçekleşti',socket);
    }).catch((err)=>{
        console.log(err);
    })
}]);