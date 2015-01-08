/**
 * RequestAnimationFrame polyfill
 */
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = Date.now();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

/**
 * Bind function polyfill from MDN
 */
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

/**
 * @name cMove.js
 * @version 0.0.1
 * @author Roman Alekseev
 * @license MIT
 */
var cMove = (function() {

    // Config constants and default values
    var config = {
        // Default dimensions of rectangle
        RECTANGLE_WIDTH: 50,
        RECTANGLE_HEIGHT: 50,
        RECTANGLE_STROKE_WIDTH: 1,

        // Frame around the shape when selected.
        SHAPES_SELECTION: true,
        SELECTION_COLOR: '#ffca4b',
        SELECTION_WIDTH: 2,
        SELECTION_ON_TOP: true, // Selected shape is on top others if true.

        STRONG_BORDERS: true, // Set 'false' if shapes can move outside the canvas.

        // You need 'x2' and 'x3' folders for retina displays.
        RETINA_PICTURES: false,
        RETINA_X2_PATH: 'x2',
        RETINA_X3_PATH: 'x3' // Set 'false' or 'null' if you do not have x2 or x3 images.
    };

    /**
     * Rectangle constractor
     * @param {Object} myCanvas - link to myCanvas instance
     * @param {Object} opts
     * @constructor
     */
    function Rectangle(myCanvas, opts) {
        var rectangle = this; // Make reference to 'this' everytime, because 'this' is not minified.

        rectangle.x = opts.x || 0;
        rectangle.y = opts.y || 0;
        rectangle.initX = opts.x || 0; // Always keep initial position - very useful.
        rectangle.initY = opts.y || 0;
        rectangle.w = opts.w || config.RECTANGLE_WIDTH;
        rectangle.h = opts.h || config.RECTANGLE_HEIGHT;

        rectangle.fill = opts.fill || null;
        rectangle.stroke = opts.stroke || null;
        rectangle.strokeWidth = opts.strokeWidth || config.RECTANGLE_STROKE_WIDTH;

        rectangle.selectable = (opts.selectable !== false); // If selectable is false - current shape won't have selection frame.
        rectangle.draggable = (opts.draggable !== false); // If false - current shape is not draggable.
        rectangle.type = 'rectangle'; // Basic type is 'rectangle'. Sometimes it is useful to set logical type, e.g. 'slot'.
        rectangle.myCanvas = myCanvas; // Keep myCanvas that current shape belongs to.
    }

    Rectangle.prototype.draw = function(ctx) {
        var rectangle = this;

        if (rectangle.fill) {
            ctx.fillStyle = rectangle.fill;
            ctx.fillRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
        }

        if (config.SHAPES_SELECTION && rectangle.selectable && rectangle.myCanvas.selection === rectangle) {
            ctx.strokeStyle = config.SELECTION_COLOR;
            ctx.lineWidth = config.SELECTION_WIDTH;
            ctx.strokeRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
        } else if (rectangle.stroke) {
            ctx.strokeStyle = rectangle.stroke;
            ctx.lineWidth = rectangle.strokeWidth;
            ctx.strokeRect(rectangle.x, rectangle.y, rectangle.w, rectangle.h);
        }
    };

    Rectangle.prototype.contains = function(mx, my) {
        var rectangle = this;
        return  (rectangle.x <= mx) && (rectangle.x + rectangle.w >= mx) &&
                (rectangle.y <= my) && (rectangle.y + rectangle.h >= my);
    };

    /**
     * Picture constuctor
     * @param {Object} myCanvas - link to myCanvas instance
     * @param {Object} opts
     * @constructor
     */
    function Picture(myCanvas, opts) {
        if (!opts.src) throw new TypeError('Src of picture is required.');

        var pic = new Image(),
            picture = this,
            ratio = myCanvas.ratio;

        if (config.RETINA_PICTURES && config.RETINA_X2_PATH && ratio > 1 && ratio <=2) {
            opts.src = getRetinaPath(opts.src, config.RETINA_X2_PATH);
        }

        if (config.RETINA_PICTURES && config.RETINA_X3_PATH && ratio > 2) {
            opts.src = getRetinaPath(opts.src, config.RETINA_X3_PATH);
        }

        pic.src = opts.src;

        picture.pic = pic;
        picture.src = opts.src || '';

        picture.x = opts.x || 0;
        picture.y = opts.y || 0;
        picture.initX = opts.x || 0;
        picture.initY = opts.y || 0;
        picture.w = opts.w || 0;
        picture.h = opts.h || 0;

        picture.selectable = (opts.selectable !== false);
        picture.draggable = (opts.draggable !== false);
        picture.type = 'picture';
        picture.myCanvas = myCanvas;

        pic.onload = (function () {
            // If we don't set dimensions for images - natural dimensions will be set.
            if (picture.w === 0 || picture.h === 0) {
                if (config.RETINA_PICTURES && config.RETINA_X2_PATH && ratio > 1 && ratio <= 2) {
                    picture.w = picture.pic.naturalWidth / 2;
                    picture.h = picture.pic.naturalHeight / 2;
                } else if (config.RETINA_PICTURES && config.RETINA_X3_PATH && ratio > 2) {
                    picture.w = picture.pic.naturalWidth / 3;
                    picture.h = picture.pic.naturalHeight / 3;
                } else {
                    picture.w = picture.pic.naturalWidth;
                    picture.h = picture.pic.naturalHeight;
                }
            }
            myCanvas.valid = false;
        }).bind(picture);
    }

    Picture.prototype.draw = function(ctx) {
        var picture = this;

        if (config.SHAPES_SELECTION && picture.selectable && picture.myCanvas.selection === picture) {
            ctx.strokeStyle = config.SELECTION_COLOR;
            ctx.lineWidth = config.SELECTION_WIDTH;
            ctx.strokeRect(picture.x, picture.y, picture.w, picture.h);
        }

        ctx.drawImage(picture.pic, picture.x, picture.y, picture.w, picture.h);
    };

    Picture.prototype.contains = function(mx, my) {
        var picture = this;
        return  (picture.x <= mx) && (picture.x + picture.w >= mx) &&
                (picture.y <= my) && (picture.y + picture.h >= my);
    };

    /**
     * State of canvas
     * @param {Element} canvas
     * @param {Object} opts - optional
     * @constructor
     */
    function MyCanvas(canvas, opts) {
        var myCanvas = this;

        // Canvas vars
        myCanvas.canvas = canvas;
        myCanvas.width = canvas.width;
        myCanvas.height = canvas.height;
        myCanvas.ctx = canvas.getContext('2d');
        myCanvas.ratio = 1; // See MyCanvas.init() for details.

        // Basic options
        myCanvas.shapes = []; // The collection of shapes to be drawn
        myCanvas.rectangles = []; // It is useful to have arrays of relative shapes. See MyCanvas.prototype.addShape() for details.
        myCanvas.pictures = [];

        myCanvas.dragging = false; // Keep track of when we are dragging.
        myCanvas.selection = null; // The current selected object.
        myCanvas.dragoffx = 0; // See pointerstart and pointerend events for explanation
        myCanvas.dragoffy = 0;

        // Adds custom options from opts
        for (var opt in opts) {
            if (opts.hasOwnProperty(opt)) {
                myCanvas[opt] = opts[opt];
            }
        }

        // Bind draw function (we do it for correct context in requestAnimationFrame function).
        myCanvas.draw = draw.bind(myCanvas);

        myCanvas.stylePaddingLeft = 0;
        myCanvas.stylePaddingTop = 0;
        myCanvas.styleBorderLeft = 0;
        myCanvas.styleBorderTop = 0;

        if (document.defaultView && document.defaultView.getComputedStyle) {
            var canvasStyles = document.defaultView.getComputedStyle(canvas, null);
            myCanvas.stylePaddingLeft = parseInt(canvasStyles['paddingLeft'], 10)      || 0;
            myCanvas.stylePaddingTop  = parseInt(canvasStyles['paddingTop'], 10)       || 0;
            myCanvas.styleBorderLeft  = parseInt(canvasStyles['borderLeftWidth'], 10)  || 0;
            myCanvas.styleBorderTop   = parseInt(canvasStyles['borderTopWidth'], 10)   || 0;
        }

        var html = document.documentElement;
        myCanvas.htmlTop = html.offsetTop;
        myCanvas.htmlLeft = html.offsetLeft;

        // Fixes a problem where double clicking causes text to get selected on the canvas.
        canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);

        function pointerStart(e) {
            var mouse = myCanvas.getPointer(e),
                mx = mouse.x,
                my = mouse.y,
                shapes = myCanvas.shapes,
                l = shapes.length;

            for (var i = l-1; i >= 0; i--) {
                if (myCanvas.shapes[i].contains(mx, my)) {
                    var mySel = myCanvas.shapes[i];

                    // Keep track of where in the object we clicked
                    // so we can move it smoothly (see pointermove)
                    myCanvas.dragoffx = mx - mySel.x;
                    myCanvas.dragoffy = my - mySel.y;
                    myCanvas.dragging = true;
                    myCanvas.selection = mySel;

                    myCanvas.valid = false;
                    return;
                }
            }

            // Haven't returned means we have failed to select anything.
            // If there was an object selected, we deselect it.
            if (myCanvas.selection) {
                myCanvas.selection = null;
                myCanvas.valid = false;
            }
        }

        function pointerMove(e) {
            if (myCanvas.dragging && myCanvas.selection.draggable) {
                // Prevent scrolling for mobile.
                e.preventDefault();

                var mouse = myCanvas.getPointer(e);
                // We don't want to drag the object by its top-left corner, we want to drag it
                // from where we clicked. Thats why we saved the offset and use it here
                myCanvas.selection.x = mouse.x - myCanvas.dragoffx;
                myCanvas.selection.y = mouse.y - myCanvas.dragoffy;

                if (config.STRONG_BORDERS) {
                    // Do not allow to move shape out of the canvas.
                    if (myCanvas.selection.x < 0) { myCanvas.selection.x = 0; }
                    if (myCanvas.selection.y < 0) { myCanvas.selection.y = 0; }
                    if (myCanvas.selection.x + myCanvas.selection.w > myCanvas.width) { myCanvas.selection.x = myCanvas.width - myCanvas.selection.w; }
                    if (myCanvas.selection.y + myCanvas.selection.h > myCanvas.height) { myCanvas.selection.y = myCanvas.height - myCanvas.selection.h; }
                }

                myCanvas.valid = false; // Something's dragging so we must redraw
            }
        }

        function pointerEnd() {
            myCanvas.dragging = false;
        }

        // Set event listeners if needed
        canvas.addEventListener('pointerdown', pointerStart, true);
        canvas.addEventListener('pointermove', pointerMove, true);
        canvas.addEventListener('pointerup', pointerEnd, true);

        myCanvas.init(canvas);
        myCanvas.draw();
    }

    MyCanvas.prototype.addShape = function(shape) {
        var myCanvas = this;

        myCanvas.shapes.push(shape);
        if (shape.type === 'rectangle') {
            myCanvas.rectangles.push(shape);
        }
        if (shape.type === 'picture') {
            myCanvas.pictures.push(shape);
        }
        myCanvas.valid = false;
    };

    function draw() {
        var myCanvas = this;

        if (!myCanvas.valid) {
            var ctx = myCanvas.ctx,
                shapes = myCanvas.shapes,
                l = shapes.length;

            myCanvas.clear();

            // Draw all shapes.
            for (var i = 0; i < l; i++) {
                var shape = shapes[i];

                // We can skip drawing of the elements that have moved off the screen.
                if (shape.x > myCanvas.width || shape.y > myCanvas.height ||
                    shape.x + shape.w < 0 || shape.y + shape.h < 0) continue;
                shapes[i].draw(ctx);
            }

            // Draw selected shape last to be on top of the others.
            if (myCanvas.selection && config.SELECTION_ON_TOP) {
                myCanvas.selection.draw(ctx);
            }

            myCanvas.valid = true;
        }

        requestAnimationFrame(myCanvas.draw, myCanvas.canvas);
    }

    MyCanvas.prototype.clear = function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    };

    MyCanvas.prototype.getPointer = function(e) {
        var myCanvas = this,
            element = myCanvas.canvas,
            offsetX = 0,
            offsetY = 0,
            mx,
            my,
            scrollY = window.pageYOffset;

        // Compute the total offset
        if (element.offsetParent !== undefined) {
            do {
              offsetX += element.offsetLeft;
              offsetY += element.offsetTop;
            } while (element = element.offsetParent);
        }

        offsetX += myCanvas.stylePaddingLeft + myCanvas.styleBorderLeft + myCanvas.htmlLeft;
        offsetY += myCanvas.stylePaddingTop + myCanvas.styleBorderTop + myCanvas.htmlTop;

        if (navigator.userAgent.toLowerCase().indexOf("windows phone") != -1 ||
            (navigator.userAgent.toLowerCase().indexOf("windows nt") != -1 &&
             navigator.userAgent.toLowerCase().indexOf("touch") != -1)) {
            mx = e.originalEvent.pageX - offsetX;
            my = e.originalEvent.pageY - offsetY + scrollY;
        } else {
            mx = e.clientX - offsetX;
            my = e.clientY - offsetY + scrollY;
        }

        return {x: mx, y: my};
    };

    MyCanvas.prototype.init = function(canvas) {
        var myCanvas = this,
            ctx = myCanvas.ctx,
            devicePixelRatio = window.devicePixelRatio || 1,
            backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                                ctx.mozBackingStorePixelRatio ||
                                ctx.msBackingStorePixelRatio ||
                                ctx.oBackingStorePixelRatio ||
                                ctx.backingStorePixelRatio || 1,

            ratio = devicePixelRatio / backingStoreRatio;

        var container = canvas.parentNode,
            w =  container.offsetWidth,
            h = container.offsetHeight;

        canvas.width = w;
        canvas.height = h;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';

        myCanvas.width = w;
        myCanvas.height = h;

        if (ratio !== 1) {
            myCanvas.ratio = ratio;
            w = w * ratio;
            h = h * ratio;
            canvas.width = w;
            canvas.height = h;
            myCanvas.ctx.scale(ratio,ratio);
        }
    };

    function getRetinaPath(src, retinaPath) {
        var path = src.split('/');
        path[path.length-1] = retinaPath + '/' + path[path.length-1];
        return path.join('/');
    }

    return {
        MyCanvas: MyCanvas,
        Rectangle: Rectangle,
        Picture: Picture,
        config: config
    };

})();