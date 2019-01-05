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
	// buttons in general
	get button_class()			{ return `${this.attribute_prefix}_button`};
	// add button
	get add_button_class()		{ return `${this.button_class}_add`; };
	get add_button_id()			{ return `${this.add_button_class}_id`; };
	get delete_button_class()	{ return `${this.button_class}_delete`};
	get delete_button_id()		{ return `${this.delete_button_class}_id`};
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
	// get actiontype_add_layer()				{ return "add_layer"};
	// get actiontype_set_editing_layers()	{ return "set_editing_layers"; };
	// get actiontype_delete_layer()			{ return "delete_layer"};
	
	// -------------------------------------------------------------------------
	constructor(fractala, Actions)
	{
		console.log(this.log_channel, "constructor");

		this.fractala = fractala;
		// this.queueAction = queueAction;
		this.Actions = Actions;

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
		// console.log(this.editing_layer);

		$(`.${this.row_class}`).attr("data-editing-layer", false);
		$(`#${this.row_id(this.editing_layer)}`).attr( "data-editing-layer", true);

		// TODO:use action defs!
		this.sendAction(Actions.ActionType.set_editing_layers);
	}

	// -------------------------------------------------------------------------
	sendAction(action_type)
	{
		console.log(this.log_channel, `sendAction(${action_type})`)
		// TODO: need that action class
		var action = {};
		action.action_type = action_type;
		action.layers = [this.editing_layer];

		//this.queueAction(action);
		this.Actions.queueAction(action);
	};

	// -------------------------------------------------------------------------
	removeLayer(layer_name)
	{
		$(`#${this.row_id(layer_name)}`).remove();
		//TODO: re-assign editing layer!
	}

	// -------------------------------------------------------------------------
	generateMenu()
	{
		console.log(this.log_channel, "generateMenu()");

		this.$container_div = $('<div></div>');
		this.$container_div.attr( { "id":this.container_div_id } );
		this.$container_div.addClass( this.container_div_class );

		// TODO: use a glyph here?
		this.$add_button = $('<button>+</button>');
		this.$add_button.addClass( `${this.button_class} ${this.add_button_class}`);
		this.$add_button.attr({ "id":this.add_button_id });
		this.$add_button.click( (event) => {this.sendAction(Actions.ActionType.add_layer); } );

		this.$delete_button = $('<button>X</button>');
		this.$delete_button.attr("id", this.delete_button_id)
		this.$delete_button.addClass(`${this.button_class} ${this.delete_button_class}`);
		this.$delete_button.click( (event) => {this.sendAction(Actions.ActionType.delete_layer); } );

		this.$table = $('<table></table>');
		this.$table.attr({ "id":this.table_id});
		this.$table.addClass(this.table_class );

		this.$container_div.append(this.$add_button);
		this.$container_div.append(this.$delete_button);
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
		$name_td.mouseenter( (event) => { 
			Actions.queueAction(new Actions.Action(Actions.ActionType.highlight_layer, [layer_name])); } );
		$name_td.mouseleave( (event) => { 
			Actions.queueAction(new Actions.Action(Actions.ActionType.highlight_layer, [])); } );
	
		var $editing_td = $('<td>_</td>');
		$editing_td.attr("id", this.row_editing_td_id(layer_name) );
		$editing_td.addClass( this.row_editing_td_class);
	
		$layer_list_row_item.append($name_td);
		$layer_list_row_item.append($editing_td);
	
		// $layer_list_row_item.mouseleave( (evt) => {
		// 	highlightLayer("");
			// $layer_list_row_item.$popup_menu.dismiss();
		// } );
		
		return $layer_list_row_item;
	}

	// -------------------------------------------------------------------------
	// recreates menu from model
	sync()
	{
		// $(`#${this.container_div_id}`).remove();
		// this.generateMenu();
		$(`#${this.table_id}`).empty();

		// since addLayer() PREpends new layers, if we go over layers_order
		// in order this will show the correct sequence
		// TODO: Really need to sort this ordering guarantee thing out.
		for (var index = 0; index < this.fractala.layers_order.length; index += 1)
		{
			var layer = this.fractala.getLayerByIndex(index);
			this.addLayer(layer.name);
		}
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


