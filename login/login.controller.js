(function () {
    'use strict';

    angular
        .module('app')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state','$scope','AuthenticationService', 'FlashService'];
    function LoginController($state,$scope, AuthenticationService, FlashService) {
        
        $scope.initController = function() {
            // reset login status
            AuthenticationService.ClearCredentials();
        };

        $scope.initController();

        $scope.login = function() {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    var authdata = AuthenticationService.GetAuthdata($scope.username, $scope.password);
                    var params = {username:$scope.username, authdata:authdata};
                    $state.go('login.manage',params);
                } else {
                    FlashService.Error(response.message);
                    $scope.dataLoading = false;
                }
            });
        };

        $scope.cancel = function(){
            $state.go('/');
        };
    }

})();
