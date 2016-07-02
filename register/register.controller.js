(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', '$rootScope', 'FlashService'];
    function RegisterController(UserService, $location, $rootScope, FlashService) {
        var vm = this;

        vm.register = register;
        vm.AvailableApartments = UserService.GetAvailableApartments("");
        vm.getFlatsForApartment = getFlatsForApartment;
        vm.isFlatSelectionDisabled = true;

        function getFlatsForApartment() {
            if(vm.user.apartmentName != null){
                vm.AvailableFlats = UserService.GetAvailableFlats(vm.user.apartmentName,"");
                vm.isFlatSelectionDisabled = false;
            }
            else {
                 vm.isFlatSelectionDisabled = true;
            }
           };

        function register() {
            if(vm.user.password != vm.reenterpassword)
            {
                FlashService.Error("Passwords do not match");
                return;
            }
            vm.dataLoading = true;
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.success) {
                        FlashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }
    }

})();
