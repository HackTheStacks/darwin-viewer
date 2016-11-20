'use strict';

function AppCtrl(AppService, $scope) {
    console.log('app ctrl loaded');

    $scope.images = [];
    $scope.currentImageIndex = 0;
    $scope.endOfImages = false;

    AppService.getImages().then(function (response) {
        console.log(response);
        $scope.images = response.data.images;
        console.log($scope.images);

        $scope.mainImageSrc = $scope.images[0].url;
        $scope.testImageSrc = $scope.images[$scope.currentImageIndex].url;
    });

    // Zooming

    $scope.zoomVal = 1;

    $scope.zoomIn = function (imgSelector) {
        var img = $(imgSelector);
        $scope.zoomVal = $scope.zoomVal + 0.1;
        img.css('zoom', $scope.zoomVal);
    };

    $scope.zoomOut = function (imgSelector) {
        var img = $(imgSelector);

        if ($scope.zoomVal > 1) {
            $scope.zoomVal = $scope.zoomVal - 0.1;
            img.css('zoom', $scope.zoomVal);
        }
    };

    $scope.zoomZero = function(imgSelector) {
        var img = $(imgSelector);

        img.css('zoom', 1);
    };

    // Matching response

    $scope.answerMatch = function (matchValue) {
        console.log('is match?', matchValue);
        nextImage();
    };

    function nextImage() {
        $scope.currentImageIndex++;
        if ($scope.currentImageIndex < $scope.images.length) {
            $scope.testImageSrc = $scope.images[$scope.currentImageIndex].url;
        } else {
            $scope.endOfImages = true;
        }

    }
}

angular
    .module('app')
    .controller('AppCtrl', ['AppService', '$scope', AppCtrl]);