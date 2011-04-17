/**
* Camera object
*
* used for every 2d shape drawn in 3d space
*/
var js3dCamera = function()
{
	this.positionMatrix = new Array(
		[1, 0, 0, -1],
		[0, 1, 0, 0],
		[0, 0, 1, -3],
		[0, 0, 0, 1]
	);
	
	this.basePositionMatrix = new Array(
		[1, 0, 0, -1],
		[0, 1, 0, 0],
		[0, 0, 1, -3],
		[0, 0, 0, 1]
	);	
	
	this.rotateX = 0;
	this.rotateY = 0;
	this.rotateZ = 0;
	
	this.positionMatrixNegative = new Array();
	
	this.znear = 3;

	this.display_scale = $.fn.js3d.options.displayScale;
	
	this.width = $.fn.js3d.options.width;
	this.height = $.fn.js3d.options.height;
 }

$.extend(js3dCamera.prototype, {
	  calc2d: function(vertexC)
	  {
		var f = $.fn.js3d.options.f;

		var x,y,z;
		
		var vertex2d = new Array();
		
		for (var v in vertexC)
		{
		  if (vertexC[v].z) {
		  	z = vertexC[v].z;
		  }
		  else {
		  	z = 0;
		  }

		  // performance and clean code
		  x = vertexC[v].x;
		  y = vertexC[v].y;


		  x = (this.znear/z*x) * this.display_scale;
		  y = (this.znear/z*y) * this.display_scale;
		  z = z*this.display_scale;
		  
		  vertex2d.push({
			x:x,
			y:y
		  });
		}
		
		return vertex2d;
	  },
	  
      setZoomLevel: function(level)
		{
			this.basePositionMatrix[2][3] = level;
			
			this.positionMatrix[2][3] = this.basePositionMatrix[2][3];
		},
		
	  moveCamera: function(x,y, zoom)
		{
			this.basePositionMatrix[0][3] = this.basePositionMatrix[0][3] + x/(20*zoom);
			this.basePositionMatrix[1][3] = this.basePositionMatrix[1][3] + y/(20*zoom);
			
			this.positionMatrix[0][3] = this.basePositionMatrix[0][3];
			this.positionMatrix[1][3] = this.basePositionMatrix[1][3];
		},
		
	  
	  rotateCamera: function(rotateX, rotateY, rotateZ)
	  {
		var m = new js3dMath();
		
		var tmp = m.getRotationMatrix(rotateX, rotateY, rotateZ);
		
	  	this.positionMatrix = m.MatrixMatrixMulti(this.basePositionMatrix, tmp);
	  },
	  	
	  negativeMatrixCalc: function()
	  {
	  	for (var i in this.positionMatrix)
		{
			this.positionMatrixNegative[i] = new Array();
			for (var j in this.positionMatrix[i])
			{
				this.positionMatrixNegative[i][j] = this.positionMatrix[i][j];
			}	
		}	

	  	this.positionMatrixNegative[0][3] = -1*this.positionMatrix[0][3];
		this.positionMatrixNegative[1][3] = -1*this.positionMatrix[1][3];
		this.positionMatrixNegative[2][3] = -1*this.positionMatrix[2][3];

	  },		
});


	

