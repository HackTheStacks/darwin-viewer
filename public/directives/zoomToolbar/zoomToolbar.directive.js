'use strict';

function zoomToolbar() {
    return {
        restrict: 'E',
        templateUrl: 'js/directives/zoomToolbar/zoomToolbar.html',
        controllerAs: 'vm',
        scope: {
            imgSelector: '@'
        },
        controller:     function ($scope, $element, $attrs) {
            console.log($scope.imgSelector);
            var vm = this;
            vm.zoomVal = 1;

            vm.zoomIn = function () {
                var img = $($scope.imgSelector);
                vm.zoomVal = vm.zoomVal + 0.5;
                img.css('zoom', vm.zoomVal);
            };

            vm.zoomOut = function () {
                var img = $($scope.imgSelector);

                if (vm.zoomVal > 1) {
                    vm.zoomVal = vm.zoomVal - 0.5;
                    img.css('zoom', vm.zoomVal);
                }
            };

            vm.zoomZero = function () {
                var img = $($scope.imgSelector);
                vm.zoomVal = 1;
                img.css('zoom', vm.zoomVal);
            };
        }
    };
}

angular
    .module('app')
    .directive('zoomToolbar', zoomToolbar);