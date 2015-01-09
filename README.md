# cmove (beta)
Lightweight javascript canvas plugin. [Live demo](http://jesprider.github.io/cmove/example.html).

cMove allows you to add shapes to canvas and manipulate them like an objects. Current version of plugin has only one *not hard* dependency: [hand.js](http://handjs.codeplex.com/).
Hand.js is a polyfill for supporting pointer events on every browser. *Not hard* dependency means that you can use your own event listeners.

## Features
* Supports mobile devices
* Animation with RequestAnimationFrame
* Retina support for all shapes
* Uses pointer events
* Very configurable and flexible - easy to extend for your needs

Plugin has included two shapes by default: rectangles and pictures. If you need other shapes you can add it with ease. Anyway I am planning to add library of shapes and plugin's builder with shapes that you needed, to decrease the size of plugin.

## Getting Started
Just include hand.js and cmove.js from dist folder (or from lib for not minified versions) in your html:

```
<script src="dist/hand-1.3.8.js"></script>
<script src="dist/cmove.js"></script>
```

After that you can add:
```javascript
var canvas = document.getElementById('canvas'),
    mc = new cMove.MyCanvas(canvas);
    
mc.addShape(new cMove.Rectangle(mc, {
    x: 20,
    y: 30,
    w: 70,
    h: 50,
    fill: 'rgba(1,118,200,.7)'})
);
mc.addShape(new cMove.Picture(mc, {src: 'i/jewels/drop.png', x: 30, y: 120, selectable: false}));
```

## Documentation
Canvas will take 100% of parent element. Plugin returns global config, shapes constructors and constructor for canvas.


### cMove.MyCanvas(canvas, opts)
State of your canvas. All magic happens here.  
MyCanvas's properties:  
`canvas, width, height, ctx, ratio, shapes, rectangles, pictures, dragging, selection, dragoffx, dragoffy`

#### canvas
Type: `Element`  
**Required**

#### opts
Type: `Object`  
**Optional**

All options that you pass to this object will be available through `myCanvas[option]` in MyCanvas constructor.


### cMove.Rectangle(myCanvas, opts)
Rectangle's properties:  
`x, y, initX, initY, w, h, fill, stroke, strokeWidth, selectable, draggable, type, myCanvas`

#### myCanvas
Instance of MyCanvas constructor.

#### opts
Type: `Object`

##### opts.x and opts.y
Type: `Integer`  
Default: `0`

Position of top-left corner. Initial coords is available in `Rectangle.initX` and `Rectangle.initY` properties.

##### opts.w and opts.h
Type: `Integer`  
Default: `cMove.config.RECTANGLE_WIDTH and cMove.config.RECTANGLE_HEIGHT`

Size of shape.

##### opts.fill and opts.stroke
Type: `String` `Color`  
Default: `null`

Color of fill and stroke of shape.

##### opts.strokeWidth
Type: `Integer`  
Default: `cMove.config.RECTANGLE_STROKE_WIDTH`

##### opts.selectable
Type: `Boolean`  
Default: `True`

Local version of `cMove.config.SHAPES_SELECTION` (for current shape only).

##### opts.draggable
Type: `Boolean`  
Default: `True`

Shape is draggable if true.

##### opts.type
Type: `String`  
Default: `rectangle`

Type of the shape.


### cMove.Rectangle(myCanvas, opts)
In process...


### cMove.config

#### RECTANGLE_WIDTH and RECTANGLE_HEIGHT
Type: `Integer`  
Default: `50`

Default width and height for rectangle.

#### RECTANGLE_STROKE_WIDTH
Type: `Integer`  
Default: `1`

Default stroke width for rectangle.

#### SHAPES_SELECTION
Type: `Boolean`  
Default: `true`

There is a stroke around selected shape if true.

##### SELECTION_COLOR
Type: `String` `Color`  
Default: `#ffca4b`

Color of selection's stroke.

##### SELECTION_WIDTH
Type: `Integer`  
Default: `2`

Default stroke width for selection shape.

##### SELECTION_ON_TOP
Type: `Boolean`  
Default: `true`

Selected shape is on top others if true.

#### STRONG_BORDERS
Type: `Boolean`  
Default: `true`

Shapes can't move out of canvas if true.

#### RETINA_PICTURES
Type: `Boolean`  
Default: `false`

Set true if you use retina images.

##### RETINA_X2_PATH and RETINA_X3_PATH
Type: `String` `null`
Default: `x2` and `x3`

Path to your retina images. You can pass `null` if you don't have retina images for `ratio = 2` or `ratio = 3`.