'use strict';

function AppService ($http) {

    return {
        getImages: function () {
            return $http.get('../images.json');
        }
    };

}

angular
    .module('app')
    .factory('AppService', ['$http', AppService]);