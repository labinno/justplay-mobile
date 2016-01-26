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
    "task_habits_create": "Create a habit",
    "task_dailies": "Dailies",
    "task_dailies_create": "Create a daily",
    "task_todos": "To-Dos",
    "task_todos_create": "Create a to-do",
    "task_new_title": "Title",
    "task_new_notes": "Notes",
    "task_new_up": "Positive direction",
    "task_new_down": "Negative direction",
    "task_new_startdate": "Start date",
    "task_new_difficulty": "Difficulty",
    "task_new_difficulty_trivial": "Trivial",
    "task_new_difficulty_easy": "Easy",
    "task_new_difficulty_medium": "Medium",
    "task_new_difficulty_hard": "Hard",
    "task_new_frequency": "Frequency",
    "task_new_frequency_daily": "Daily",
    "task_new_frequency_weekly": "Weekly",
    "task_new_everyx": "Every",
    "task_new_everyx_unit": "day",
    "task_new_everyx_units": "days",
    "task_new_repeat": "Repeat",
    "task_new_repeat_m": "Every Monday",
    "task_new_repeat_t": "Every Tuesday",
    "task_new_repeat_w": "Every Wednesday",
    "task_new_repeat_th": "Every Thursday",
    "task_new_repeat_f": "Every Friday",
    "task_new_repeat_s": "Every Saturday",
    "task_new_repeat_su": "Every Sunday",

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
    "action_done": "Done",
    "action_save": "Save",

    "action_signin" : "Sign in",
    "action_logout" : "Log out",

    "action_join": "Join",
    "action_leave": "Leave",

    "notif_server_down": "The server is not responding",
    "notif_login_invalid": "Username or password invalid",
    "notif_logout": "Log out from Just Play?",
    "notif_sync" : "Synchronizing...",
    "notif_not_challenge_member": "You are not member of the challenge",
    "notif_joined": "Challenge joined",
    "notif_task_up": "Bravo!",
    "notif_task_down": "Never again!",
    "notif_task_created": "Task created",
    "notif_task_new_title_invalid": "Title must not be empty",
    "notif_task_new_direction_invalid": "At least one direction should be selected",
    "notif_leave": "Are you sure to leave this challenge?"
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
    "task_habits_create": "Créer une habitude",
    "task_dailies": "Quotidiennes",
    "task_dailies_create": "Créer une quotidienne",
    "task_todos": "To-Dos",
    "task_todos_create": "Créer une to-do",
    "task_new_title": "Titre",
    "task_new_notes": "Notes",
    "task_new_up": "Direction positive",
    "task_new_down": "Direction négative",
    "task_new_startdate": "Date de démarrage",
    "task_new_difficulty": "Difficulté",
    "task_new_difficulty_trivial": "Trivial",
    "task_new_difficulty_easy": "Facile",
    "task_new_difficulty_medium": "Moyen",
    "task_new_difficulty_hard": "Difficile",
    "task_new_frequency": "Fréquence",
    "task_new_frequency_daily": "Quotidiennement",
    "task_new_frequency_weekly": "Hebdomadairement",
    "task_new_everyx": "Tous les",
    "task_new_everyx_unit": "jour",
    "task_new_everyx_units": "jours",
    "task_new_repeat": "Répétition",
    "task_new_repeat_m": "Le lundi",
    "task_new_repeat_t": "Le mardi",
    "task_new_repeat_w": "Le mercredi",
    "task_new_repeat_th": "Le jeudi",
    "task_new_repeat_f": "Le vendredi",
    "task_new_repeat_s": "Le samedi",
    "task_new_repeat_su": "Le dimanche",

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
    "action_done": "Fait",
    "action_save": "Enregistrer",

    "action_signin" : "Sign in",
    "action_logout" : "Se déconnecter",

    "action_join": "Participer",
    "action_leave": "Quitter",

    "notif_server_down": "Le serveur ne répond pas",
    "notif_login_invalid": "Username or password invalid",
    "notif_logout": "Déconnectez-vous de Just Play ?",
    "notif_sync" : "Synchronisation ...",
    "notif_not_challenge_member": "Vous n'êtes pas membre du défi",
    "notif_joined": "Participé au défi",
    "notif_task_up": "Bravo !",
    "notif_task_down": "Ne plus jamais !",
    "notif_task_created": "Tâche créée",
    "notif_task_new_title_invalid": "Titre ne doit pas être vide",
    "notif_task_new_direction_invalid": "Au moins une direction doit être sélectionnée",
    "notif_leave": "Êtes-vous sûr de quitter le défi ?"
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
    "task_habits_create": "新建习惯",
    "task_dailies": "日常",
    "task_dailies_create": "新建日常",
    "task_todos": "待办事项",
    "task_todos_create": "新建待办事项",
    "task_new_title": "标题",
    "task_new_notes": "说明",
    "task_new_up": "积极方向",
    "task_new_down": "消极方向",
    "task_new_startdate": "起始日期",
    "task_new_difficulty": "难度",
    "task_new_difficulty_trivial": "普通",
    "task_new_difficulty_easy": "简单",
    "task_new_difficulty_medium": "中等",
    "task_new_difficulty_hard": "较难",
    "task_new_frequency": "频率",
    "task_new_frequency_daily": "每天",
    "task_new_frequency_weekly": "每周",
    "task_new_everyx": "每",
    "task_new_everyx_unit": "天",
    "task_new_everyx_units": "天",
    "task_new_repeat": "重复",
    "task_new_repeat_m": "每周一",
    "task_new_repeat_t": "每周二",
    "task_new_repeat_w": "每周三",
    "task_new_repeat_th": "每周四",
    "task_new_repeat_f": "每周五",
    "task_new_repeat_s": "每周六",
    "task_new_repeat_su": "每周日",

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
    "action_done": "完成",
    "action_save": "保存",

    "action_signin" : "Sign in",
    "action_logout" : "退出登录",

    "action_join": "加入",
    "action_leave": "退出",

    "notif_server_down": "服务器无响应",
    "notif_login_invalid": "Username or password invalid",
    "notif_logout": "确定要退出 Just Play？",
    "notif_sync" : "同步中 ...",
    "notif_not_challenge_member": "你还不是这个挑战的成员",
    "notif_joined": "成功加入挑战",
    "notif_task_up": "干得好！",
    "notif_task_down": "下不为例！",
    "notif_task_created": "任务创建成功",
    "notif_task_new_title_invalid": "标题不能为空",
    "notif_task_new_direction_invalid": "至少应选择一个方向",
    "notif_leave": "确定要退出挑战？"
  };

  $translateProvider.translations('en', labels_en);
  $translateProvider.translations('fr', labels_fr);
  $translateProvider.translations('cn', labels_cn);
  $translateProvider.preferredLanguage('en');
})
;
