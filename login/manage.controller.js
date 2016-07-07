(function () {
    'use strict';

    angular
        .module('app')
        .controller('ManageController', ManageController);

    ManageController.$inject = ['$state','$scope'];
    function ManageController($state,$scope, AuthenticationService, FlashService) {

        $scope.manageApartment = function() {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function (response) {
                if (response.success) {
                    AuthenticationService.SetCredentials($scope.username, $scope.password);
                    $state.go('/');
                } else {
                    FlashService.Error(response.message);
                    $scope.dataLoading = false;
                }
            });
        };

        $scope.manafeFlat = function(){
            $state.go('/');
        };
    }

})();
