// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'pascalprecht.translate'])

.run(function($ionicPlatform, $state, $rootScope, $filter, $translate, StorageUtil, PopupUtil, ConstUtil, ApiUtil, ToastUtil) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.logout = function(){
    PopupUtil.showConfirm(
      $filter('translate')('notif_logout'), "", $filter('translate')('action_yes')
    ).then(function(ans){
      if(ans){
        StorageUtil.clearAppData();
        $translate.use('en');
        $state.go('login');
      }
    });
  };

  // current settings
  $rootScope.settings = {
    lang: ConstUtil.EnumLanguage.ENGLISH
  };

  // restore settings
  var savedSettings = StorageUtil.getSettings();
  if(savedSettings && savedSettings.lang){
      $rootScope.settings.lang = savedSettings.lang;
      $translate.use(savedSettings.lang);
  }

  // restore user
  var user = StorageUtil.getUser();
  if(user && user.uuid && user.token){
    ApiUtil.checkStatus().then(function(){
      $state.go('tab.tasks');
    }).catch(function(err){
      if(err === "down") ToastUtil.showShort($filter('translate')('notif_server_down'));
      else ToastUtil.showShort(err);
      $state.go('login');
    });
  }
  else {
    $state.go('login');
  }
})

.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider
    .otherwise("/login");

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    .state('login', {
      url: "/login",
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.tasks', {
    url: '/tasks',
    views: {
      'tab-tasks': {
        templateUrl: 'templates/tab-tasks.html',
        controller: 'TasksCtrl'
      }
    }
  })

  .state('tab.challenges', {
      url: '/challenges',
      views: {
        'tab-challenges': {
          templateUrl: 'templates/tab-challenges.html',
          controller: 'ChallengesCtrl'
        }
      }
    })
    .state('tab.challenge-detail', {
      url: '/challenges/:challengeId',
      views: {
        'tab-challenges': {
          templateUrl: 'templates/challenge-detail.html',
          controller: 'ChallengeDetailCtrl'
        }
      }
    })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

    .state('settings', {
      url: "/settings",
      templateUrl: "templates/settings.html",
      controller: 'SettingsCtrl'
    });

})

.config(function($ionicConfigProvider){
  //$ionicConfigProvider.tabs.position('bottom');
})

.config(function($translateProvider){
  var labels_en = {
    "app_name" : "Just Play",

    "settings": "Settings",
    "settings_lang": "Language",
    "settings_lang_en": "English",
    "settings_lang_fr": "Français",
    "settings_lang_cn": "中文（简体）",

    "login_username" : "Username",
    "login_password" : "Password",

    "tasks" : "My tasks",
    "task_habits": "Habits",
    "task_dailies": "Dailies",
    "task_todos": "To-Dos",

    "challenges" : "Challenges",
    "challenges_group": "Group",
    "challenges_leader": "Leader",
    "challenges_desc": "Description",
    "challenges_members": "Members",
    "challenges_tasks": "Tasks",
    "challenges_member_count": "pers.",
    "challenges_prize": "Prize",
    "challenges_joined": "Joined",

    "profile" : "Profile",
    "profile_level": "Level",
    "profile_class": "Class",
    "profile_health": "Health",
    "profile_exp": "Experience",
    "profile_mana": "Mana",

    "action_ok": "OK",
    "action_yes": "Yes",
    "action_cancel": "Cancel",

    "action_signin" : "Sign in",
    "action_logout" : "Log out",

    "action_join": "Join",
    "action_leave": "Leave",

    "notif_server_down": "The server is not responding",
    "notif_login_invalid": "Username or password invalid",
    "notif_logout": "Log out from Just Play?",
    "notif_sync" : "Synchronizing...",
    "notif_not_challenge_member": "You are not member of the challenge"
  };
  var labels_fr = {
    "app_name" : "Just Play",

    "settings": "Préférences",
    "settings_lang": "Langue",
    "settings_lang_en": "English",
    "settings_lang_fr": "Français",
    "settings_lang_cn": "中文（简体）",

    "login_username" : "Username",
    "login_password" : "Password",

    "tasks" : "Mes tâches",
    "task_habits": "Habitudes",
    "task_dailies": "Quotidiennes",
    "task_todos": "To-Dos",

    "challenges" : "Défis",
    "challenges_group": "Groupe",
    "challenges_leader": "Initiateur",
    "challenges_desc": "Description",
    "challenges_members": "Membres",
    "challenges_tasks": "Tâches",
    "challenges_member_count": "pers.",
    "challenges_prize": "Récompense",
    "challenges_joined": "Participé",

    "profile" : "Profil",
    "profile_level": "Niveau",
    "profile_class": "Classe",
    "profile_health": "Santé",
    "profile_exp": "Expérience",
    "profile_mana": "Mana",

    "action_ok": "OK",
    "action_yes": "Oui",
    "action_cancel": "Annuler",

    "action_signin" : "Sign in",
    "action_logout" : "Se déconnecter",

    "action_join": "Participer",
    "action_leave": "Quitter",

    "notif_server_down": "Le serveur ne répond pas",
    "notif_login_invalid": "Username or password invalid",
    "notif_logout": "Déconnectez-vous de Just Play ?",
    "notif_sync" : "Synchronisation ...",
    "notif_not_challenge_member": "Vous n'êtes pas membre du défi"
  };
  var labels_cn = {
    "app_name" : "Just Play",

    "settings": "设置",
    "settings_lang": "语言",
    "settings_lang_en": "English",
    "settings_lang_fr": "Français",
    "settings_lang_cn": "中文（简体）",

    "login_username" : "Username",
    "login_password" : "Password",

    "tasks" : "我的任务",
    "task_habits": "习惯",
    "task_dailies": "日常",
    "task_todos": "待办事项",

    "challenges" : "挑战",
    "challenges_group": "组群",
    "challenges_leader": "发起人",
    "challenges_desc": "描述",
    "challenges_members": "成员",
    "challenges_tasks": "任务",
    "challenges_member_count": "人",
    "challenges_prize": "奖励",
    "challenges_joined": "已加入",

    "profile" : "我",
    "profile_level": "等级",
    "profile_class": "身份",
    "profile_health": "健康值",
    "profile_exp": "经验值",
    "profile_mana": "Mana",

    "action_ok": "好的",
    "action_yes": "好的",
    "action_cancel": "取消",

    "action_signin" : "Sign in",
    "action_logout" : "退出登录",

    "action_join": "加入",
    "action_leave": "退出",

    "notif_server_down": "服务器无响应",
    "notif_login_invalid": "Username or password invalid",
    "notif_logout": "确定要退出 Just Play ?",
    "notif_sync" : "同步中 ...",
    "notif_not_challenge_member": "你还不是这个挑战的成员"
  };

  $translateProvider.translations('en', labels_en);
  $translateProvider.translations('fr', labels_fr);
  $translateProvider.translations('cn', labels_cn);
  $translateProvider.preferredLanguage('en');
})
;
