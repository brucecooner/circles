/**
 * pipeline:
 *    line points generator -> spoke points generator?
 * 		seems unnecessary? Can generate spoke points once then clone upon rendering, letting svg transform handle
 * 		the rotation
 */
function MandalaLayerInit(petal_class)
{
	class Layer
	{
		get default_parameters() 
		{ return {	number_of_spokes:6, 
						number_of_points:1,
						spoke_length:50,
						spoke_rot_offset:0,
						spoke_end_rot:0,
						opacity:1,
						radius:20,	// todo: layer types (this is circles specific)
						stroke_width:1,
						stroke:"hsl(0,100%,50%)",	// default red
						fill:"none",	// "none" == transparent
			}; 
		};

		get className()	{ return "Layer"; };

		get strokeOn()		{ return this.hasOwnProperty("stroke") && this.stroke !== "none" };
		get fillOn()		{ return this.hasOwnProperty("fill") && this.fill !== "none" };

		// ------------------------------------------------------------
		constructor(parameters)
		{
			Object.assign(this, this.default_parameters);
			Object.assign(this, parameters);

			this.petal_class = petal_class;

			var petal_params = {
				number_of_points:20,
				length:150,
				radius:5,
		
				end_rot:0,
				amplitude:40,				// if >0, points are along a sine curve with this amplitude
				sine_length:Math.PI,	// rotational distance of sine x coordinate
			};

			this.petal_prototype = new this.petal_class(petal_params);
		}
	};

	return Layer;
};
