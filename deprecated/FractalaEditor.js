// ============================================================================
class FractalaEditor
{
	get log_channel()				{ return "LayerMenu"; };

	// --- action types ---
	get	action_add_layer()				{ return "add_layer"};
	get	action_set_number_of_spokes()	{ return set_number_of_spokes; };
	
	// -------------------------------------------------------------------------
	constructor(fractala)
	{
		console.log(this.log_channel, "constructor");

		this.fractala = fractala;

		this.name = "FractalaEditor";
	};

	// -------------------------------------------------------------------------
	handle_addLayer(action)
	{
		fractala.addCirclesLayer();
	}

	// -------------------------------------------------------------------------
	handle_setNumberOfSpokes(action)
	{

	};
	// -------------------------------------------------------------------------
	// setEditingLayer(layer_name)
	// {
	// 	console.log(this.log_channel, `setEditingLayer: ${layer_name}`);

	// 	this.editing_layer = layer_name;
	// 	console.log(this.editing_layer);

	// 	$(`.${this.row_class}`).attr("data-editing-layer", false);
	// 	$(`#${this.row_id(this.editing_layer)}`).attr( "data-editing-layer", true);
	// }

	// -------------------------------------------------------------------------
	dispatchAction(action_type)
	{
	};

};
