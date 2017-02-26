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

            let testImg = new Image();
            testImg.src = '/api/fragments/' + vm.imageToMatch.matches[vm.currMatchIndex].targetId + '/image';


            testImg.onload = (e) => {
                console.log(testImg.width);
                let newImg = new Image();
                newImg.src = testImg.src;
                $(newImg).addClass('test-img');
                $('.main-content').append(newImg);
                renderOriginalImage(newImg);
                // resizeableImage($(newImg));
                var image = new ResizableImage($(newImg));
            };
            vm.loading = false;
        });

        function renderOriginalImage(img) {
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');

            let base = new Image();
            base.src = img.src;
            base.onload = () => {
                let ratio = base.height / base.width,
                    newHeight = 200 / base.width * base.height;
                canvas.width = 200;
                canvas.height = newHeight;
                console.log(ratio);
                console.log(newHeight);
                context.drawImage(base, 0, 0, 200, newHeight);
                img.src = canvas.toDataURL('image/jpeg');
            }
        }

        vm.images = [];
        vm.imageToMatch = {};
        vm.potentialMatches = [];
        vm.currentImageIndex = 0;
        vm.currMatchIndex = 0;
        vm.endOfMatches = false;
    }


}