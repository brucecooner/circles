'use strict';

// model for fractal-ish mandala
// TODO:
//	* layer management (ordering) internally
//	* layer types (with common aspects)
// * layer order iterator?
class Fractala
{
	// --- CONST-ISH ---
	get layer_default_parameters() { return {	number_of_spokes:6, 
															spoke_length:50,
															spoke_rot_offset:0,
															opacity:1,
															radius:20,	// todo: layer types (this is circles specific)
															stroke_width:1,
															stroke:"hsl(0,100%,50%)",	// default red
														}; 
	};

	// -------------------------------------------------------------------------
	constructor()
	{
		this.next_layer_index = 0;

		// --- DEFAULTS ---
		this.name = "fractala";

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
	Layer(parameters)
	{
		var layer = {};
		layer.layer_index = this.getNextLayerIndex();

		Object.assign(layer, this.layer_default_parameters);
		Object.assign(layer, parameters);

		return layer;
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
			console.log("fractala", `ERROR: getLayerByIndex() index ${index} out of bounds`);	
		}
	};

	// -------------------------------------------------------------------------
	getLayerCount()
	{
		return this.layers_order.length;
	};

	// -------------------------------------------------------------------------
	addCirclesLayer(parameters)
	{
		var new_layer = this.Layer(parameters);

		new_layer.name = `circles_${new_layer.layer_index}`;

		this.layers[new_layer.name] =new_layer;
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
			console.log("fractala", `layer ${layer_name} deleted`);
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
				console.log("fractala", `could not find layer ${layer_name} in layers_order`);
			}
		}
		else
		{
			console.log("fractala", `ERROR: layer ${layer_name} not found for deletion`);
		}

		return return_name;
	}

	// ----------------------------------------------------------------------------
	deleteAllLayers()
	{
		this.layers = {};
		this.layers_order = [];
	}

	// ----------------------------------------------------------------------------
	toJSON()
	{
		var json_obj = {};
		// get layers
		json_obj.layers = this.layers;
		// get layers_order
		json_obj.layers_order = this.layers_order;
		json_obj.next_layer_index = this.next_layer_index;

		return JSON.stringify(json_obj);
	};

	// ----------------------------------------------------------------------------
	fromJSON(json_obj)
	{
		// get layers
		this.layers = json_obj.layers;
		// get layers_order
		this.layers_order = json_obj.layers_order;
		this.next_layer_index = json_obj.next_layer_index;
	};
};





