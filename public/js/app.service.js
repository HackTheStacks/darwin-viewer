'use strict';

function AppService ($http) {

    return {
        getImages: function () {
            // return $http.get('../images.json');
            return $http.get('/api/fragments');
        }
    };

}

angular
    .module('app')
    .factory('AppService', ['$http', AppService]);