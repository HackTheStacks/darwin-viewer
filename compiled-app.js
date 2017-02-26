'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _imageModel = require('./image-model');

var _imageModel2 = _interopRequireDefault(_imageModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function AppCtrl(AppService) {
    var vm = this;
    console.log('app ctrl loaded');

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

    // Image


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

            var testImg = new Image();
            testImg.src = '/api/fragments/' + vm.imageToMatch.matches[vm.currMatchIndex].targetId + '/image';

            testImg.onload = function (e) {
                console.log(testImg.width);
                var newImg = new Image();
                newImg.src = testImg.src;
                $(newImg).addClass('test-img');
                $('.main-content').append(newImg);
                renderOriginalImage(newImg);
                // resizeableImage($(newImg));
                var image = new _imageModel2.default($(newImg));
            };
            vm.loading = false;
        });

        function renderOriginalImage(img) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');

            var base = new Image();
            base.src = img.src;
            base.onload = function () {
                var ratio = base.height / base.width,
                    newHeight = 200 / base.width * base.height;
                canvas.width = 200;
                canvas.height = newHeight;
                console.log(ratio);
                console.log(newHeight);
                context.drawImage(base, 0, 0, 200, newHeight);
                img.src = canvas.toDataURL('image/jpeg');
            };
        }

        vm.images = [];
        vm.imageToMatch = {};
        vm.potentialMatches = [];
        vm.currentImageIndex = 0;
        vm.currMatchIndex = 0;
        vm.endOfMatches = false;
    }
}

exports.default = AppCtrl;
'use strict';

var _app = require('./app.controller');

var _app2 = _interopRequireDefault(_app);

var _app3 = require('./app.service');

var _app4 = _interopRequireDefault(_app3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Declare app level module which depends on views, and components
angular.module('app', ['ngRoute']).config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');

    $routeProvider.otherwise({ redirectTo: '/' });
}]).controller('AppCtrl', _app2.default).factory('AppService', _app4.default);
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function AppService($http) {
    'ngInject';

    return {
        getImages: function getImages() {
            // return $http.get('../images.json');
            return $http.get('/api/fragments');
        }
    };
}

exports.default = AppService;
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ResizableImage = function () {
    function ResizableImage($targetImg) {
        _classCallCheck(this, ResizableImage);

        this.$container = null;
        this.originalImg = new Image();
        this.targetImg = $targetImg.get(0);
        this.originalImg.src = targetImg.src;
        this.canvas = document.createElement('canvas');

        this.state = {};
        this.constrain = true;
        this.minWidth = 60;
        this.minHeight = 60;
        this.maxWidth = 800;
        this.maxHeight = 800;

        // Add resize handles
        $($targetImg).wrap('<div class="resize-container"></div>').before('<span class="resize-handle resize-handle-nw"></span>').before('<span class="resize-handle resize-handle-ne"></span>').after('<span class="resize-handle resize-handle-se"></span>').after('<span class="resize-handle resize-handle-sw"></span>');

        // Get a variable for the container
        this.$container = $($targetImg).parent('.resize-container');
        this.$container.on('mousedown touchstart', '.resize-handle', this.startResize);
        this.$container.on('mousedown touchstart', 'img', this.startMoving);
    }

    // Add events

    _createClass(ResizableImage, [{
        key: 'startResize',
        value: function startResize(e) {
            console.log('start resize!');
            e.preventDefault();
            e.stopPropagation();
            this.saveEventState(e);
            $(document).on('mousemove touchmove', this.resizing);
            $(document).on('mouseup touchend', this.endResize);
        }
    }, {
        key: 'endResize',
        value: function endResize(e) {
            console.log('end resize!');
            e.preventDefault();
            $(document).off('mouseup touchend', this.endResize);
            $(document).off('mousemove touchmove', this.resizing);
        }
    }, {
        key: 'saveEventState',
        value: function saveEventState(e) {
            var _this = this;

            console.log('save state!');
            // Save the initial event details and container state
            this.state.containerWidth = this.$container.width();
            this.state.containerHeight = this.$container.height();
            this.state.containerLeft = this.$container.offset().left;
            this.state.containerTop = this.$container.offset().top;
            this.state.mouseX = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
            this.state.mouseY = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

            // This is a fix for mobile safari
            // For some reason it does not allow a direct copy of the touches property
            if (typeof e.originalEvent.touches !== 'undefined') {
                this.state.touches = [];
                $.each(e.originalEvent.touches, function (i, ob) {
                    _this.state.touches[i] = {};
                    _this.state.touches[i].clientX = 0 + ob.clientX;
                    _this.state.touches[i].clientY = 0 + ob.clientY;
                });
            }
            this.state.event = e;
        }
    }, {
        key: 'resizing',
        value: function resizing(e) {
            console.log('resizing!', $(state.event.target));
            var mouse = {},
                width = void 0,
                height = void 0,
                left = void 0,
                top = void 0,
                offset = this.$container.offset();

            mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
            mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

            width = mouse.x - this.state.containerLeft;
            height = mouse.y - this.state.containerTop;
            left = this.state.containerLeft;
            top = this.state.containerTop;

            // Position image differently depending on the corner dragged and constraints
            if ($(this.state.event.target).hasClass('resize-handle-se')) {
                width = mouse.x - this.state.containerLeft;
                height = mouse.y - this.state.containerTop;
                left = this.state.containerLeft;
                top = this.state.containerTop;
            } else if ($(this.state.event.target).hasClass('resize-handle-sw')) {
                width = this.state.containerWidth - (mouse.x - this.state.containerLeft);
                height = mouse.y - this.state.containerTop;
                left = mouse.x;
                top = this.state.containerTop;
            } else if ($(this.state.event.target).hasClass('resize-handle-nw')) {
                width = this.state.containerWidth - (mouse.x - this.state.containerLeft);
                height = this.state.containerHeight - (mouse.y - this.state.containerTop);
                left = mouse.x;
                top = mouse.y;
                if (this.constrain || e.shiftKey) {
                    top = mouse.y - (width / this.originalImg.width * this.originalImg.height - height);
                }
            } else if ($(this.state.event.target).hasClass('resize-handle-ne')) {
                width = mouse.x - this.state.containerLeft;
                height = this.state.containerHeight - (mouse.y - this.state.containerTop);
                left = this.state.containerLeft;
                top = mouse.y;
                if (constrain || e.shiftKey) {
                    top = mouse.y - (width / this.originalImg.width * this.originalImg.height - height);
                }
            }

            if (this.constrain || e.shiftKey) {
                height = width / this.originalImg.width * this.originalImg.height;
            }

            if (width > this.minWidth && height > this.minHeight && width < this.maxWidth && height < this.maxHeight) {
                console.log('call resize image');
                this.resizeImage(width, height);
                // Without this Firefox will not re-calculate the the image dimensions until drag end
                this.$container.offset({ 'left': left, 'top': top });
            }
        }
    }, {
        key: 'resizeImage',
        value: function resizeImage(width, height) {
            console.log('resizeImage!');
            this.canvas.width = width;
            this.canvas.height = height;
            this.canvas.getContext('2d').drawImage(this.originalImg, 0, 0, width, height);
            $(this.targetImg).attr('src', this.canvas.toDataURL("image/png"));
        }
    }, {
        key: 'startMoving',
        value: function startMoving(e) {
            e.preventDefault();
            e.stopPropagation();
            this.saveEventState(e);
            $(document).on('mousemove touchmove', this.moving);
            $(document).on('mouseup touchend', this.endMoving);
        }
    }, {
        key: 'endMoving',
        value: function endMoving(e) {
            e.preventDefault();
            $(document).off('mouseup touchend', this.endMoving);
            $(document).off('mousemove touchmove', this.moving);
        }
    }, {
        key: 'moving',
        value: function moving(e) {
            var mouse = {};
            e.preventDefault();
            e.stopPropagation();

            var touches = e.originalEvent.touches;

            mouse.x = (e.clientX || e.pageX || touches[0].clientX) + $(window).scrollLeft();
            mouse.y = (e.clientY || e.pageY || touches[0].clientY) + $(window).scrollTop();

            this.$container.offset({
                'left': mouse.x - (this.state.mouseX - this.state.containerLeft),
                'top': mouse.y - (this.state.mouseY - this.state.containerTop)
            });

            // Watch for pinch zoom gesture while moving
            if (this.state.touches && this.state.touches.length > 1 && touches.length > 1) {
                var width = this.state.containerWidth,
                    height = this.state.containerHeight;
                var a = this.state.touches[0].clientX - this.state.touches[1].clientX;
                a = a * a;
                var b = this.state.touches[0].clientY - this.state.touches[1].clientY;
                b = b * b;
                var dist1 = Math.sqrt(a + b);

                a = e.originalEvent.touches[0].clientX - touches[1].clientX;
                a = a * a;
                b = e.originalEvent.touches[0].clientY - touches[1].clientY;
                b = b * b;
                var dist2 = Math.sqrt(a + b);

                var ratio = dist2 / dist1;

                width = width * ratio;
                height = height * ratio;
                // To improve performance you might limit how often resizeImage() is called
                this.resizeImage(width, height);
            }
        }
    }]);

    return ResizableImage;
}();

exports.default = ResizableImage;
