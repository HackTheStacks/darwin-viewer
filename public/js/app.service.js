function AppService ($http) {
    'ngInject';
    return {
        getImages: function () {
            return $http.get('/api/fragments');
        }
    };
}