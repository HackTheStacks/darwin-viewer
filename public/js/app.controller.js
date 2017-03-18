function AppCtrl(AppService) {
    var vm = this;

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
            vm.images = response.data;

            angular.extend(vm.imageToMatch, vm.images[0]);

            vm.potentialMatches = vm.imageToMatch.matches;
            vm.mainImageId = vm.images[0].id;

            let mainImg = new Image();
            mainImg.src = '/api/fragments/' + vm.imageToMatch.id + '/image';

            mainImg.onload = (e) => {
                let newImg = new Image();
                newImg.src = mainImg.src;
                $(newImg).addClass('main-img');
                $('.main-content').append(newImg);
                renderOriginalImage(newImg);
                var image = new ResizableImage($(newImg));
            };


            let testImg = new Image();
            testImg.src = '/api/fragments/' + vm.imageToMatch.matches[vm.currMatchIndex].targetId + '/image';

            testImg.onload = (e) => {
                console.log(testImg.width);
                let newImg = new Image();
                newImg.src = testImg.src;
                $(newImg).addClass('test-img');
                $('.main-content').append(newImg);
                renderOriginalImage(newImg);
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

function showCoords(evt){
    console.log(evt, this);
    // var container = $('.main-content')
    alert(
        "clientX value: " + (evt.clientX - evt.target.offsetLeft) + "\n" +
        "clientY value: " + (evt.clientY - evt.target.offsetTop) + "\n"
    );
}