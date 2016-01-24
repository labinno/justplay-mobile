angular.module('starter.controllers', ['ionic', 'ngCordova'])

  .controller('LoginCtrl', function($ionicHistory, $scope, $state, StorageUtil, $filter, ApiUtil, ToastUtil) {
    $scope.login = {};

    $scope.$on('$ionicView.enter', function(){
      $scope.login.password = "";
    });

    var gotoApp = function(){
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.go('tab.tasks');
    };

    $scope.doLogin = function(){
      if($scope.login.username && $scope.login.password){
        ApiUtil.login($scope.login.username, $scope.login.password).then(function(){
          gotoApp();
        }).catch(function(err){
          ToastUtil.showShort(err);
        });
      }
      else{
        ToastUtil.showShort($filter('translate')('notif_login_invalid'));
      }
    };

    var user = StorageUtil.getUser();
    if(user && user.uuid && user.token){
      gotoApp();
    }
  })

  .controller('TasksCtrl', function($ionicModal, $scope, $filter, ApiUtil, ToastUtil) {
    $scope.tasks = {
      habits: {
        items: [],
        show: true
      },
      dailies: {
        items: [],
        show: true
      },
      todos: {
        items: [],
        show: true
      }
    };

    $scope.toggleTask = function(task) {
      task.show = !task.show;
    };
    $scope.isTaskShown = function(task) {
      return task.show;
    };

    $scope.sync = function(){
      $scope.synchronizing = true;
      ApiUtil.getTasks().then(function(tasks){
        $scope.tasks.habits.items = [];
        $scope.tasks.dailies.items = [];
        $scope.tasks.todos.items = [];
        for(var i = 0; i < tasks.length; i++){
          switch (tasks[i].type){
            case "habit":
              $scope.tasks.habits.items.push(tasks[i]);
              break;
            case "daily":
              $scope.tasks.dailies.items.push(tasks[i]);
              break;
            case "todo":
              if(!tasks[i].completed) {
                //console.log(tasks[i]);
                $scope.tasks.todos.items.push(tasks[i]);
              }
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

    $scope.scoreTask = function(task, dir){
      ApiUtil.scoreTask(task.id, dir).then(function(){
        if(dir === "up"){
          ToastUtil.showShort($filter('translate')('notif_task_up'));
        }
        else if(dir === "down"){
          ToastUtil.showShort($filter('translate')('notif_task_down'));
        }
        $scope.sync();
      });
    };

    $scope.newHabit = {};
    $scope.createNewHabit = function(){
      $scope.newHabit.priority = 1;
      $scope.newHabit.dateCreated = Date.now;
      $scope.newHabit.tags = {};
      $scope.newHabit.value = 0;
      $scope.newHabit.attribute = "str";
      $scope.newHabit.type = "habit";

      if(!$scope.newHabit.up) $scope.newHabit.up = false;
      if(!$scope.newHabit.down) $scope.newHabit.down = false;

      if(!$scope.newHabit.text || $scope.newHabit.text.trim() === ""){
        ToastUtil.showLong($filter('translate')('notif_task_new_title_invalid'));
      }
      else if(!$scope.newHabit.up && !$scope.newHabit.down){
        ToastUtil.showLong($filter('translate')('notif_task_new_direction_invalid'));
      }
      else {
        ApiUtil.createTask($scope.newHabit).then(function(){
          ToastUtil.showShort($filter('translate')('notif_task_created'));
          $scope.closeNewHabit();
          $scope.sync();
        });
      }
    };
    $scope.newDaily = {};
    $scope.createNewDaily = function(){
      $scope.closeNewDaily();
      $scope.sync();
    };
    $scope.newTodo = {};
    $scope.createNewTodo = function(){
      $scope.newTodo.priority = 1;
      $scope.newTodo.dateCreated = Date.now;
      $scope.newTodo.tags = {};
      $scope.newTodo.value = 0;
      $scope.newTodo.attribute = "str";
      $scope.newTodo.type = "todo";
      $scope.newTodo.completed = false;

      if(!$scope.newTodo.text || $scope.newTodo.text.trim() === ""){
        ToastUtil.showLong($filter('translate')('notif_task_new_title_invalid'));
      }
      else {
        ApiUtil.createTask($scope.newTodo).then(function(){
          ToastUtil.showShort($filter('translate')('notif_task_created'));
          $scope.closeNewTodo();
          $scope.sync();
        });
      }
    };

    $ionicModal.fromTemplateUrl('tasks-newHabit.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.newHabitModal = modal;
    });

    $scope.gotoNewHabit = function(){
      $scope.newHabit = {};
      $scope.newHabitModal.show();
    };

    $scope.closeNewHabit = function(){
      $scope.newHabitModal.hide();
      $scope.newHabit = {};
    };

    $ionicModal.fromTemplateUrl('tasks-newDaily.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.newDailyModal = modal;
    });

    $scope.gotoNewDaily = function(){
      $scope.newDaily = {};
      $scope.newDailyModal.show();
    };

    $scope.closeNewDaily = function(){
      $scope.newDailyModal.hide();
      $scope.newDaily = {};
    };

    $ionicModal.fromTemplateUrl('tasks-newTodo.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.newTodoModal = modal;
    });

    $scope.gotoNewTodo = function(){
      $scope.newTodo = {};
      $scope.newTodoModal.show();
    };

    $scope.closeNewTodo = function(){
      $scope.newTodoModal.hide();
      $scope.newTodo = {};
    };

    $scope.$on('$destroy', function() {
      $scope.newHabitModal.remove();
      $scope.newDailyModal.remove();
      $scope.newTodoModal.remove();
    });
  })

  .controller('ChallengesCtrl', function($scope, $state, ApiUtil, ToastUtil, $filter) {
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
        ToastUtil.showShort($filter('translate')('notif_not_challenge_member'));
      }
    };

    $scope.joinChallenge = function(challenge){
      var id = challenge._id;
      ApiUtil.joinChallenge(id).then(function(){
        ToastUtil.showShort($filter('translate')('notif_joined'));
        $scope.sync();
      }).catch(function(err){
        ToastUtil.showShort(err);
      });
    };
  })

  .controller('ChallengeDetailCtrl', function($ionicModal, $scope, $state, $stateParams, $filter, ApiUtil, ToastUtil, PopupUtil) {
    $scope.challenge = {};

    $scope.sync = function(){
      $scope.synchronizing = true;
      ApiUtil.getChallenge($stateParams.challengeId).then(function(challenge){
        //console.log(challenge);
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

    $ionicModal.fromTemplateUrl('challenge-tasks.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.tasksModal = modal;
    });

    $ionicModal.fromTemplateUrl('challenge-members.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.membersModal = modal;
    });

    $scope.gotoChallengeTasks = function(){
      $scope.tasksModal.show();
    };

    $scope.closeChallengeTasks = function(){
      $scope.tasksModal.hide();
    };

    $scope.gotoChallengeMembers = function(){
      $scope.membersModal.show();
    };

    $scope.closeChallengeMembers = function(){
      $scope.membersModal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.tasksModal.remove();
      $scope.membersModal.remove();
    });

    $scope.leaveChallenge = function(){
      PopupUtil.showConfirm(
        $filter('translate')('notif_leave'), "",
        $filter('translate')('action_yes')
      ).then(function(ans){
        if(ans){
          var id = $scope.challenge._id;
          ApiUtil.leaveChallenge(id).then(function(){
            for(var i = 0; i < $scope.challenge.habits.length; i++){
              ApiUtil.deleteTask($scope.challenge.habits[i].id);
            }
            for(var j = 0; j < $scope.challenge.dailys.length; j++){
              ApiUtil.deleteTask($scope.challenge.dailys[j].id);
            }
            for(var k = 0; k < $scope.challenge.todos.length; k++){
              ApiUtil.deleteTask($scope.challenge.todos[k].id);
            }
            for(var l = 0; l < $scope.challenge.rewards.length; l++){
              ApiUtil.deleteTask($scope.challenge.rewards[l].id);
            }
            $state.go('tab.challenges');
          }).catch(function(err){
            ToastUtil.showShort(err);
          });
        }
      });
    };

    $scope.scoreTask = function(task, dir){
      ApiUtil.scoreTask(task.id, dir).then(function(){
        if(dir === "up"){
          ToastUtil.showShort($filter('translate')('notif_task_up'));
        }
        else if(dir === "down"){
          ToastUtil.showShort($filter('translate')('notif_task_down'));
        }
        $scope.sync();
      });
    };
  })

  .controller('ProfileCtrl', function($scope, $state, ApiUtil, ToastUtil) {
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

    $scope.gotoSettings = function(){
      $state.go('settings');
    };
  })

  .controller('SettingsCtrl', function($ionicModal, $ionicNavBarDelegate, $state, $scope, $translate, ConstUtil, $filter, StorageUtil){
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

    $scope.langs = [{
      name: ConstUtil.EnumLanguage.ENGLISH,
      label: $filter('translate')('settings_lang_en')
    },{
      name: ConstUtil.EnumLanguage.FRENCH,
      label: $filter('translate')('settings_lang_fr')
    },{
      name: ConstUtil.EnumLanguage.CHINESE,
      label: $filter('translate')('settings_lang_cn')
    }];

    $ionicModal.fromTemplateUrl('settings-lang.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.langModal = modal;
    });

    $scope.gotoSettingsLang = function(){
      $scope.langModal.show();
    };

    $scope.closeSettingsLang = function(){
      $scope.langModal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.langModal.remove();
    });

    $scope.changeLang = function (langKey) {
      $translate.use(langKey);
      StorageUtil.saveSettingsLang(langKey);
    };
  });
