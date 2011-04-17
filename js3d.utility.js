function js3dUtility(){};

$.extend(js3dUtility.prototype, {	
		/**
		 * Obsługa debugowania
		 */
		log: function(a)
		{
			if($.fn.js3d.options.log == 1) {} //@todo
			if($.fn.js3d.options.log == 2) 
			{
				// failsafe if firebug is disabled
				try {
					console.log(a);
				} catch (e) {
					$.fn.js3d.options.log = 1;
				}
			}
		},

		/**
		 * Obs�uga debugowania
		 */
		log_alert: function(a)
		{
			if($.fn.js3d.options.log == 0) {alert(a);}
			else this.log(a);
		},

		/**
		 * Rysuje siatke 2d
		 */
	  	drawGrid: function()
	  	{
			$.fn.js3d.context.beginPath();
			
			$.fn.js3d.context.fillStyle = $.fn.js3d.options.gridBackground;
			$.fn.js3d.context.fillRect(0,0,$.fn.js3d.options.width,$.fn.js3d.options.height);
			
			for (var x = 0.5; x < $.fn.js3d.options.width; x += $.fn.js3d.options.gridWidth) {
			  $.fn.js3d.context.moveTo(x, 0);
			  $.fn.js3d.context.lineTo(x, $.fn.js3d.options.height);
			}
			
			for (var y = 0.5; y < $.fn.js3d.options.height; y += $.fn.js3d.options.gridWidth) {
			  $.fn.js3d.context.moveTo(0, y);
			  $.fn.js3d.context.lineTo($.fn.js3d.options.width, y);
			}
			$.fn.js3d.context.closePath();
			
			$.fn.js3d.context.strokeStyle = $.fn.js3d.options.gridStroke;
			$.fn.js3d.context.stroke();	

	 	},

		drawAxis: function()
		{
			$.fn.js3d.context.beginPath();

		    $.fn.js3d.options.cos_x;

		  	var x_shift = $.fn.js3d.options.width/2;
			var y_shift = $.fn.js3d.options.height/2;

			$.fn.js3d.context.moveTo(-1* $.fn.js3d.options.width + x_shift, y_shift);
			$.fn.js3d.context.lineTo($.fn.js3d.options.width + x_shift, y_shift);

			$.fn.js3d.context.moveTo(x_shift, -1* $.fn.js3d.options.height + y_shift);
			$.fn.js3d.context.lineTo(x_shift, $.fn.js3d.options.height + y_shift);

			$.fn.js3d.context.closePath();
			
			$.fn.js3d.context.lineWidth   = 3;
			$.fn.js3d.context.stroke();	
			$.fn.js3d.context.lineWidth   = 1;	
		},
		
		clear: function()
		{
			this.width = this.width+1;
			this.width = this.width-1;
		},
		
		getPrecision: function(scinum) {
		  var arr = new Array();
		  // Get the exponent after 'e', make it absolute.  
		  arr = scinum.split('e');
		  var exponent = Math.abs(arr[1]);
		
		  // Add to it the number of digits between the '.' and the 'e'
		  // to give our required precision.
		  var precision = new Number(exponent);
		  arr = arr[0].split('.');
		  precision += arr[1].length;
		
		  return precision;
		},

		
		scientificNotation2Float: function(s)
		{
			if (s.match(/^[-+]?[1-9]\.[0-9]+e[-]?[1-9][0-9]*$/)) {
  				s = (+s).toFixed(this.getPrecision(s));
			}
			return s;
		},
		

		farZcompare: function(p1,p2)
		{
			return p2.far_z - p1.far_z;
		},	
		
					
	});

