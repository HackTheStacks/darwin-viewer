class ResizableImage {
    constructor($targetImg) {
        this.$container = null;
        this.originalImg = new Image();
        this.targetImg = $targetImg.get(0);

        this.originalImg.src = this.targetImg.src;
        this.canvas = document.createElement('canvas');
        console.log(this.originalImg);
        this.state = {};
        this.constrain = true;
        this.minWidth = 60;
        this.minHeight = 60;
        this.maxWidth = 800;
        this.maxHeight = 800;


// Add resize handles
        $($targetImg).wrap('<div class="resize-container"></div>')
            .before('<span class="resize-handle resize-handle-nw"></span>')
            .before('<span class="resize-handle resize-handle-ne"></span>')
            .after('<span class="resize-handle resize-handle-se"></span>')
            .after('<span class="resize-handle resize-handle-sw"></span>');

        // Get a variable for the container
        this.$container = $($targetImg).parent('.resize-container');
        this.$container.on('mousedown touchstart', '.resize-handle', this.startResize.bind(this));
        this.$container.on('mousedown touchstart', 'img', this.startMoving.bind(this));
    }


    // Add events

    startResize(e) {
        console.log('start resize!');
        e.preventDefault();
        e.stopPropagation();
        this.saveEventState(e);
        $(document).on('mousemove touchmove', this.resizing.bind(this));
        $(document).on('mouseup touchend', this.endResize.bind(this));
    }

    endResize(e) {
        console.log('end resize!');
        e.preventDefault();
        $(document).off('mouseup touchend');
        $(document).off('mousemove touchmove');
    }

    saveEventState(e) {
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
            $.each(e.originalEvent.touches, (i, ob) => {
                this.state.touches[i] = {};
                this.state.touches[i].clientX = 0 + ob.clientX;
                this.state.touches[i].clientY = 0 + ob.clientY;
            });
        }
        this.state.event = e;
    }

    resizing(e) {
        console.log('resizing!', e, this);
        let mouse = {},
            width,
            height,
            left,
            top,
            offset = this.$container.offset();

        mouse.x = (e.clientX || e.pageX || e.originalEvent.touches[0].clientX) + $(window).scrollLeft();
        mouse.y = (e.clientY || e.pageY || e.originalEvent.touches[0].clientY) + $(window).scrollTop();

        width = mouse.x - this.state.containerLeft;
        height = mouse.y - this.state.containerTop;
        left = this.state.containerLeft;
        top = this.state.containerTop;
console.log($(this.state.event.target));
        // Position image differently depending on the corner dragged and constraints
        if ($(this.state.event.target).hasClass('resize-handle-se')) {
            width = mouse.x - this.state.containerLeft;
            height = mouse.y - this.state.containerTop;
            left = this.state.containerLeft;
            top = this.state.containerTop;
            console.log(this.state);
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
                top = mouse.y - ((width / this.originalImg.width * this.originalImg.height) - height);
            }
        } else if ($(this.state.event.target).hasClass('resize-handle-ne')) {
            width = mouse.x - this.state.containerLeft;
            height = this.state.containerHeight - (mouse.y - this.state.containerTop);
            left = this.state.containerLeft;
            top = mouse.y;
            if (constrain || e.shiftKey) {
                top = mouse.y - ((width / this.originalImg.width * this.originalImg.height) - height);
            }
        }
console.log(this.originalImg);
        if (this.constrain || e.shiftKey) {
            height = width / this.originalImg.width * this.originalImg.height;
        }

        console.log(width, this.minWidth);
        console.log(width, this.maxWidth);
        console.log(height, this.minHeight);
        console.log(height, this.maxHeight);
        if (width > this.minWidth && height > this.minHeight && width < this.maxWidth && height < this.maxHeight) {
            console.log('call resize image');
            this.resizeImage(width, height);
            // Without this Firefox will not re-calculate the the image dimensions until drag end
            this.$container.offset({'left': left, 'top': top});
        }
    }

    resizeImage(width, height) {
        console.log('resizeImage!');
        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.getContext('2d').drawImage(this.originalImg, 0, 0, width, height);
        $(this.targetImg).attr('src', this.canvas.toDataURL("image/png"));
    }

    startMoving(e) {
        console.log('start moving!', e.target);
        e.preventDefault();
        e.stopPropagation();
        this.saveEventState(e);

        $(document).on('mousemove touchmove', this.moving.bind(this));
        $(document).on('mouseup touchend', this.endMoving.bind(this));
    }

    endMoving(e) {
        console.log('end moving!', e.target);
        e.preventDefault();
        e.stopPropagation();
        $(document).off('mouseup touchend');
        $(document).off('mousemove touchmove');
    }

    moving(e) {
        let mouse = {};
        e.preventDefault();
        e.stopPropagation();

        let touches = e.originalEvent.touches;

        mouse.x = (e.clientX || e.pageX || touches[0].clientX) + $(window).scrollLeft();
        mouse.y = (e.clientY || e.pageY || touches[0].clientY) + $(window).scrollTop();

        this.$container.offset({
            'left': mouse.x - ( this.state.mouseX - this.state.containerLeft ),
            'top': mouse.y - ( this.state.mouseY - this.state.containerTop )
        });

        // Watch for pinch zoom gesture while moving
        if (this.state.touches && this.state.touches.length > 1 && touches.length > 1) {
            console.log('pinch!');
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
}