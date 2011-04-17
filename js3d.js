(function($){
 $.fn.js3d = function(xmlfile, options) {

  var defaults = {
   width:           800,  
   height:          600,
   border:          '1px solid #000',
   gridWidth:		10,
   theme:			'light',		// light, matrix
   log:				2,				// 0 - none, 1 - into div, 2 - into firebug

   displayScale: 	100,

   perspective:		'perspective',	// perspective, oblique
   // for oblique only
   x_axis_angle:	30,				
   y_axis_angle:	90,
   z_axis_angle:	-30,
  };
  var options = $.extend(defaults, options);
  
  var calcView = function(x_axis_angle, y_axis_angle, z_axis_angle)
  {
  	  options.x_axis_angle = x_axis_angle;
	  options.y_axis_angle = y_axis_angle;
	  options.z_axis_angle = z_axis_angle;
	
	  options.cos_x = Math.cos(x_axis_angle* Math.PI/180);
	  options.cos_y = Math.cos(y_axis_angle* Math.PI/180);
	  options.cos_z = Math.cos(z_axis_angle* Math.PI/180);
	  options.sin_x = Math.sin(x_axis_angle* Math.PI/180);
	  options.sin_y = Math.sin(y_axis_angle* Math.PI/180);
	  options.sin_z = Math.sin(z_axis_angle* Math.PI/180);  	
  };
  
  calcView(options.x_axis_angle,options.y_axis_angle,options.z_axis_angle);
  
  if(options.theme == 'light')
  {
  	options.gridStroke = '#eee';
	options.gridBackground = '#fff';
  }

  if(options.theme == 'matrix')
  {
  	options.gridStroke = '#7fff00';
	options.gridBackground = '#000';
  }

  var canvas;
  var context;
  var rotate = 0;

  var shapes = new Array();


  var drawFrame = function()
	{
		 $.fn.js3d.camera.negativeMatrixCalc();
		
		 var utils = new js3dUtility();
		 utils.clear();
		 utils.drawGrid();
		 utils.drawAxis();
		 for(var i in shapes) {shapes[i].process(utils);}
		 		 
		 shapes.sort(utils.farZcompare);
		 
		 for(var i in shapes){shapes[i].draw();}
	};

  return this.each(function() {
    /**
    * Set size of element
    */
    this.width = options.width;
    this.height = options.height;
    this.style.border = options.border;
  
    // Check the element is in the DOM and the browser supports canvas
    if(this.getContext) {
        // Initaliase a 2-dimensional drawing context
        context = this.getContext('2d');
		
		// Allow global access
		$.fn.js3d.context = context;
		$.fn.js3d.options = options;
		
		//remove later
		$.fn.js3d.cameraMatrix = this.cameraMatrix;
		
		$.fn.js3d.camera = new js3dCamera();
		
		var utils = new js3dUtility();

		this.clear = utils.clear();
		$.fn.js3d.log = utils.log;
	  	
		
		$.get(xmlfile, function(data) {
		  //assuming only one scene!
		  var scene = $('visual_scene', data);
			
		  $(data).find('geometry').each(function(i) {
				var geometry = $(this);
				shapes[i] = new js3dShape(geometry.attr('id').slice(0,-5));
				
				shapes[i].parseVertex($('#' + shapes[i].id + '-mesh-positions-array', geometry).html());
				shapes[i].parsePolygons($('polylist vcount', geometry).html(), $('polylist p', geometry).html());
				//shapes[i].parseNormalVectors($('#' + shapes[i].id + '-mesh-normals-array', geometry).html());
				shapes[i].parsePosition($('#' + shapes[i].id, scene));
			});

			// draw initial frame
			drawFrame();
			
			// log all shapes - after processing, so all data are already calculated	
			$.fn.js3d.log(shapes);
		});
		
        /**
        * camera rotate support
        *
        * binding mouse events
        */
		var move, moveX, moveY = 0;
		var zoomLevel = $.fn.js3d.camera.positionMatrix[2][3];

        $(this).mousedown(function(event) {
          move = 1;
		  moveX = event.pageX;
		  moveY = event.pageY;
		  //console.log('click at (' + moveX + ',' + moveY + ')');
        });
		
        $(this).mousemove(function(event) {
          if (move == 1) {
		 	var dMoveX = event.pageX - moveX;
			var dMoveY = event.pageY - moveY;
			moveX = event.pageX;
		  	moveY = event.pageY;		  	
			
			$.fn.js3d.camera.moveCamera(dMoveX, dMoveY, zoomLevel);
			drawFrame();
			
			//console.log('move at (' + dMoveX + ',' + dMoveY + ')');
          }
        });
		
        $(this).mouseup(function(event) {
          move = 0;
		  moveX = event.pageX;
		  moveY = event.pageY;
		  //console.log('unclickclick at (' + moveX + ',' + moveY + ')');		  
        });		

	    $(this).bind('mousewheel', function(event, delta) {
	            var dir = delta > 0 ? true : false,
	                vel = Math.abs(delta);
				if(dir) {zoomLevel = zoomLevel + 1;}
				else {zoomLevel = zoomLevel - 1;}
				if(zoomLevel >= 0) zoomLevel = -1;				
				$.fn.js3d.camera.setZoomLevel(zoomLevel);
				
				drawFrame();
	            return false;
	        });
			
			
		var rotateX = 0;
		var rotateY = 0;
		var rotateZ = 0;
			
		$(window).keydown(function(event) {
		  var key = event.keyCode;	
		
		  if(key >= 37 && key <= 40) {event.preventDefault();}
			
		  if (key  == '87' || key  == '38') {rotateX = rotateX+1;}
		  if (key  == '83' || key  == '40') {rotateX = rotateX-1;}
		  if (key  == '65' || key  == '37') {rotateY = rotateY+1;}
		  if (key  == '68' || key  == '39') {rotateY = rotateY-1;}
		  if (key  == '82') {rotateZ = rotateZ+1;}
		  if (key  == '70') {rotateZ = rotateZ-1;}

		  $.fn.js3d.camera.rotateCamera(rotateX, rotateY, rotateZ);
		  drawFrame();
		});	
    }  
  
  	$.fn.js3d.drawFrame = drawFrame;
  
  });
 };
})(jQuery);
