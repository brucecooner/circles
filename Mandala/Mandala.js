'use strict';

// model for fractal-ish mandala
// TODO:
//	* layer management (ordering) internally
//	* layer types (with common aspects)
// * layer order iterator?
//	* proper channel names fergoodnesssake
function initMandalaClass()
{

var LayerClass = initMandalaLayerClass();

class Mandala
{
	get className()					{ return "Mandala"; };
	get channelName()					{ return "Mandala" };

	// -------------------------------------------------------------------------
	constructor()
	{
		this.LayerClass = LayerClass;

		this.next_layer_index = 0;

		// --- DATA ---
		this.layers = {};

		// render order
		// note that added layers are added to end of array, so currently
		// render order goes from back to front with increasing index
		this.layers_order = [];
	};

	// -------------------------------------------------------------------------
	// --- METHODS ---
	// -------------------------------------------------------------------------
	getNextLayerIndex()
	{ 
		this.next_layer_index += 1; 
		return this.next_layer_index; 
	};
	
	// -------------------------------------------------------------------------
	getLayer(layer_name)
	{
		// TODO: handle not having requested layer
		return this.layers[layer_name];
	};

	// -------------------------------------------------------------------------
	// returns layer by index from render order
	getLayerByIndex(index)
	{
		if (index >= 0 && index < this.layers_order.length)
		{
			return this.layers[this.layers_order[index]];
		}
		else
		{
			console.log(this.channelName, `ERROR: getLayerByIndex() index ${index} out of bounds`);	
		}
	};

	// -------------------------------------------------------------------------
	getLayerCount()
	{
		return this.layers_order.length;
	};

	// -------------------------------------------------------------------------
	// NOTE: does NOT add to layers_order
	newCirclesLayer(parameters)
	{
		var new_layer = new this.LayerClass(parameters);

		new_layer.name = `circles_${this.getNextLayerIndex()}`;

		this.layers[new_layer.name] =new_layer;

		return new_layer;
	}

	// -------------------------------------------------------------------------
	preRender()
	{
		Object.keys(this.layers).forEach(  (current_layer_key) => {
			this.layers[current_layer_key].preRender();
		});
	}

	// -------------------------------------------------------------------------
	addCirclesLayer(parameters)
	{
		var new_layer = this.newCirclesLayer(parameters);

		this.layers_order.push(new_layer.name);

		return new_layer;
	};

	// -------------------------------------------------------------------------
	// removes layer with specified name
	// returns name of next higher layer in render order
	// or layer at index 0 if deleted first layer, 
	// or "" if deleted last layer
	deleteLayer(layer_name)
	{
		var return_name = "";

		if (this.layers.hasOwnProperty(layer_name))
		{
			console.log(this.channelName, `layer ${layer_name} deleted`);
			delete this.layers[layer_name];
			// take out of layers_order
			var removed = false;
			for (var delete_index = 0; delete_index < this.layers_order.length; delete_index += 1)
			{
				if (this.layers_order[delete_index] == layer_name)
				{
					removed = true;
					// note: want returned layer to be next HIGHEST in order array
					this.layers_order.splice(delete_index,1);
					if (0 == this.layers_order.length)
					{
						return_name = "";	// empty
					}
					else if (1 == this.layers_order.length)
					{
						return_name = this.layers_order[0];
					}
					else
					{
						// since array was effectively shifted down one, can return deleted index, unless
						// removed highest index
						return_name = this.layers_order[Math.min(this.layers_order.length - 1, delete_index)];
					}
					break;
				}
			}
			if (!removed)
			{
				console.log(this.channelName, `could not find layer ${layer_name} in layers_order`);
			}
		}
		else
		{
			console.log(this.channelName, `ERROR: layer ${layer_name} not found for deletion`);
		}

		return return_name;
	}

	// ----------------------------------------------------------------------------
	deleteAllLayers()
	{
		console.log(this.channelName, "deleting all layers");
		this.layers = {};
		this.layers_order = [];
	}

	// ----------------------------------------------------------------------------
	cloneLayer(layer_name)
	{
		console.log(this.channelName, `cloneLayer(${layer_name})`);

		// note: not added to layers_order
		var new_layer = this.newCirclesLayer();

		var existing_layer = this.getLayer(layer_name);
		// use keys of default parameters to tell what to copy out of existing_layer
		// TODO: this should of course eventually be done by a function in the eventual class layer
		// Object.keys(this.layer_default_parameters).forEach( (current_parameter) =>
		Object.keys(existing_layer.defaultLayerParameters).forEach( (current_parameter) =>		
		{
			// new_layer[current_parameter] = existing_layer[current_parameter];
			new_layer.setProperty(current_parameter, existing_layer[current_parameter]);
		});

		// place immediately BEFORE existing layer in render order
		var existing_layer_index = this.layers_order.indexOf(layer_name);

		if (existing_layer_index >= 0)
		{
			// note that new layer goes AFTER cloned layer in array, as greater indices indicate
			// higher layers
			this.layers_order.splice(existing_layer_index+1, 0, new_layer.name);
		}
		else
		{
			this.layers_order.push(new_layer);

			throw `layer ${layer_name} could not be found in layers_order`;
		}

		return new_layer.name; 
	}

	// ----------------------------------------------------------------------------
	toJSON()
	{
		var json_obj = {};
		
		// layers
		var json_layers = {};
		// json_obj.layers = this.layers;
		Object.keys(this.layers).forEach( (current_layer_name) => {
			var current_layer = this.layers[current_layer_name];
			json_layers[current_layer.name] = current_layer.toJSON();
		});

		// get layers_order
		json_obj.layers = json_layers;
		json_obj.layers_order = this.layers_order;
		json_obj.next_layer_index = this.next_layer_index;

		return JSON.stringify(json_obj);
	};

	// ----------------------------------------------------------------------------
	fromJSON(json_obj)
	{
		// get layers		
		// this.layers = json_obj.layers;

		Object.keys(json_obj.layers).forEach( (current_layer) => {
			var new_layer = new this.LayerClass(json_obj.layers[current_layer]);

			this.layers[new_layer.name] = new_layer;
		});

		// get layers_order
		this.layers_order = json_obj.layers_order;
		this.next_layer_index = json_obj.next_layer_index;
	};

	// ============================================================================
	// INTEGRITY CHECKS
	// ============================================================================
	layers_and_layers_order_same_length() 
	{
		if (Object.keys(this.layers).length !== this.layers_order.length) {
			throw "layers and layers_order lengths differ";
		};
	};

	// ----------------------------------------------------------------------------
	all_layer_names_appear_in_layers_order() 
	{
		var layers_not_in_layers_order = [];
		Object.keys(this.layers).forEach( (current_layer_key) => {
			var layer_name_index = this.layers_order.indexOf(current_layer_key);
			if (layer_name_index < 0) {
				layers_not_in_layers_order.push(current_layer_key);
			};
		});

		if (layers_not_in_layers_order.length > 0)
		{
			throw `layers [${layers_not_in_layers_order.join()}] not in layer_orders`;
		}

	};

	// ----------------------------------------------------------------------------
	layers_order_names_are_unique()
	{
		var non_unique_names = [];

		// for each name in layers_order, loop over layers_order testing for uniqueness
		this.layers_order.forEach( (current_name, current_name_index) => {
			for (var test_index = 0; test_index < this.layers_order.length; test_index += 1)
			{
				var current_test_name = this.layers_order[test_index];
				if ((current_name_index !== test_index) && (current_test_name == current_name)) 
				{
					// add to non-unique list (unless already there)
					if (non_unique_names.indexOf(current_test_name) < 0)
					{
						non_unique_names.push(current_test_name);
					}
				}
			}
		});

		if (non_unique_names.length > 0)
		{
			throw `non-unique layer names found in layers_order [${non_unique_names.join()}]`;
		}
	}

	// ----------------------------------------------------------------------------
	all_layers_have_expected_properties()
	{		
		var layers_missing_properties = [];

		var expected_properties = [
			"name",
		];

		Object.keys(this.layers).forEach( (current_layer_key) => {
			var current_missing_properties = [];
			var current_layer = this.layers[current_layer_key];

			expected_properties.forEach( (current_property) => {
				if (!current_layer.hasOwnProperty(current_property))
				{
					current_missing_properties.push(current_property);
				}
			});

			if ( current_missing_properties.length > 0)
			{
				layers_missing_properties.push(current_layer_key);
			}

		});

		if (layers_missing_properties.length > 0)
		{
			throw `layers ${layers_missing_properties.join()} are missing properties`;
		}
	}

	// =========================================================================
	testIntegrity()
	{
		var log_channel = "mandala_integrity";

		var test_list = [
			"layers_and_layers_order_same_length",
			"all_layer_names_appear_in_layers_order",
			"layers_order_names_are_unique",
			"all_layers_have_expected_properties",
		];

		var integrity_tester = new MiniTester("mandala int chk", this, test_list );

		var results = integrity_tester.test();

		if (results.tests_failed > 0)
		{
			results.messages.forEach( (current_message) => {
				console.log(log_channel, current_message);
			});
		}
		else
		{
			console.log(log_channel, "all tests passed");
		}
	};
};	// end Mandala

return Mandala;
};

