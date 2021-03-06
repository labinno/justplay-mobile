angular.module('starter.services', ['ionic','ngCordova'])

.factory('ConstUtil', function(){
    var EnumLanguage = {
      ENGLISH : "en",
      FRENCH : "fr",
      CHINESE : "cn"
    };

    var AppInfo = {
      name : "JustPlay"
    };

    return {
      EnumLanguage:EnumLanguage,
      AppInfo:AppInfo
    };
  })

.factory('StorageUtil', function(ConstUtil){

    var putAppData = function(appData){
      localStorage.setItem(ConstUtil.AppInfo.name, angular.toJson(appData));
    };

    var getAppData = function(){
      var appData = localStorage.getItem(ConstUtil.AppInfo.name);
      return angular.fromJson(appData);
    };

    var clearAppData = function(){
      localStorage.removeItem(ConstUtil.AppInfo.name);
    };

    var saveUser = function(uuid, token){
      var appData = getAppData();
      if(!appData){
        appData = {};
      }
      if(!appData.hasOwnProperty("user")){
        appData.user = {};
      }
      appData.user.uuid = uuid;
      appData.user.token = token;
      putAppData(appData);
    };

    var getUser = function(){
      var appData = getAppData();
      if(!appData){
        appData = {};
      }
      if(!appData.hasOwnProperty("user")){
        appData.user = {};
      }
      return appData.user;
    };

    var getSettings = function(){
      var appData = getAppData();
      if(!appData){
        appData = {};
      }
      if(!appData.hasOwnProperty("settings")){
        appData.settings = {};
      }
      return appData.settings;
    };

  var saveSettingsLang = function(lang){
    var appData = getAppData();
    if(!appData){
      appData = {};
    }
    if(!appData.hasOwnProperty("settings")){
      appData.settings = {};
    }
    if(lang) appData.settings.lang = lang;
    putAppData(appData);
  };

    return {
      clearAppData:clearAppData,
      saveUser:saveUser,
      getUser:getUser,
      getSettings: getSettings,
      saveSettingsLang: saveSettingsLang
    };
  })

  .factory('ToastUtil', function($cordovaToast, $q){
    var showShort = function(message){
      var deferred = $q.defer();
      $cordovaToast.showShortBottom(message).then(function(success){
        deferred.resolve(success);
      }, function(error){
        deferred.reject(error);
      });
      return deferred.promise;
    };

    var showLong = function(message){
      var deferred = $q.defer();
      $cordovaToast.showLongCenter(message).then(function(success){
        deferred.resolve(success);
      }, function(error){
        deferred.reject(error);
      });
      return deferred.promise;
    };

    return {
      showShort:showShort,
      showLong:showLong
    };
  })

  .factory('PopupUtil', function($ionicPopup, $q, $filter){
    var showAlert = function(title, body){
      var deferred = $q.defer();
      $ionicPopup.alert({
        title: title,
        template: body,
        okText: $filter('translate')("action_ok"),
        okType: 'button-royal'
      }).then(function(){
        deferred.resolve();
      }, function(){
        deferred.reject();
      });
      return deferred.promise;
    };

    var showConfirm = function(title, body, actionText){
      var deferred = $q.defer();
      $ionicPopup.confirm({
        title: title,
        template: body,
        cancelText: $filter('translate')("action_cancel"),
        cancelType: 'button-default',
        okText: actionText,
        okType: 'button-royal'
      }).then(function(ans){
        deferred.resolve(ans);
      }, function(){
        deferred.reject();
      });
      return deferred.promise;
    };

    return {
      showAlert:showAlert,
      showConfirm:showConfirm
    };
  })

.factory('ApiUtil', function($q, $http, StorageUtil){
  const ApiRoot = "http://justplay.demoscap.com:3000/api/v2";
  var userCache = StorageUtil.getUser();
  var auth = {
    uuid: userCache ? userCache.uuid : "",
    token: userCache ? userCache.token : ""
  };

  var checkStatus = function(){
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: ApiRoot + "/status"
    }).then(function(res){
      var data = res.data;
      if(data.status === 'up'){
        deferred.resolve();
      }
      else {
        deferred.reject(data.status);
      }
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  var login = function(username, password){
    var deferred = $q.defer();
    $http({
        method: 'POST',
        url: ApiRoot + "/user/auth/local",
        data: {
          username: username,
          password: password
        }
    })
    .then(function(res) {
      var data = res.data;
      StorageUtil.saveUser(data.id, data.token);
      auth.uuid = data.id;
      auth.token = data.token;
      deferred.resolve();
    }, function(error){
      deferred.reject(error);
    });
    return deferred.promise;
  };

  var getTasks = function(){
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: ApiRoot + "/user/tasks",
      headers: {
        'x-api-user': auth.uuid,
        'x-api-key': auth.token
      }
    }).then(function(res){
      var data = res.data;
      deferred.resolve(data);
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  var getUser = function(){
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: ApiRoot + "/user",
      headers: {
        'x-api-user': auth.uuid,
        'x-api-key': auth.token
      }
    }).then(function(res){
      var data = res.data;
      deferred.resolve(data);
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  var getChallenges = function(){
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: ApiRoot + "/challenges",
      headers: {
        'x-api-user': auth.uuid,
        'x-api-key': auth.token
      }
    }).then(function(res){
      var data = res.data;
      deferred.resolve(data);
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  var getChallenge = function(id){
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: ApiRoot + "/challenges/" + id,
      headers: {
        'x-api-user': auth.uuid,
        'x-api-key': auth.token
      }
    }).then(function(res){
      var data = res.data;
      deferred.resolve(data);
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  var joinChallenge = function(id){
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: ApiRoot + "/challenges/" + id + "/join",
      headers: {
        'x-api-user': auth.uuid,
        'x-api-key': auth.token
      }
    }).then(function(res){
      var data = res.data;
      deferred.resolve(data);
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  var leaveChallenge = function(id){
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: ApiRoot + "/challenges/" + id + "/leave",
      headers: {
        'x-api-user': auth.uuid,
        'x-api-key': auth.token
      }
    }).then(function(res){
      var data = res.data;
      deferred.resolve(data);
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  var createTask = function(task){
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: ApiRoot + "/user/tasks",
      headers: {
        'Content-Type': "application/json",
        'x-api-user': auth.uuid,
        'x-api-key': auth.token
      },
      data: task
    }).then(function(res){
      var data = res.data;
      deferred.resolve(data);
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  var scoreTask = function(id, dir){
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: ApiRoot + "/user/tasks/" + id + "/" + dir,
      headers: {
        'Content-Type': "application/json",
        'x-api-user': auth.uuid,
        'x-api-key': auth.token
      }
    }).then(function(res){
      var data = res.data;
      deferred.resolve(data);
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  var updateTask = function(id, task){
    var deferred = $q.defer();
    $http({
      method: 'PUT',
      url: ApiRoot + "/user/tasks/" + id,
      headers: {
        'Content-Type': "application/json",
        'x-api-user': auth.uuid,
        'x-api-key': auth.token
      },
      data: task
    }).then(function(res){
      var data = res.data;
      deferred.resolve(data);
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  var getTask = function(id){
    var deferred = $q.defer();
    $http({
      method: 'GET',
      url: ApiRoot + "/user/tasks/" + id,
      headers: {
        'x-api-user': auth.uuid,
        'x-api-key': auth.token
      }
    }).then(function(res){
      var data = res.data;
      deferred.resolve(data);
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  var deleteTask = function(id){
    var deferred = $q.defer();
    $http({
      method: 'DELETE',
      url: ApiRoot + "/user/tasks/" + id,
      headers: {
        'x-api-user': auth.uuid,
        'x-api-key': auth.token
      }
    }).then(function(res){
      var data = res.data;
      deferred.resolve(data);
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };

  return {
    checkStatus: checkStatus,
    login: login,
    getTasks: getTasks,
    getUser: getUser,
    getChallenges: getChallenges,
    getChallenge: getChallenge,
    joinChallenge: joinChallenge,
    leaveChallenge: leaveChallenge,
    createTask: createTask,
    getTask: getTask,
    updateTask: updateTask,
    scoreTask: scoreTask,
    deleteTask: deleteTask
  };
});

