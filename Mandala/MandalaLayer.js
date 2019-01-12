/**
 * pipeline:
 *    line points generator -> spoke points generator?
 * 		seems unnecessary? Can generate spoke points once then clone upon rendering, letting svg transform handle
 * 		the rotation
 */

/*
TODO:
	-validate parameters in constructor (everywhere really)
	-add testIntegrity() function
*/
function initMandalaLayerClass()
{
	var BasePointsGeneratorFn = init_BasePointsGenerator();

	// --------------------------
	var default_layer_parameters = {
		// layer
		number_of_spokes:	6,
		length:				50,
		mirror:false,	// if true, base points are mirrored 

		// base points
		number_of_points:	1,
		sine_length:		Math.PI,
		amplitude:			0,

		spoke_rot_offset:	0,

		// circle related
		radius:				20,

		// style related
		stroke_width:		1,
		stroke:"hsl(0,100%,50%)",	// default red
		fill:"none",	// "none" == transparent
	};

	// ----------------------------
	var layer_validators = {
		number_of_spokes:	{ max:100, min:1 },
		length:				{ max:500, min:0 },
		mirror:false,	// if true, base points are mirrored 
		// base points
		number_of_points:	{ min:1, max:150 },	// number of points along petal
		sine_length:		{ min:Math.PI, max:Math.PI*4 }, // hard to explain
		amplitude:			{ min:0, max:100 },
		spoke_rot_offset:	{ min:-Math.PI, max:Math.PI },
		// circle related
		radius:				{ min:2, max:500 },
		// style related
		stroke_width:		{ min:1, max:20 },
	};

	// =========================================================================
	// =========================================================================
	class MandalaLayer
	{
		get defaultLayerParameters()
		{ return default_layer_parameters; };

		get LayerValidators()
		{	return layer_validators; };
		
		get className()					{ return "MandalaLayer"; };
		// get basePointsGeneratorFn()	{ return BasePointsGeneratorFn; };

		get strokeOn()		{ return this.hasOwnProperty("stroke") && this.stroke !== "none" };
		get fillOn()		{ return this.hasOwnProperty("fill") && this.fill !== "none" };

		get validate_on_every_property_set()	{ return true; }

		// ------------------------------------------------------------
		// ------------------------------------------------------------
		constructor(parameters)
		{
			this.log_channel = this.className;
			var validator_functions = generateValidatorFunctions(this.LayerValidators);
			this.validateParametersFn = validator_functions.validateObject;
			this.validateValueFn = validator_functions.validateValue;

			Object.assign(this, this.defaultLayerParameters);

			if (parameters)
			{
				// just get parameters we are interested in...
				Object.keys(this.defaultLayerParameters).forEach( (current_key) => {
					if (parameters.hasOwnProperty(current_key))
					{
						this[current_key] = parameters[current_key];
					}
				});
			}
			
			// not strictly graphically related parameters we are interested in
			if (parameters.hasOwnProperty("name"))
			{
				this.name = parameters.name;
			}

			this.base_points = [];
			this.points = [];

			// specifies action on setting of specific parameters
			this.property_set_callbacks = {
				// base points affected
				number_of_points:		function() { this.generateBasePoints(); this.generatePoints(); }.bind(this),
				sine_length:			function() { this.generateBasePoints(); this.generatePoints(); }.bind(this),
				amplitude:				function() { this.generateBasePoints(); this.generatePoints(); }.bind(this),
				// non-base points affected
				number_of_spokes:		function() { this.generatePoints(); }.bind(this),
				length:					function() { this.generatePoints(); }.bind(this),				
				};

			this.generateBasePoints();
			this.generatePoints();
		};

		// ------------------------------------------------------------
		setProperty(property_name, value)
		{
			console.log(this.log_channel, `setProperty(${property_name},${value})`);

			if (this.validate_on_every_property_set)
			{
				var result = this.validateParameter(property_name, value);

				if (false == result.passed)
				{
					console.log(this.log_channel, "NOT setting value");
					return;
				}
			}

			this[property_name] = value;

			if (this.property_set_callbacks.hasOwnProperty(property_name))
			{
				this.property_set_callbacks[property_name]();
			}
		}

		// ------------------------------------------------------------
		generateBasePoints()
		{
			this.base_points = [];
			this.base_points = BasePointsGeneratorFn(this);
		}

		// ------------------------------------------------------------
		generatePoints()
		{
			// need a better name for this?
			this.points = [];

			// transform base points into 'layer' space
			// todo: function this!
			this.base_points.forEach( (current_base_point) => {
				var cur_point = {};
				// X
				cur_point.x = current_base_point.x * this.length;
				// Y
				if (this.amplitude > 0)
				{
					cur_point.y = current_base_point.y * this.amplitude;
				}
				else
				{
					cur_point.y = 0;
				}
				this.points.push(cur_point);
			});
		};

		// ------------------------------------------------------------
		toJSON()
		{
			var return_obj = {};

			return_obj.name = this.name;
			Object.keys(this.defaultLayerParameters).forEach( (current_property_name) => {
				return_obj[current_property_name] = this[current_property_name];
			});

			return return_obj;
		};

		// ------------------------------------------------------------
		validateParameter(name, value)
		{
			var results = this.validateValueFn(name, value);

			if ( results.no_validator)
			{
				console.log(this.log_channel, `WARNING: validaing property "${name}", but no validator exists`);
			}
			else if (results.invalid_value)
			{
				console.log(this.log_channel, `property "${name}" out of range`);
			}

			return results;
		}

		// ------------------------------------------------------------
		// testing/validation
		// ------------------------------------------------------------
		// note : this does FULL validation on parameters
		validateParameters(parameters)
		{
			if (!parameters)
			{
				parameters = this;
			}

			var result = this.validateParametersFn(parameters);

			if (false == result.passed)
			{
				console.log(this.log_channel, "validation failed");
				if (result.missing_properties.length)
				{
					console.log(this.log_channel, `missing properties: ${result.missing_properties.join()}`);
				}
				if (result.invalid_values.length)
				{
					console.log(this.log_channel, `invalid properties: ${result.invalid_values.join()}`);
				}
				if (result.non_validated_properties.length)
				{
					console.log(this.log_channel, `non-validated properties: ${result.non_validated_properties.join()}`);
				}
			}

			return result;
		};

	};	// end MandalaLayer


	return MandalaLayer;
};
