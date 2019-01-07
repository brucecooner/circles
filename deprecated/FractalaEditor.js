// ============================================================================
class MandalaEditor
{
	get log_channel()				{ return "LayerMenu"; };

	// --- action types ---
	get	action_add_layer()				{ return "add_layer"};
	get	action_set_number_of_spokes()	{ return set_number_of_spokes; };
	
	// -------------------------------------------------------------------------
	constructor(mandala)
	{
		console.log(this.log_channel, "constructor");

		this.mandala = mandala;

		this.name = "MandalaEditor";
	};

	// -------------------------------------------------------------------------
	handle_addLayer(action)
	{
		mandala.addCirclesLayer();
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
