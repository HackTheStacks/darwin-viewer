'use strict';

function pan() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        template: '<div class="scroll-container" ng-transclude></div>',
        link:     function (scope, elem, attr) {
            var clicking = false;
            var previousX;
            var previousY;

            elem.mousedown(function (e) {
                e.preventDefault();
                previousX = e.clientX;
                previousY = e.clientY;
                clicking = true;
            });

            elem.mouseup(function () {
                clicking = false;
            });

            elem.mousemove(function (e) {

                if (clicking) {
                    e.preventDefault();
                    // var directionX = (previousX - e.clientX) > 0 ? 1 : -1;
                    // var directionY = (previousY - e.clientY) > 0 ? 1 : -1;
                    //$(this).scrollLeft($(this).scrollLeft() + 10 * directionX);
                    //$(this).scrollTop($(this).scrollTop() + 10 * directionY);
                    
                    $(this).scrollLeft($(this).scrollLeft() + (previousX - e.clientX));
                    $(this).scrollTop($(this).scrollTop() + (previousY - e.clientY));
                    previousX = e.clientX;
                    previousY = e.clientY;
                }
            });

            elem.mouseleave(function (e) {
                clicking = false;
            });
        }
    };
}

angular
    .module('app')
    .directive('pan', pan);