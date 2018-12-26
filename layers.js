'use strict';

// ============================================================================
var LayerTypes =
{
	// -------------------------------------------------------------------------
	// TODO: validate string form
	validateCircleLayerConfig: function(circle_layer_config)
	{
		var validation_errors = [];
		var error_prefix = "ERROR: circle layer config: ";

		let required_properties = 
		{
			number_of_spokes:"number", 
			spoke_length:"number",
			spoke_rot_offset:"number",
			radius:"number",
			stroke_width:"number",
			stroke:"string",
		};

		if (undefined === circle_layer_config)
		{
			validation_errors.push(`${error_prefix} config parameter  undefined`);
		}
		else
		{
			for (var current_prop in required_properties)
			{
				if (!circle_layer_config.hasOwnProperty(current_prop))
				{
					validation_errors.push(	`${error_prefix} missing property: ${current_prop}:${required_properties[current_prop]}`);
				}
				else
				{
					var expected_type = required_properties[current_prop];
					var current_type = typeof circle_layer_config[current_prop];
					if (current_type !== expected_type)
					{
						validation_errors.push(`${error_prefix} ${current_prop}: expected type ${expected_type} but found ${current_type}`);
					}
				}
			}
		}

		// console.log(validation_errors);
		validation_errors.forEach( (item) => console.log(item));

		return 0 === validation_errors.length;
	},

	// -------------------------------------------------------------------------
	// caution: may return null
	CircleLayer: function(circle_layer_config)
	{
		var return_val = null;

		if (LayerTypes.validateCircleLayerConfig(circle_layer_config))
		{
			this.config = {};
			Object.assign(this.config, circle_layer_config);

			return_val = this;
		}

		return return_val;
	},
};

// ============================================================================
// TODO: name validator function?
var LayersNS = 
{
	Layers: function()
	{
		// layers are indexed by name
		this.layers = {};

		this.current_layer_name = "";

		// ---------------------------------------------------------------------------
		this.getLayers = function()
		{
			return this.layers;
		};

		// ---------------------------------------------------------------------------
		this.setCurrentLayer = function(layer_name)
		{
			if (!this.layers.hasOwnProperty(layer_name))
			{
				console.log(`ERROR: Layer ${layer_name} does not exist`);
			}
			else
			{
				this.current_layer_name = layer_name;
			}
		};

		// ---------------------------------------------------------------------------
		this.getCurrentLayer = function()
		{
			return this.current_layer_name !== "" ? this.layers[this.current_layer_name] : null;
		};

		// ---------------------------------------------------------------------------
		this.getLayer = function(layer_name)
		{
			return this.layers[layer_name];
		}

		// ---------------------------------------------------------------------------
		this.addCircleLayer = function(name, circle_layer_config)
		{
			console.log("adding circle layer");

			if (name == "")
			{
				console.log(`ERROR: "" is not a valid layer name`);
			}
			else
			{
				var new_circle_layer = new LayerTypes.CircleLayer(circle_layer_config);
				new_circle_layer.name = name;
				this.layers[name] = new_circle_layer;
			}

			console.log("total layers: " + Object.keys(Layers.layers).length);
		};

	},

};

