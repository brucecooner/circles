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
	get delete_button_id()		{ return `${this.delete_button_class}_id`;};
	get new_button_class()		{ return `${this.button_class}_new`;};
	get new_button_id()			{ return `${this.new_button_class}_id`;};
	get clone_button_class()	{ return `${this.button_class}_clone`; };
	get clone_button_id()		{ return `${this.clone_button_class}_id`; };
	get save_button_class()		{ return `${this.button_class}_save`; };
	get save_button_id()			{ return `${this.save_button_class}_id`; };
	get restore_button_class()	{ return `${this.button_class}_restore`; };
	get restore_button_id()		{ return `${this.restore_button_class}_id`; };
	get download_button_class(){ return `${this.button_class}_download`; };
	get download_button_id()	{ return `${this.download_button_class}_id`; };
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

	get row_editing_cb_class()	{ return `${this.row_class}_cb`; };
	row_editing_cb_id(layer_name)	{ return `${this.row_editing_cb_class}_${layer_name}_id`; };

	// --- menu action types ---
	// TODO: use ActionTypes (need external def tho)
	// get actiontype_add_layer()				{ return "add_layer"};
	// get actiontype_set_editing_layers()	{ return "set_editing_layers"; };
	// get actiontype_delete_layer()			{ return "delete_layer"};
	
	// -------------------------------------------------------------------------
	constructor(mandala, Actions)
	{
		console.log(this.log_channel, "constructor");

		this.mandala = mandala;
		// this.queueAction = queueAction;
		this.Actions = Actions;

		this.name = "LayerMenuClass";

		this.editing_layer = "";

		// this.editing_layers = [];
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
	// for setting only ONE edit layer
	setEditingLayer(layer_name)
	{
		console.log(this.log_channel, `setEditingLayer: ${layer_name}`);

		this.editing_layer = layer_name;
		// console.log(this.editing_layer);
		// this.editing_layers = [ layer_name ];

		$(`.${this.row_class}`).attr("data-editing-layer", false);
		$(`#${this.row_id(this.editing_layer)}`).attr( "data-editing-layer", true);

		// TODO:use action defs!
		this.sendAction(Actions.ActionType.set_editing_layers);
	}

	// -------------------------------------------------------------------------
	// addEditingLayer(layer_name)
	// {
	// 	this.editing_layers.push(layer_name);
	// }

	// -------------------------------------------------------------------------
	// removeEditingLayer(layer_name)
	// {
	// 	var index = this.editing_layers.indexOf(layer_name);
	// 	if (index >= 0)
	// 	{
	// 		this.editing_layers.splice(index, 1);
	// 	}
	// }

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

		this.$save_button = $('<button>save</button>');
		this.$save_button.attr("id", this.save_button_id)
		this.$save_button.addClass(`${this.button_class} ${this.save_button_class}`);
		this.$save_button.click( (event) => {this.sendAction(Actions.ActionType.save); } );
		this.$save_button.attr("data-hint", "save current layout");

		this.$restore_button = $('<button>restore</button>');
		this.$restore_button.attr("id", this.restore_button_id)
		this.$restore_button.addClass(`${this.button_class} ${this.restore_button_class}`);
		this.$restore_button.click( (event) => {this.sendAction(Actions.ActionType.restore); } );
		this.$restore_button.attr("data-hint", "restore last saved layout");

		this.$download_button = $('<button>export</button>');
		this.$download_button.attr("id", this.download_button_id)
		this.$download_button.addClass(`${this.button_class} ${this.download_button_class}`);
		this.$download_button.click( (event) => {this.sendAction(Actions.ActionType.download); } );
		this.$download_button.attr("data-hint", "save layout to svg file");

		// TODO: use a glyph here?
		this.$add_button = $('<button>+</button>');
		this.$add_button.addClass( `${this.button_class} ${this.add_button_class}`);
		this.$add_button.attr({ "id":this.add_button_id });
		this.$add_button.click( (event) => {this.sendAction(Actions.ActionType.add_layer); } );
		this.$add_button.attr("data-hint", "add new layer");

		this.$delete_button = $('<button>del</button>');
		this.$delete_button.attr("id", this.delete_button_id)
		this.$delete_button.addClass(`${this.button_class} ${this.delete_button_class}`);
		this.$delete_button.click( (event) => {this.sendAction(Actions.ActionType.delete_layer); } );
		this.$delete_button.attr("data-hint", "delete current layer");

		this.$new_button = $('<button>New</button>');
		this.$new_button.attr("id", this.new_button_id)
		this.$new_button.addClass(`${this.button_class} ${this.new_button_class}`);
		this.$new_button.click( (event) => {this.sendAction(Actions.ActionType.new_document); } );
		this.$new_button.attr("data-hint", "new layout (start over)");

		this.$clone_button = $('<button>clone</button>');
		this.$clone_button.attr("id", this.clone_button_id)
		this.$clone_button.addClass(`${this.button_class} ${this.clone_button_class}`);
		this.$clone_button.click( (event) => {this.sendAction(Actions.ActionType.clone_layer); } );
		this.$clone_button.attr("data-hint", "clone current layer");

		this.$table = $('<table></table>');
		this.$table.attr({ "id":this.table_id});
		this.$table.addClass(this.table_class );
		this.$table.attr("data-hint", "click a layer name to edit");

		this.$container_div.append(this.$new_button);
		this.$container_div.append('<br>');
		this.$container_div.append(this.$save_button);
		this.$container_div.append(this.$restore_button);
		this.$container_div.append('<br>');
		this.$container_div.append(this.$download_button);
		this.$container_div.append('<br>');
		this.$container_div.append(this.$add_button);
		this.$container_div.append(this.$clone_button);
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

		// like the 'multi-edit' idea, but can't get it to work
		// var $editing_cb_tc = $("<td></td>");
		// $editing_cb_tc.attr("id", this.row_editing_td_id(layer_name) );
		// $editing_cb_tc.addClass( this.row_editing_td_class);

		// var checkbox_class = this.row_editing_cb_class;
		// var checkbox_id = this.row_editing_cb_id(layer_name);

		// var $input = $('<input />', { type: 'checkbox', id: checkbox_id, value: 'temp', class:checkbox_class, checked:false });
		// $input.on('change', (target) => {
		// 	// var $input = $(`#${checkbox_id}`);
		// 	var is_checked = $(`#${checkbox_id}`).prop("checked");
		// 	// console.log("is checked:" + is_checked );
		// 	if (is_checked)
		// 	{
		// 		this.addEditingLayer(layer_name);
		// 	}
		// 	else
		// 	{
		// 		this.removeEditingLayer(layer_name);
		// 	}

		// 	console.log(this.editing_layers);
		// 	// asdf
		// });

		// $input.appendTo($editing_cb_tc);

		$layer_list_row_item.append($name_td);

		// $layer_list_row_item.append($editing_cb_tc);
	
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
		for (var index = 0; index < this.mandala.layers_order.length; index += 1)
		{
			var layer = this.mandala.getLayerByIndex(index);
			this.addLayer(layer.name);
		}
	}

	// -------------------------------------------------------------------------
	// Assumptions:
	//	* layer_name already created
	addLayer(layer_name)
	{
		var layer = mandala.getLayer(layer_name);

		var $row_item = this.generateLayerListItem(layer_name, layer.stroke);

		// for now this will work, but will eventually need precise control over
		// menu ordering vis-a-vis render ordering
		this.$table.prepend($row_item);
	}

	// -------------------------------------------------------------------------
	getEditingLayerNameId()
	{
		return $(`#${this.row_name_td_id(this.editing_layer)}`);
	}

	// -------------------------------------------------------------------------
	// sets background color of editing layer name item
	setEditingLayerColor(color)
	{
		var $editing_name_td = this.getEditingLayerNameId();

		$editing_name_td.css( "background-color", color);
	}
};


