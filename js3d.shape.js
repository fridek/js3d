/**
 * @author fridek
 */
/**
* Shape object
*/
function js3dShape(id)
{
	this.id 			= id;
	this.polygonCount	= 0;
	this.polygons 		= new Array();
	
	this.vertex			= new Array();
	this.vertexCount	= 0;
	
	this.far_z			= 0;
	
	this.positionMatrix = new Array();	
 }

$.extend(js3dShape.prototype, {

	  addPolygon: function(poly)
	  {
	  	this.polygons.push(poly);
	  },
	  
	  parseVertex: function(vlist)
	  {
	  	var tmpVertex = vlist.split(' ');
		this.vertexCount = tmpVertex.length;
		
		for(var i = 0; i < this.vertexCount; i=i+3)
		{
			this.vertex.push({
				x: tmpVertex[i],
				y: tmpVertex[i+1],
				z: tmpVertex[i+2]
			});
		}
	  },
	  
	  /*
	  parseNormalVectors: function(nlist)
	  {
	  	var utils = new js3dUtility();
	  	var tmpNormals = nlist.split(' ');
		
		for(var i = 0; i < this.polygons.length*3; i=i+3)
		{
			this.polygons[i/3].normalVector = {
				x: utils.scientificNotation2Float(tmpNormals[i]),
				y: utils.scientificNotation2Float(tmpNormals[i+1]),
				z: utils.scientificNotation2Float(tmpNormals[i+2])
			}
		}
	  },	  
	  */
	  parsePolygons: function(polycount, vertexlist)
	  {
	  	var tmpPolycount = polycount.split(' ');
		this.polygonCount = tmpPolycount.length;
		
		var tmpVlist = vertexlist.split(' ');
		var vlist_it = 0;
		
		/**
		 * for every polygon
		 */
		for(var i = 0; i < this.polygonCount; i++)
		{
			if (tmpPolycount[i] > 0) 
			{
				var p = new js3dPolygon(this.id + '_polygon_' + i, tmpPolycount[i]);
				
				for(var j = 0; j < tmpPolycount[i]; j++)
				{
					p.addVertexArray(this.vertex[tmpVlist[vlist_it]]);
					vlist_it = vlist_it + 2;
				}
				
				this.addPolygon(p);
			}
		}
	  },

	  parsePosition: function(position)
	  {
		var translate = $('translate', position).html().split(' ');
		
		var rotate = new Array();
		rotate[0] = $('rotate[sid="rotationX"]', position).html().split(' ');
		rotate[1] = $('rotate[sid="rotationY"]', position).html().split(' ');
		rotate[2] = $('rotate[sid="rotationZ"]', position).html().split(' ');
		
		var m = new js3dMath();
		var rotation = m.getRotationMatrix(rotate[0][3],rotate[1][3],rotate[2][3]);

		var scale = $('scale', position).html().split(' ');
		
		this.positionMatrix = new Array(
			[scale[0], 0, 0, translate[0]],
			[0, scale[1], 0, translate[1]],
			[0, 0, scale[2], translate[2]],
			[0, 0, 0, 1]
		);
		
		this.positionMatrix = m.MatrixMatrixMulti(this.positionMatrix, rotation);	
	  },
	  
	  process: function(utils)
	  {
	  	for(var i in this.polygons)
		{
			this.polygons[i].process(this.positionMatrix);
		}	

	  	this.polygons.sort(utils.farZcompare);
	  },
	  
	  draw: function()
	  {
			for(var i in this.polygons)
			{
			    this.polygons[i].draw();
			}						
	  }
	});


	
