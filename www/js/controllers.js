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

  .controller('TasksCtrl', function($cordovaDatePicker, $ionicModal, $scope, $filter, ApiUtil, ToastUtil) {
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
              console.log(tasks[i]);
              $scope.tasks.habits.items.push(tasks[i]);
              break;
            case "daily":
              console.log(tasks[i]);
              $scope.tasks.dailies.items.push(tasks[i]);
              break;
            case "todo":
              if(!tasks[i].completed) {
                console.log(tasks[i]);
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

    $scope.createNewHabit = function(){
      $scope.newHabit.dateCreated = Date.now;
      $scope.newHabit.tags = {};
      $scope.newHabit.value = 0;
      $scope.newHabit.attribute = "str";
      $scope.newHabit.type = "habit";

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

    $scope.createNewDaily = function(){
      $scope.newDaily.dateCreated = Date.now;
      $scope.newDaily.tags = {};
      $scope.newDaily.value = 0;
      $scope.newDaily.attribute = "str";
      $scope.newDaily.type = "daily";
      $scope.newDaily.completed = false;
      $scope.newDaily.streak = 0;

      if(!$scope.newDaily.text || $scope.newDaily.text.trim() === ""){
        ToastUtil.showLong($filter('translate')('notif_task_new_title_invalid'));
      }
      else {
        ApiUtil.createTask($scope.newDaily).then(function(){
          ToastUtil.showShort($filter('translate')('notif_task_created'));
          $scope.closeNewDaily();
          $scope.sync();
        });
      }
    };

    $scope.createNewTodo = function(){
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
    $ionicModal.fromTemplateUrl('tasks-newDaily.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.newDailyModal = modal;
    });
    $ionicModal.fromTemplateUrl('tasks-newTodo.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.newTodoModal = modal;
    });
    $scope.$on('$destroy', function() {
      $scope.newHabitModal.remove();
      $scope.newDailyModal.remove();
      $scope.newTodoModal.remove();
    });

    var resetNewHabit = function(){
      $scope.newHabit = {
        up: true,
        down: true,
        priority: 1
      };
    };
    var resetNewDaily = function(){
      $scope.newDaily = {
        startDate: new Date(),
        priority : 1,
        frequency: "weekly",
        everyX: 1,
        repeat: {
          m:  true,
          t:  true,
          w:  true,
          th: true,
          f:  true,
          s:  true,
          su: true
        }
      };
      $scope.incrEveryX = function(){$scope.newDaily.everyX++;};
      $scope.decrEveryX = function(){if($scope.newDaily.everyX > 1) $scope.newDaily.everyX--;};
      $scope.getEveryXUnit = function(){return $scope.newDaily.everyX > 1 ? $filter('translate')('task_new_everyx_units') : $filter('translate')('task_new_everyx_unit')};
      $scope.chooseStartDate = function(){
        var options = {
          date: $scope.newDaily.startDate,
          mode: 'date',
          minDate: new Date(),
          allowOldDates: false,
          allowFutureDates: true,
          doneButtonLabel: $filter('translate')('action_done'),
          doneButtonColor: '#66c6e7',
          cancelButtonLabel: $filter('translate')('action_cancel'),
          cancelButtonColor: '#000000'
        };
        $cordovaDatePicker.show(options).then(function(date){
          $scope.newDaily.startDate = date;
        });
      };
    };
    var resetNewTodo = function(){
      $scope.newTodo = {
        priority: 1
      };
    };

    resetNewHabit();
    resetNewDaily();
    resetNewTodo();

    $scope.gotoNewHabit = function(){
      resetNewHabit();
      $scope.newHabitModal.show();
    };
    $scope.gotoNewDaily = function(){
      resetNewDaily();
      $scope.newDailyModal.show();
    };
    $scope.gotoNewTodo = function(){
      resetNewTodo();
      $scope.newTodoModal.show();
    };

    $scope.closeNewHabit = function(){
      $scope.newHabitModal.hide();
    };
    $scope.closeNewDaily = function(){
      $scope.newDailyModal.hide();
    };
    $scope.closeNewTodo = function(){
      $scope.newTodoModal.hide();
    };
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
