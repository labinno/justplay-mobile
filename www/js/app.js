// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  //$ionicConfigProvider.tabs.position('bottom');

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
  });

})

.run(function($ionicPlatform, $state, $rootScope, LabelUtil, StorageUtil) {
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

  $rootScope.getLabel = LabelUtil.getLabel;

  var user = StorageUtil.getUser();
  if(user && user.uuid && user.token){
    $state.go('tab.tasks');
  }
  else {
    $state.go('login');
  }
});
