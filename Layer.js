/**
 * pipeline:
 *    line points generator -> spoke points generator?
 * 		seems unnecessary? Can generate spoke points once then clone upon rendering, letting svg transform handle
 * 		the rotation
 */
function FractalaLayerInit()
{
	class Layer
	{
		get layer_default_parameters() 
		{ return {	number_of_spokes:6, 
						spoke_length:50,
						spoke_rot_offset:0,
						opacity:1,
						radius:20,	// todo: layer types (this is circles specific)
						stroke_width:1,
						stroke:"hsl(0,100%,50%)",	// default red
						fill:"",	// "" == transparent
			}; 
		};

		get className()	{ return "Layer"; };

		// ------------------------------------------------------------
		constructor(parameters)
		{
			Object.assign(layer, this.layer_default_parameters);
			Object.assign(layer, parameters);
		}
	};

	return { Layer:Layer };
};
