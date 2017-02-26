function AppService ($http) {
    'ngInject';
    return {
        getImages: function () {
            // return $http.get('../images.json');
            return $http.get('/api/fragments');
        }
    };
}