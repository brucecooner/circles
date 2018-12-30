'use strict';

var Fractala = {

	// --- CONST-ISH ---
	layer_default_parameters:{
		number_of_spokes:6, 
		spoke_length:50,
		spoke_rot_offset:0,
		radius:20,	// circles specific
		stroke_width:1,
		stroke:"hsl(0,100%,0%)",
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

		this.name = `layer_${this.layer_index}`;

		Object.assign(this, Fractala.layer_default_parameters);
		Object.assign(this, parameters);
	},

	// -------------------------------------------------------------------------
	Fractala:function()
	{
		// --- DEFAULTS ---
		this.name = "fractala";

		// --- DATA ---
		this.layers = [];

	},
};

// -------------------------------------------------------------------------
// --- METHODS ---
// -------------------------------------------------------------------------
// -------------------------------------------------------------------------
Fractala.Fractala.prototype.addCirclesLayer = function(parameters)
{
	var new_layer = new Fractala.Layer(parameters);

	this.layers.push(new_layer);
};
