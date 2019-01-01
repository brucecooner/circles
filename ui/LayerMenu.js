'use strict';


// TODO: test for things
// must have jquery
if (typeof window.jQuery === "undefined")
{
   throw "LayerMenu requires jquery";
}

// ============================================================================
class LayerMenu
{
	get log_channel()				{ return "LayerMenu"; };
	// --- ui attributes ---
	get attribute_prefix()		{ return "layersMenu"; };
	// container div
	get container_div_id()		{ return `${this.attribute_prefix}_div_id`; };
	get container_div_class()	{ return `${this.attribute_prefix}_div`; };
	// add button
	get add_button_class()		{ return `${this.attribute_prefix}_button_add`; };
	get add_button_id()			{ return `${this.add_button_class}_id`; };
	// table
	get table_class()				{ return `${this.attribute_prefix}_table`; };
	get table_id()					{ return `${this.table_class}_id`; };
	// row items
	get row_class()				{ return `${this.table_class}_row`}
	row_id(layer_name)			{ return `${this.row_class}_${layer_name}_id`; };
	get row_name_td_class()		{ return `${this.row_class}_td_name`};
	row_name_td_id(layer_name)	{ return `${this.row_name_td_class}_${layer_name}_id`; };
	get row_editing_td_class()	{ return `${this.row_class}_td_editing`; };
	row_editing_td_id(layer_name)	{ return `${this.row_editing_td_class}_${layer_name}_id`; };

	// --- menu action types ---
	// TODO: use ActionTypes (need external def tho)
	get action_add_layer()		{ return "add_layer"};
	
	// -------------------------------------------------------------------------
	constructor(fractala, menu_action_callback)
	{
		console.log(this.log_channel, "constructor");

		this.fractala = fractala;
		this.menu_action_callback = menu_action_callback;

		this.name = "LayerMenuClass";

		this.editing_layer = "";
	};

	// -------------------------------------------------------------------------
	// syncToEditingLayers()
	// {
	// 	console.log(this.log_channel, `syncToEditingLayers()`);

	// 	$(`.${this.row_class}`).attr("data-editing-layer", false);

	// 	this.editing_layers.forEach( (current_layer_name) => {
	// 		console.log(this.log_channel, `syncing layer ${current_layer_name}`);
	// 		$(`#${this.row_id(current_layer_name)}`).attr( "data-editing-layer", true);
	// 	});
	// }

	// -------------------------------------------------------------------------
	setEditingLayer(layer_name)
	{
		console.log(this.log_channel, `setEditingLayer: ${layer_name}`);

		this.editing_layer = layer_name;
		console.log(this.editing_layer);

		$(`.${this.row_class}`).attr("data-editing-layer", false);
		$(`#${this.row_id(this.editing_layer)}`).attr( "data-editing-layer", true);

		// TODO:use action defs!
		this.dispatchAction("set_editing_layers");
	}

	// -------------------------------------------------------------------------
	dispatchAction(action_type)
	{
		// TODO: need that action class
		var action = {};

		action.action_type = action_type;

		action.layers = [this.editing_layer];

		this.menu_action_callback(action);
	};

	// -------------------------------------------------------------------------
	onAddButtonClick(event)
	{
		event.stopPropagation();

		console.log(this.log_channel, "add button clicked");

		this.dispatchAction(this.action_add_layer);
	};

	// -------------------------------------------------------------------------
	generateMenu()
	{
		console.log(this.log_channel, "generateMenu()");

		this.$container_div = $('<div></div>');
		this.$container_div.attr( { "id":this.container_div_id } );
		this.$container_div.addClass( this.container_div_class );

		// TODO: use a glyph here?
		this.$add_button = $('<button>+</button>');
		this.$add_button.addClass( this.add_button_class);
		this.$add_button.attr({ "id":this.add_button_id });
		this.$add_button.click( (event) => {this.onAddButtonClick(event); } );

		this.$table = $('<table></table>');
		this.$table.attr({ "id":this.table_id});
		this.$table.addClass(this.table_class );

		this.$container_div.append(this.$add_button);
		this.$container_div.append(this.$table);

		this.$menu_content = this.$container_div;

		return this.$menu_content;
	};

	// -------------------------------------------------------------------------
	generateLayerListItem(layer_name,background_color)
	{
		var $layer_list_row_item = $(`<tr></tr>`);

		$layer_list_row_item.addClass(this.row_class);

		$layer_list_row_item.attr( {	"id":this.row_id(layer_name),
												"data-layer-name": layer_name,
												"data-editing-layer": false } );

		var $name_td = $(`<td>${layer_name}</td>`);
		$name_td.attr( { "id":this.row_name_td_id(layer_name) } );
		$name_td.addClass(this.row_name_td_class);		
		$name_td.css({"background-color":background_color }); // ??

		$name_td.click( (event) => { this.setEditingLayer( layer_name ); } );
	
		var $editing_td = $('<td>_</td>');
		$editing_td.attr("id", this.row_editing_td_id(layer_name) );
		$editing_td.addClass( this.row_editing_td_class);
	
		$layer_list_row_item.append($name_td);
		$layer_list_row_item.append($editing_td);
	
		// $layer_list_row_item.mouseleave( (evt) => {
		// 	highlightLayer("");
			// $layer_list_row_item.$popup_menu.dismiss();
		// } );
	
		// TODO: send to more mature layer click handler
		// $layer_list_row_item.click( (event) => 
		// { 
		// 	console.log("clicked layer list item"); 
		// 	setCurrentLayer(layer_name); 
		// });
	
		return $layer_list_row_item;
	}

	// -------------------------------------------------------------------------
	// Assumptions:
	//	* layer_name already created
	addLayer(layer_name)
	{
		var layer = fractala.getLayer(layer_name);

		var $row_item = this.generateLayerListItem(layer_name, layer.stroke);

		// for now this will work, but will eventually need precise control over
		// menu ordering vis-a-vis render ordering
		this.$table.prepend($row_item);
	}

	// -------------------------------------------------------------------------
	getEditingLayerNameTd()
	{
		return $(`#${this.row_name_td_id(this.editing_layer)}`);
	}

	// -------------------------------------------------------------------------
	// sets background color of editing layer name item
	setEditingLayerColor(color)
	{
		var $editing_name_td = this.getEditingLayerNameTd();

		$editing_name_td.css( "background-color", color);
	}

};


