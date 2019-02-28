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
		outer_radius:		50,		// outermost base point
		inner_radius:		0,			// where base points begin (NORMALIZED, scalar for outer_radius)
		mirror:				false,	// if true, base points are mirrored 

		// base points
		number_of_points:	1,			// how many points occur from 0..1
		sine_length:		Math.PI,
		amplitude:			0,

		spoke_rot_offset:	0,

		base_points_type: 'straight',	// one of 'straight', 'sine', ???

		// circle related
		// circles' radius at beginning of ray
		start_radius:				20,
		// circles' radius at end of ray
		end_radius:					20,

		// style related
		stroke_width:		1,
		stroke:"hsl(0,100%,50%)",	// default red
		fill:"none",	// "none" == transparent
	};

	// ----------------------------
	var layer_validators = {
		number_of_spokes:	{ max:100, min:1 },
		outer_radius:		{ max:500, min:0 },
		inner_radius:		{ max:1.0, min:0 },
		number_of_points:	{ min:1, max:150 },	
		sine_length:		{ min:Math.PI, max:Math.PI*4 },
		amplitude:			{ min:0, max:100 },
		spoke_rot_offset:	{ min:0, max:Math.PI * 2},
		// circle related
		start_radius:		{ min:2, max:500 },
		end_radius:			{ min:2, max:500 },
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

			// set up special validate functions
			// this.LayerValidators.outer_radius.validate_fn = this.validateOuterRadius.bind(this);
			// this.LayerValidators.inner_radius.validate_fn = this.validateInnerRadius.bind(this);

			var validator_functions = generateValidatorFunctions(this.LayerValidators);
			this.validateParametersFn = validator_functions.validateObject;
			this.validateValueFn = validator_functions.validateValue;

			// this.special_validator_fns = {
			// 	"inner_radius": this.validateInnerRadius.bind(this),
			// 	"outer_radius": this.validateOuterRadius.bind(this),
			// };
		
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

				if (parameters.hasOwnProperty("name"))
				{
					this.name = parameters.name;
				}
			}

			this.base_points = [];
			this.points = [];

			// base point generators
			this.base_point_generators_map = {
				'straight': this.generateBasePointsStraight.bind(this),
				'sine': this.generateBasePointsSine.bind(this),
			};

			// specifies action on setting of specific parameters
			this.property_set_callbacks = {
				// base points affected
				number_of_points:		function() { this.regenerate_base_points = true; }.bind(this),
				sine_length:			function() { this.regenerate_base_points = true; }.bind(this),
				amplitude:				function() { this.regenerate_base_points = true; }.bind(this),
				// non-base points affected
				number_of_spokes:		function() { this.regenerate_points = true; }.bind(this),
				outer_radius:			function() { this.regenerate_points = true; }.bind(this),
				inner_radius:			function() { this.regenerate_points = true; }.bind(this),
				mirror:					function() { this.regenerate_points = true; }.bind(this),
				};

			this.generateBasePoints();
			this.generatePoints();

			this.regenerate_base_points = false;
			this.regenerate_points = false;
		};	// end constructor

		// ------------------------------------------------------------
		preRender()
		{
			if (this.regenerate_base_points)
			{
				this.generateBasePoints();
				this.regenerate_points = true;
			}

			if (this.regenerate_points)
			{
				this.generatePoints();
			}

			this.regenerate_base_points = false;
			this.regenerate_points = false;
		}

		// ------------------------------------------------------------
		setProperty(property_name, value)
		{
			console.log(this.log_channel, `setProperty(${property_name},${value})`);
			if (typeof property_name === "undefined")
			{
				throw `setProperty() called with undefined property_name`;
				return;
			}

			if (this.validate_on_every_property_set)
			{
				var result = this.validateParameter(property_name, value);

				if (false == result.passed)
				{
					console.log(this.log_channel, "validation failed: " + result);
					console.log(this.log_channel, "NOT setting value");
					return;
				}
				else
				{
					console.log(this.log_channel, "parameter validation passed");
				}
			}

			this[property_name] = value;

			if (this.property_set_callbacks.hasOwnProperty(property_name))
			{
				this.property_set_callbacks[property_name]();
			}
		}

		// ------------------------------------------------------------
		generateBasePointsStraight()
		{
			console.log(this.log_channel, "generateBasePointsStraight()");
		}

		// ------------------------------------------------------------
		generateBasePointsSine()
		{
			console.log(this.log_channel, "generateBasePointsStraight()");
		}

		// ------------------------------------------------------------
		generateBasePoints()
		{
			console.log(this.log_channel, "generateBasePoints()");

			if (this.base_point_generators_map.hasOwnProperty(this.base_points_type))
			{
				this.base_point_generators_map[this.base_points_type]();
			}

			this.base_points = [];

			this.base_points = BasePointsGeneratorFn(this);
		}

		// ------------------------------------------------------------
		generatePoints()
		{
			// need a better name for this?
			this.points = [];

			var inner_radius_calculated = this.inner_radius * this.outer_radius;
			var range_scale = this.outer_radius - inner_radius_calculated;

			// transform base points into 'layer' space
			// todo: function this!
			this.base_points.forEach( (current_base_point) => {
				var cur_point = {};
				// X
				cur_point.x = current_base_point.x * range_scale + inner_radius_calculated; 
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

				// do not mirror points very very near x-axis
				if (this.mirror && Math.abs(cur_point.y) > 0.001)
				{
					var mirror_point = { x:cur_point.x, y:cur_point.y };
					mirror_point.y *= -1;
					this.points.push(mirror_point);
				}
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
			var result = this.validateValueFn(name, value);

			// TODO: should do this log call somewhere else
			if (false == result.passed)
			{
				// console.log(this.log_channel, `property "${name}" out of range`);
				console.log(this.log_channel, result.reason);
			}

			return result;
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
				Object.keys(result.failed_values).forEach( (current_property) => {
					console.log(this.log_channel, `${current_property}: result.failed_values[current_property]`);
				});
			}

			return result;
		};

	};	// end MandalaLayer

	return MandalaLayer;
};
