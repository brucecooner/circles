/**
 * pipeline:
 *    line points generator -> spoke points generator?
 * 		seems unnecessary? Can generate spoke points once then clone upon rendering, letting svg transform handle
 * 		the rotation
 */
function MandalaLayerInit()
{
	class Layer
	{
		get default_parameters() 
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
			Object.assign(this, this.default_parameters);
			Object.assign(this, parameters);
		}
	};

	return Layer;
};
