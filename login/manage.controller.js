(function () {
    'use strict';

    angular
        .module('app')
        .controller('ManageController', ManageController);

    ManageController.$inject = ['$state','$scope','$stateParams', 'AuthenticationService'];
    function ManageController($state,$scope,$stateParams, AuthenticationService) {

        $scope.ManageApartment = function(){
            var username = $stateParams.username;
            var authdata = $stateParams.authdata;
            AuthenticationService.SetCredentials(username,authdata,1);
            $state.go('apartment');
        }

        $scope.ManageFlat = function(){
            AuthenticationService.SetCredentials($stateParams.username,$stateParams.authdata, 2);
            $state.go('flat');
        }
        // var getapartemnts = function() {
        //     UserService.GetAvailableApartmentsForUser('ejaz','').then(function(apartments){
        //         $scope.AvailableApartments = apartments;
        //     })
        // };

        // getapartemnts();


        // var getFlats = function() {
        //     UserService.GetAvailableFlatsForUser('ejaz','').then(function(flats){
        //         $scope.AvailableFlats = flats;
        //     })
        // };

        // getFlats();

        $scope.cancel = function(){
            $state.go('/');
        };
    }

})();
