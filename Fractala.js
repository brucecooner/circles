'use strict';

// model for fractal-ish mandala
// TODO:
//	* layer management (ordering) internally
//	* layer types (with common aspects)
// * layer order iterator?
var Fractala = {

	// --- CONST-ISH ---
	layer_default_parameters:{
		number_of_spokes:6, 
		spoke_length:50,
		spoke_rot_offset:0,
		radius:20,	// todo: layer types (this is circles specific)
		stroke_width:1,
		stroke:"hsl(0,100%,50%)",	// default red
	},

	// --- DATA ---
	next_layer_index:0,
	getNextLayerIndex:function()
	{ 
		Fractala.next_layer_index += 1; 
		return Fractala.next_layer_index; 
	},
	
	// -------------------------------------------------------------------------
	Layer:function(parameters)
	{
		this.layer_index = Fractala.getNextLayerIndex();

		Object.assign(this, Fractala.layer_default_parameters);
		Object.assign(this, parameters);
	},

	// -------------------------------------------------------------------------
	Fractala:function()
	{
		// --- DEFAULTS ---
		this.name = "fractala";

		// --- DATA ---
		this.layers = {};

		// creation order, for now, will handle re-ordering eventually
		this.layers_order = [];
	},
};

// -------------------------------------------------------------------------
// --- METHODS ---
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
Fractala.Fractala.prototype.getLayer = function(layer_name)
{
	// TODO: handle not having requested layer
	return this.layers[layer_name];
};

// -------------------------------------------------------------------------
Fractala.Fractala.prototype.addCirclesLayer = function(parameters)
{
	var new_layer = new Fractala.Layer(parameters);

	new_layer.name = `circles_${new_layer.layer_index}`;

	this.layers[new_layer.name] =new_layer;
	this.layers_order.push(new_layer.name);

	return new_layer;
};
