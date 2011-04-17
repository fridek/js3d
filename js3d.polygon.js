/**
* Polygon object
*
* used for every 2d shape drawn in 3d space
*/
function js3dPolygon(id, vcount)
{
	this.id 			= id;
	this.vcount 		= vcount;
    this.vertex 		= new Array(); // original vertex array, converted to vertex transformed by Object matrix
    this.vertexC 		= null; // vertex transformed by Camera position
	this.vertex2d		= null; // vertex converted to 2d view
    this.fill 			= "rgba(200,200,200,1)";
	this.stroke 		= "rgba(50,50,50,1)";
	
	this.normalVector = new Array();
	this.visible = true;
	
	this.far_z;
 }

$.extend(js3dPolygon.prototype, {

	  applyPositionMatrix: function(positionMatrix)
	  {
	  	var math = new js3dMath();
		
		for (var v in this.vertex) {
			// object position matrix
			this.vertex[v] = math.MatrixVectorMulti(positionMatrix, this.vertex[v]);
		}	  	
	  },
	
	  /*
	  * For performance reason here we also compute far_z
	  */
	  applyCameraPosition: function(cameraPosition)
	  {
	  	var math = new js3dMath();

		for (var v in this.vertex) {
			// object position matrix
			this.vertexC[v] = math.MatrixVectorMulti(cameraPosition, this.vertex[v]);
			// compute far_z
			if(this.vertexC[v].z > this.far_z) {this.far_z = this.vertexC[v].z;}
		}	 	  	
	  },

	  addVertexArray: function(arr)
	  {
	  	this.addVertex(arr.x,arr.y,arr.z);
	  },
	
	  addVertex: function(x,y,z)
	  {
	  	this.vertex.push({
			x: x,
			y: y,
			z: z
		});
	  },
	  
	  getNormal: function()
	  {
	  	var math = new js3dMath();
		
		var v1 = new Array();
		var v2 = new Array();
		
		v1.x = this.vertex2d[0].x - this.vertex2d[1].x; 
		v1.y = this.vertex2d[0].y - this.vertex2d[1].y; 
		v1.z = 0; 
		
		v2.x = this.vertex2d[2].x - this.vertex2d[0].x; 
		v2.y = this.vertex2d[2].y - this.vertex2d[0].y; 
		v2.z = 0; 
			
		return math.VectorCrossProduct(v1,v2)	
	  },

	  process: function(positionMatrix)
	  {
	  	this.far_z = -1000000;
		
	  	if(this.vertexC == null) // no vector-camera matrix - before first rendering
		{
			this.vertexC = new Array();
			this.applyPositionMatrix(positionMatrix);
		}
		
		this.applyCameraPosition($.fn.js3d.camera.positionMatrixNegative);
		
	  	var math = new js3dMath();

		this.vertex2d = $.fn.js3d.camera.calc2d(this.vertexC);		

	  	if(this.getNormal().z <= 0)
		{
			this.visible = false;
		}
		else
		{
			this.visible = true;
		}
		
	  },
	  
	  draw: function()
	  {
		if(!this.visible) return;

   		var context = $.fn.js3d.context; // optimisation
    
		var x_shift = $.fn.js3d.options.width/2;
		var y_shift = $.fn.js3d.options.height/2;

	  	context.beginPath();
		
		context.moveTo(this.vertex2d[0].x + x_shift, this.vertex2d[0].y + y_shift);
		for (var v in this.vertex2d)
		{
			context.lineTo(this.vertex2d[v].x + x_shift, this.vertex2d[v].y + y_shift);
		}	
		context.lineTo(this.vertex2d[0].x + x_shift, this.vertex2d[0].y + y_shift);
		
		context.closePath();
		
		context.strokeStyle = this.stroke;
		context.stroke();
		context.fillStyle = this.fill; 
		context.fill();	
	  }
	});


	
