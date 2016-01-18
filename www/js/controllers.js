angular.module('starter.controllers', ['ionic', 'ngCordova'])

  .controller('LoginCtrl', function($scope, $state, StorageUtil, LabelUtil, ApiUtil, ToastUtil) {
    $scope.login = {};

    $scope.$on('$ionicView.enter', function(){
      $scope.login.password = "";
    });

    $scope.doLogin = function(){
      if($scope.login.username && $scope.login.password){
        ApiUtil.login($scope.login.username, $scope.login.password).then(function(){
          $state.go('tab.tasks');
        }).catch(function(err){
          ToastUtil.showShort(err);
        });
      }
      else{
        ToastUtil.showShort(LabelUtil.getLabel('notif_login_invalid'));
      }
    };

    var user = StorageUtil.getUser();
    if(user && user.uuid && user.token){
      $state.go('tab.tasks');
    }
  })

  .controller('TasksCtrl', function($scope, LabelUtil, ApiUtil, ToastUtil) {
    $scope.tasks = [{
      name: LabelUtil.getLabel('task_habits'),
      items: [],
      show: true
    },{
      name: LabelUtil.getLabel('task_dailies'),
      items: [],
      show: true
    },{
      name: LabelUtil.getLabel('task_todos'),
      items: [],
      show: true
    }];

    $scope.toggleTask = function(task) {
      task.show = !task.show;
    };
    $scope.isTaskShown = function(task) {
      return task.show;
    };

    $scope.sync = function(){
      $scope.synchronizing = true;
      ApiUtil.getTasks().then(function(tasks){
        $scope.tasks[0].items = [];
        $scope.tasks[1].items = [];
        $scope.tasks[2].items = [];
        for(var i = 0; i < tasks.length; i++){
          switch (tasks[i].type){
            case "habit":
              $scope.tasks[0].items.push(tasks[i]);
              break;
            case "daily":
              $scope.tasks[1].items.push(tasks[i]);
              break;
            case "todo":
              if(!tasks[i].completed) $scope.tasks[2].items.push(tasks[i]);
              break;
            default:
          }
        }
        $scope.synchronizing = false;
      }).catch(function(err){
        $scope.synchronizing = false;
        ToastUtil.showShort(err);
      });
    };

    $scope.$on('$ionicView.enter', function(){
      $scope.sync();
    });

  })

  .controller('ChallengesCtrl', function($scope, $state, ApiUtil, ToastUtil, LabelUtil) {
    $scope.challenges = [];

    $scope.sync = function(){
      $scope.synchronizing = true;
      ApiUtil.getChallenges().then(function(challenges){
        //console.log(challenges);
        $scope.challenges = challenges;
        $scope.synchronizing = false;
      }).catch(function(err){
        $scope.synchronizing = false;
        ToastUtil.showShort(err);
      });
    };

    $scope.$on('$ionicView.enter', function(){
      $scope.sync();
    });

    $scope.gotoChallenge = function(challenge){
      if(challenge._isMember){
        $state.go('tab.challenge-detail', {challengeId: challenge._id});
      }
      else{
        ToastUtil.showShort(LabelUtil.getLabel('notif_not_challenge_member'));
      }
    };
  })

  .controller('ChallengeDetailCtrl', function($scope, $stateParams, ApiUtil, ToastUtil) {
    $scope.challenge = {};

    $scope.sync = function(){
      $scope.synchronizing = true;
      ApiUtil.getChallenge($stateParams.challengeId).then(function(challenge){
        console.log(challenge);
        $scope.challenge = challenge;
        $scope.synchronizing = false;
      }).catch(function(err){
        $scope.synchronizing = false;
        ToastUtil.showShort(err);
      });
    };

    $scope.$on('$ionicView.enter', function(){
      $scope.sync();
    });
  })

  .controller('ProfileCtrl', function($scope, $state, ApiUtil, ToastUtil, PopupUtil, LabelUtil, StorageUtil) {
    $scope.profile = {};

    $scope.sync = function(){
      $scope.synchronizing = true;
      ApiUtil.getUser().then(function(user){
        var stats = user.stats;
        var auth = user.auth.local;
        var balance = user.balance;
        $scope.profile.username = auth.username;
        $scope.profile.email = auth.email;
        $scope.profile.level = stats.lvl;
        $scope.profile.class = stats.class;
        $scope.profile.gem = balance * 4;
        $scope.profile.gold = Math.floor(stats.gp);
        $scope.profile.silver = Math.floor((stats.gp - Math.floor(stats.gp)) * 100);
        $scope.profile.health = Math.floor(stats.hp);
        $scope.profile.healthMax = stats.maxHealth;
        $scope.profile.healthPercent = Math.floor($scope.profile.health / $scope.profile.healthMax * 100);
        $scope.profile.mana = Math.floor(stats.mp);
        $scope.profile.manaMax = stats.maxMP;
        $scope.profile.manaPercent = Math.floor($scope.profile.mana / $scope.profile.manaMax * 100);
        $scope.profile.exp = Math.floor(stats.exp);
        $scope.profile.expNextLevel = stats.toNextLevel;
        $scope.profile.expPercent = Math.floor($scope.profile.exp / $scope.profile.expNextLevel * 100);

        $scope.synchronizing = false;
      }).catch(function(err){
        $scope.synchronizing = false;
        ToastUtil.showShort(err);
      });
    };

    $scope.$on('$ionicView.enter', function(){
      $scope.sync();
    });

    $scope.logout = function(){
      PopupUtil.showConfirm(
        LabelUtil.getLabel('notif_logout'), "", LabelUtil.getLabel('action_logout')
      ).then(function(ans){
        if(ans){
          StorageUtil.clearAppData();
          $state.go('login');
        }
      });
    };
  });
