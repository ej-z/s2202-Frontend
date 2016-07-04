(function () {
    'use strict';

    angular
        .module('app', ['ui.router', 'ngCookies'])
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
                url:'/login',
                controller: 'LoginController',
                templateUrl: 'login/login.view.html'
            })

            .state('register', {
                url:'/register',
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html'
            });
    }

    run.$inject = ['$rootScope', '$cookieStore', '$http'];
    function run($rootScope, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        // $rootScope.$on('$locationChangeStart', function (event, next, current) {
        //     // redirect to login page if not logged in and trying to access a restricted page
        //     var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
        //     var loggedIn = $rootScope.globals.currentUser;
        //     if (restrictedPage && !loggedIn) {
        //         $location.path('/login');
        //     }
        // });

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