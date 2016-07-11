(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope','UserService', '$rootScope'];
    function HomeController($scope,UserService, $rootScope) {

        $scope.user = null;
        $scope.allUsers = [];

        var loadCurrentUser = function() {
            var name= $rootScope.globals.currentUser ?  $rootScope.globals.currentUser.username : '';
            UserService.GetByUsername(name)
                .then(function (user) {
                    $scope.user = user;
                });
        }

        var loadAllUsers = function() {
            UserService.GetAll()
                .then(function (users) {
                    $scope.allUsers = users;
                });
        }
        //loadCurrentUser();
        loadAllUsers();

        $scope.deleteUser = function(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
            });
        }
    }

})();