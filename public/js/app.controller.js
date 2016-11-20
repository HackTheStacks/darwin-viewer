'use strict';

function AppCtrl(AppService) {
    var vm = this;
    console.log('app ctrl loaded');

    // Zooming

    // vm.zoomVal = 1;
    //
    // vm.zoomIn = function (imgSelector) {
    //     var img = $(imgSelector);
    //     vm.zoomVal = vm.zoomVal + 0.1;
    //     img.css('zoom', vm.zoomVal);
    // };
    //
    // vm.zoomOut = function (imgSelector) {
    //     var img = $(imgSelector);
    //
    //     if (vm.zoomVal > 1) {
    //         vm.zoomVal = vm.zoomVal - 0.1;
    //         img.css('zoom', vm.zoomVal);
    //     }
    // };
    //
    // vm.zoomZero = function (imgSelector) {
    //     var img = $(imgSelector);
    //     vm.zoomVal = 1;
    //     img.css('zoom', vm.zoomVal);
    // };

    // Matching response

    vm.answerMatch = function (matchValue) {
        console.log('is match?', matchValue);
        vm.nextImage();
    };

    vm.nextImage = function () {
        vm.currMatchIndex++;
        if (vm.currMatchIndex < vm.imageToMatch.matches.length) {
            vm.currMatchImageSrc = '/api/fragments/' + vm.imageToMatch.matches[vm.currMatchIndex].targetId + '/image';
        } else {
            vm.endOfMatches = true;
        }
    };

    vm.nextImageSet = function () {
        vm.currentImageIndex++;
        angular.extend(vm.imageToMatch, vm.images[vm.currentImageIndex]);
        vm.endOfMatches = false;
        vm.currMatchIndex = 0;
    };

    initialize();

    function initialize() {
        vm.loading = true;
        AppService.getImages().then(function (response) {
            console.log(response);
            // vm.images = response.data.images;
            vm.images = response.data;
            console.log(vm.images);

            angular.extend(vm.imageToMatch, vm.images[0]);
            vm.potentialMatches = vm.imageToMatch.matches;
            console.log('image to match', vm.imageToMatch);
            vm.mainImageId = vm.images[0].id;
            vm.currMatchImageSrc = '/api/fragments/' + vm.imageToMatch.matches[vm.currMatchIndex].targetId + '/image';
            vm.loading = false;
        });

        vm.images = [];
        vm.imageToMatch = {};
        vm.potentialMatches = [];
        vm.currentImageIndex = 0;
        vm.currMatchIndex = 0;
        vm.endOfMatches = false;
    }


}

angular
    .module('app')
    .controller('AppCtrl', ['AppService', AppCtrl]);