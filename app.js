(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'ngCookies','ngAnimate', 'ui.bootstrap'])
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];
    function config($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('/', {
                url:'/',
                controller: 'HomeController',
                templateUrl: 'home/home.view.html'
            })

            .state('login', {
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        controller: 'LoginController',
                        templateUrl: 'login/login.view.html',
                        backdrop: 'static'          
                    }).result.finally(function(data) {
                        $state.go('^');
                    });
                }]
                
            })

            .state('register', {
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({
                        controller: 'RegisterController',
                        templateUrl: 'register/register.view.html',
                        backdrop: 'static'          
                    }).result.finally(function() {
                        $state.go('^');
                    });
                }]                
            })

            .state('login.manage', {
                params:{username:null,authdata:null},
                onEnter: ['$stateParams', '$state', '$modal', function($stateParams, $state, $modal) {
                    $modal.open({                        
                        templateUrl: 'login/manage.view.html',
                        params:{username:null,authdata:null},
                        controller: 'ManageController',
                        backdrop: 'static'          
                    }).result.finally(function(data) {
                        $state.go('^');
                    });
                }]
                
            });
    }

    run.$inject = ['$rootScope', '$cookieStore', '$http','$modalStack'];
    function run($rootScope, $cookieStore, $http,$modalStack) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$stateChangeStart', function() {
          var top = $modalStack.getTop();
          if (top) {
            $modalStack.dismiss(top.key);
          }
      })

        $rootScope.IsLoggedin = function(){
            var loggedIn = $rootScope.globals.currentUser;
            if(loggedIn)
                return true;
            return false;
        }

        $rootScope.Logout = function(){
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        };
        
    }

})();