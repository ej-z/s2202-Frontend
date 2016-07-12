(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    UserService.$inject = ['$timeout','$http', '$filter', '$q'];
    function UserService($timeout,$http, $filter, $q) {

        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.GetAllAvailableApartments = GetAllAvailableApartments;
        service.GetFlatsForApartment = GetFlatsForApartment;
        service.GetAvailableApartmentsForUser = GetAvailableApartmentsForUser;
        service.GetAvailableFlatsForUser = GetAvailableFlatsForUser;

        return service;

        function GetAll() {
            return getUsers();
        }

        function GetById(id) {
            var deferred = $q.defer();
            getUsers().then(function(users){
                var filtered = $filter('filter')(users, { id: id });
                var user = filtered.length ? filtered[0] : null;
                deferred.resolve(user);                
            });
            return deferred.promise;
        }

        function GetByUsername(username) {

            var deferred = $q.defer();
            getUsers().then(function(users){
                var filtered = $filter('filter')(users, { username: username });
                var user = filtered.length ? filtered[0] : null;
                deferred.resolve(user);                
            });
            return deferred.promise;
        }

        function Create(user) {
            var deferred = $q.defer();

            // simulate api call with $timeout
            $timeout(function () {
                GetByUsername(user.username)
                    .then(function (duplicateUser) {
                        if (duplicateUser !== null) {
                            deferred.resolve({ success: false, message: 'Username "' + user.username + '" is already taken' });
                        } else {
                            var users = getUsers();

                            // assign id
                            var lastUser = users[users.length - 1] || { id: 0 };
                            user.id = lastUser.id + 1;

                            // save to local storage
                            users.push(user);
                            setUsers(users);

                            deferred.resolve({ success: true });
                        }
                    });
            }, 1000);

            return deferred.promise;
        }

        function Update(user) {
            var deferred = $q.defer();

            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                if (users[i].id === user.id) {
                    users[i] = user;
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        function Delete(id) {
            var deferred = $q.defer();

            var users = getUsers();
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (user.id === id) {
                    users.splice(i, 1);
                    break;
                }
            }
            setUsers(users);
            deferred.resolve();

            return deferred.promise;
        }

        // private functions

        function getUsers() {
            return $http.get('/data/Users.json').then(handleSuccess, handleError('Error getting all users'));;
        }

        function setUsers(users) {
            localStorage.users = JSON.stringify(users);
        }

        function GetAllAvailableApartments(searchPhrase) {
            return $http.get('/data/Apartments.json').then(handleSuccess, handleError('Error getting all apartments'));
        }

        function GetAllAvailableFlats(searchPhrase) {
            return $http.get('/data/Flats.json').then(handleSuccess, handleError('Error getting all apartments'));
        }

        function GetAvailableApartmentsForUser(username, searchPhrase) {
            var deferred = $q.defer();
            GetByUsername(username).then(function(user){
                GetAllAvailableApartments('').then(function(apartments){
                var filtered = $filter('filter')(apartments, function(listItem){
                        return user.apartments.indexOf(listItem.Id) != -1;
                    });
                    deferred.resolve(filtered);  
                });
            });
            return deferred.promise;
        }
         function GetAvailableFlatsForUser(username, searchPhrase) {
            var deferred = $q.defer();
            GetByUsername(username).then(function(user){
                GetAllAvailableFlats('').then(function(flats){
                var filtered = $filter('filter')(flats, function(listItem){
                        return user.flats.indexOf(listItem.Id) != -1;
                    });
                    deferred.resolve(filtered);  
                });
            });
            return deferred.promise;
        }

        function GetFlatsForApartment(ApartmentId, searchPhrase) {
            var deferred = $q.defer();
            GetAllAvailableFlats().then(function(flats){
                var filtered = $filter('filter')(flats, { ApartmentId: ApartmentId });
                deferred.resolve(filtered);                
            });
            return deferred.promise;
        }

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }
})();