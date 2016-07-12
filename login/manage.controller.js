(function () {
    'use strict';

    angular
        .module('app')
        .controller('ManageController', ManageController);

    ManageController.$inject = ['$state','$scope', 'UserService', 'FlashService'];
    function ManageController($state,$scope, UserService, FlashService) {

        var getapartemnts = function() {
            UserService.GetAvailableApartmentsForUser('ejaz','').then(function(apartments){
                $scope.AvailableApartments = apartments;
            })
        };

        getapartemnts();


        var getFlats = function() {
            UserService.GetAvailableFlatsForUser('ejaz','').then(function(flats){
                $scope.AvailableFlats = flats;
            })
        };

        getFlats();

        $scope.manafeFlat = function(){
            $state.go('/');
        };
    }

})();
