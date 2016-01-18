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
      if(appData.hasOwnProperty("user")){
        return appData.user;
      }
      return null;
    };

    return {
      clearAppData:clearAppData,
      saveUser:saveUser,
      getUser:getUser
    };
  })

.factory('LabelUtil', function($http, ConstUtil){
    var currentLanguage = ConstUtil.EnumLanguage.ENGLISH;
    var labels_en = {};
    var labels_fr = {};
    var labels_cn = {};

    $http.get('locales/en.json').then(function (response) {
      labels_en = response.data;
    });

    $http.get('locales/fr.json').then(function (response) {
      labels_fr = response.data;
    });

    $http.get('locales/cn.json').then(function (response) {
      labels_cn = response.data;
    });

    var getLabel = function (labelName) {
      switch (currentLanguage){
        case ConstUtil.EnumLanguage.ENGLISH :
          return labelName ? labels_en[labelName] : "";
        case ConstUtil.EnumLanguage.FRENCH :
          return labelName ? labels_fr[labelName] : "";
        case ConstUtil.EnumLanguage.CHINESE :
          return labelName ? labels_cn[labelName] : "";
        default :
          return labelName ? labels_en[labelName] : "";
      }
    };

    return {
      getLabel:getLabel
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

  .factory('PopupUtil', function($ionicPopup, $q, LabelUtil){
    var showAlert = function(title, body){
      var deferred = $q.defer();
      $ionicPopup.alert({
        title: title,
        template: body,
        okText: LabelUtil.getLabel("action_ok"),
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
        cancelText: LabelUtil.getLabel("action_cancel"),
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

  return {
    checkStatus: checkStatus,
    login: login,
    getTasks: getTasks,
    getUser: getUser,
    getChallenges: getChallenges,
    getChallenge: getChallenge
  };
});

