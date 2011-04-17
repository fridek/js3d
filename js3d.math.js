/**
* Polygon object
*
* used for every 2d shape drawn in 3d space
*/
function js3dMath(){};

$.extend(js3dMath.prototype,{
		/**
		 * Multiply 1x4 vector by 4x4 matrix
		 */
		MatrixVectorMulti: function(m, tv)
		{
			var v = new Array();
			v = [tv.x, tv.y, tv.z, 1];
			
			var nv = new Array();
			return {
				x: m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2] + m[0][3] * v[3],
				y: m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2] + m[1][3] * v[3],
				z: m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2] + m[2][3] * v[3]
			};
		},
		
		MatrixMatrixMulti: function(a, b)
		{
			var nm = [
				[
					a[0][0]*b[0][0] + a[0][1]*b[1][0] + a[0][2]*b[2][0] + a[0][3]*b[3][0],
					a[0][0]*b[0][1] + a[0][1]*b[1][1] + a[0][2]*b[2][1] + a[0][3]*b[3][1],
					a[0][0]*b[0][2] + a[0][1]*b[1][2] + a[0][2]*b[2][2] + a[0][3]*b[3][2],
					a[0][0]*b[0][3] + a[0][1]*b[1][3] + a[0][2]*b[2][3] + a[0][3]*b[3][3]
				],
				[
					a[1][0]*b[0][0] + a[1][1]*b[1][0] + a[1][2]*b[2][0] + a[1][3]*b[3][0],
					a[1][0]*b[0][1] + a[1][1]*b[1][1] + a[1][2]*b[2][1] + a[1][3]*b[3][1],
					a[1][0]*b[0][2] + a[1][1]*b[1][2] + a[1][2]*b[2][2] + a[1][3]*b[3][2],
					a[1][0]*b[0][3] + a[1][1]*b[1][3] + a[1][2]*b[2][3] + a[1][3]*b[3][3]
				],
				[			
					a[2][0]*b[0][0] + a[2][1]*b[1][0] + a[2][2]*b[2][0] + a[2][3]*b[3][0],
					a[2][0]*b[0][1] + a[2][1]*b[1][1] + a[2][2]*b[2][1] + a[2][3]*b[3][1],
					a[2][0]*b[0][2] + a[2][1]*b[1][2] + a[2][2]*b[2][2] + a[2][3]*b[3][2],
					a[2][0]*b[0][3] + a[2][1]*b[1][3] + a[2][2]*b[2][3] + a[2][3]*b[3][3]
				],
				[			
					a[3][0]*b[0][0] + a[3][1]*b[1][0] + a[3][2]*b[2][0] + a[3][3]*b[3][0],
					a[3][0]*b[0][1] + a[3][1]*b[1][1] + a[3][2]*b[2][1] + a[3][3]*b[3][1],
					a[3][0]*b[0][2] + a[3][1]*b[1][2] + a[3][2]*b[2][2] + a[3][3]*b[3][2],
					a[3][0]*b[0][3] + a[3][1]*b[1][3] + a[3][2]*b[2][3] + a[3][3]*b[3][3]
				]
			];
			
			return nm;
		},

		VectorCrossProduct: function(v1,v2)
		{
			return {
				x: v1.y * v2.z - v1.z * v2.y,
				y: v1.z * v2.x - v1.x * v2.z,
				z: v1.x * v2.y - v1.y * v2.x
			};
		},
		
		getRotationMatrix : function(rotateX, rotateY, rotateZ)
		{
		  	//conversion
		  	rotateX = rotateX * Math.PI/180;
			rotateY = rotateY * Math.PI/180;
			rotateZ = rotateZ * Math.PI/180;
								
			var rotationMatrixZ = new Array(
				[Math.cos(rotateZ), -1*Math.sin(rotateZ), 0, 0],
				[Math.sin(rotateZ), Math.cos(rotateZ), 0, 0],
				[0, 0, 1, 0],
				[0, 0, 0, 1]
			);
			
			var rotationMatrixX = new Array(
				[1, 0, 0, 0],
				[0, Math.cos(rotateX), -1*Math.sin(rotateX), 0],
				[0, Math.sin(rotateX), Math.cos(rotateX), 0],
				[0, 0, 0, 1]
			);
				
			var rotationMatrixY = new Array(
				[Math.cos(rotateY), 0, Math.sin(rotateY), 0],
				[0, 1, 0 , 0],
				[-1*Math.sin(rotateY), 0, Math.cos(rotateY), 0],
				[0, 0, 0, 1]
			);			
			
			var tmp1 = this.MatrixMatrixMulti(rotationMatrixY, rotationMatrixZ);
			var tmp2 = this.MatrixMatrixMulti(rotationMatrixX, tmp1);
			
			return tmp2;
		}
	});

