!function(){for(var t=0,e=["ms","moz","webkit","o"],i=0;i<e.length&&!window.requestAnimationFrame;++i)window.requestAnimationFrame=window[e[i]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[e[i]+"CancelAnimationFrame"]||window[e[i]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(e){var i=Date.now(),n=Math.max(0,16-(i-t)),o=window.setTimeout(function(){e(i+n)},n);return t=i+n,o}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(t){clearTimeout(t)})}(),Function.prototype.bind||(Function.prototype.bind=function(t){if("function"!=typeof this)throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");var e=Array.prototype.slice.call(arguments,1),i=this,n=function(){},o=function(){return i.apply(this instanceof n&&t?this:t,e.concat(Array.prototype.slice.call(arguments)))};return n.prototype=this.prototype,o.prototype=new n,o});var cMove=function(){function t(t,e){var i=this;i.x=e.x||0,i.y=e.y||0,i.initX=e.x||0,i.initY=e.y||0,i.w=e.w||r.RECTANGLE_WIDTH,i.h=e.h||r.RECTANGLE_HEIGHT,i.fill=e.fill||null,i.stroke=e.stroke||null,i.strokeWidth=e.strokeWidth||r.RECTANGLE_STROKE_WIDTH,i.selectable=e.selectable!==!1,i.draggable=e.draggable!==!1,i.type="rectangle",i.myCanvas=t}function e(t,e){if(!e.src)throw new TypeError("Src of picture is required.");var i=new Image,n=this,a=t.ratio;r.RETINA_PICTURES&&r.RETINA_X2_PATH&&a>1&&2>=a&&(e.src=o(e.src,r.RETINA_X2_PATH)),r.RETINA_PICTURES&&r.RETINA_X3_PATH&&a>2&&(e.src=o(e.src,r.RETINA_X3_PATH)),i.src=e.src,n.pic=i,n.src=e.src||"",n.x=e.x||0,n.y=e.y||0,n.initX=e.x||0,n.initY=e.y||0,n.w=e.w||0,n.h=e.h||0,n.selectable=e.selectable!==!1,n.draggable=e.draggable!==!1,n.type="picture",n.myCanvas=t,i.onload=function(){(0===n.w||0===n.h)&&(r.RETINA_PICTURES&&r.RETINA_X2_PATH&&a>1&&2>=a?(n.w=n.pic.naturalWidth/2,n.h=n.pic.naturalHeight/2):r.RETINA_PICTURES&&r.RETINA_X3_PATH&&a>2?(n.w=n.pic.naturalWidth/3,n.h=n.pic.naturalHeight/3):(n.w=n.pic.naturalWidth,n.h=n.pic.naturalHeight)),t.valid=!1}.bind(n)}function i(t,e){function i(t){for(var e=s.getPointer(t),i=e.x,n=e.y,o=s.shapes,r=o.length,a=r-1;a>=0;a--)if(s.shapes[a].contains(i,n)){var l=s.shapes[a];return s.dragoffx=i-l.x,s.dragoffy=n-l.y,s.dragging=!0,s.selection=l,void(s.valid=!1)}s.selection&&(s.selection=null,s.valid=!1)}function o(t){if(s.dragging&&s.selection.draggable){t.preventDefault();var e=s.getPointer(t);s.selection.x=e.x-s.dragoffx,s.selection.y=e.y-s.dragoffy,r.STRONG_BORDERS&&(s.selection.x<0&&(s.selection.x=0),s.selection.y<0&&(s.selection.y=0),s.selection.x+s.selection.w>s.width&&(s.selection.x=s.width-s.selection.w),s.selection.y+s.selection.h>s.height&&(s.selection.y=s.height-s.selection.h)),s.valid=!1}}function a(){s.dragging=!1}var s=this;s.canvas=t,s.width=t.width,s.height=t.height,s.ctx=t.getContext("2d"),s.ratio=1,s.shapes=[],s.rectangles=[],s.pictures=[],s.dragging=!1,s.selection=null,s.dragoffx=0,s.dragoffy=0;for(var l in e)e.hasOwnProperty(l)&&(s[l]=e[l]);if(s.draw=n.bind(s),s.stylePaddingLeft=0,s.stylePaddingTop=0,s.styleBorderLeft=0,s.styleBorderTop=0,document.defaultView&&document.defaultView.getComputedStyle){var c=document.defaultView.getComputedStyle(t,null);s.stylePaddingLeft=parseInt(c.paddingLeft,10)||0,s.stylePaddingTop=parseInt(c.paddingTop,10)||0,s.styleBorderLeft=parseInt(c.borderLeftWidth,10)||0,s.styleBorderTop=parseInt(c.borderTopWidth,10)||0}var d=document.documentElement;s.htmlTop=d.offsetTop,s.htmlLeft=d.offsetLeft,t.addEventListener("selectstart",function(t){return t.preventDefault(),!1},!1),t.addEventListener("pointerdown",i,!0),t.addEventListener("pointermove",o,!0),t.addEventListener("pointerup",a,!0),s.init(t),s.draw()}function n(){var t=this;if(!t.valid){var e=t.ctx,i=t.shapes,n=i.length;t.clear();for(var o=0;n>o;o++){var a=i[o];a.x>t.width||a.y>t.height||a.x+a.w<0||a.y+a.h<0||i[o].draw(e)}t.selection&&r.SELECTION_ON_TOP&&t.selection.draw(e),t.valid=!0}requestAnimationFrame(t.draw,t.canvas)}function o(t,e){var i=t.split("/");return i[i.length-1]=e+"/"+i[i.length-1],i.join("/")}var r={RECTANGLE_WIDTH:50,RECTANGLE_HEIGHT:50,RECTANGLE_STROKE_WIDTH:1,SHAPES_SELECTION:!0,SELECTION_COLOR:"#ffca4b",SELECTION_WIDTH:2,SELECTION_ON_TOP:!0,STRONG_BORDERS:!0,RETINA_PICTURES:!1,RETINA_X2_PATH:"x2",RETINA_X3_PATH:"x3"};return t.prototype.draw=function(t){var e=this;e.fill&&(t.fillStyle=e.fill,t.fillRect(e.x,e.y,e.w,e.h)),r.SHAPES_SELECTION&&e.selectable&&e.myCanvas.selection===e?(t.strokeStyle=r.SELECTION_COLOR,t.lineWidth=r.SELECTION_WIDTH,t.strokeRect(e.x,e.y,e.w,e.h)):e.stroke&&(t.strokeStyle=e.stroke,t.lineWidth=e.strokeWidth,t.strokeRect(e.x,e.y,e.w,e.h))},t.prototype.contains=function(t,e){var i=this;return i.x<=t&&i.x+i.w>=t&&i.y<=e&&i.y+i.h>=e},e.prototype.draw=function(t){var e=this;r.SHAPES_SELECTION&&e.selectable&&e.myCanvas.selection===e&&(t.strokeStyle=r.SELECTION_COLOR,t.lineWidth=r.SELECTION_WIDTH,t.strokeRect(e.x,e.y,e.w,e.h)),t.drawImage(e.pic,e.x,e.y,e.w,e.h)},e.prototype.contains=function(t,e){var i=this;return i.x<=t&&i.x+i.w>=t&&i.y<=e&&i.y+i.h>=e},i.prototype.addShape=function(t){var e=this;e.shapes.push(t),"rectangle"===t.type&&e.rectangles.push(t),"picture"===t.type&&e.pictures.push(t),e.valid=!1},i.prototype.clear=function(){this.ctx.clearRect(0,0,this.width,this.height)},i.prototype.getPointer=function(t){var e,i,n=this,o=n.canvas,r=0,a=0,s=window.pageYOffset;if(void 0!==o.offsetParent)do r+=o.offsetLeft,a+=o.offsetTop;while(o=o.offsetParent);return r+=n.stylePaddingLeft+n.styleBorderLeft+n.htmlLeft,a+=n.stylePaddingTop+n.styleBorderTop+n.htmlTop,-1!=navigator.userAgent.toLowerCase().indexOf("windows phone")||-1!=navigator.userAgent.toLowerCase().indexOf("windows nt")&&-1!=navigator.userAgent.toLowerCase().indexOf("touch")?(e=t.originalEvent.pageX-r,i=t.originalEvent.pageY-a+s):(e=t.clientX-r,i=t.clientY-a+s),{x:e,y:i}},i.prototype.init=function(t){var e=this,i=e.ctx,n=window.devicePixelRatio||1,o=i.webkitBackingStorePixelRatio||i.mozBackingStorePixelRatio||i.msBackingStorePixelRatio||i.oBackingStorePixelRatio||i.backingStorePixelRatio||1,r=n/o,a=t.parentNode,s=a.offsetWidth,l=a.offsetHeight;t.width=s,t.height=l,t.style.width=s+"px",t.style.height=l+"px",e.width=s,e.height=l,1!==r&&(e.ratio=r,s*=r,l*=r,t.width=s,t.height=l,e.ctx.scale(r,r))},{MyCanvas:i,Rectangle:t,Picture:e,config:r}}();