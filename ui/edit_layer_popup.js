'use strict';

// TODO: make into a module maybe?
// TODO: class maybe? KISS for now though...

// ---- EDIT LAYER POPUP ----

// TODO: data uri's?
var edit_layer_menu_actions = [
	{ text:"copy", action:"copy" },
	{ text:"delete", action:"del" },
	{ text:"color", action:"color" },
];

// ----------------------------------------------------------------------------
function generateEditLayerMenuAction(menu_action, layer_name, edit_action_callback )
{
	var $item_content = $(`<div class="editLayerPopupMenuItem">${menu_action.text}</div>`);
	// id
	$item_content.attr("id", `editLayerPopupMenu_${menu_action.action}ActionId`);
	// data-layer-name
	$item_content.attr("data-layer-name", layer_name);
	//data-menu-action
	$item_content.attr("data-menu-action", menu_action.action);

	$item_content.click( (event) => {
		event.stopPropagation();	// or else it bubbles to owner

		var $action_item = $(event.currentTarget);

		console.log(`edit layer popup menu item clicked: ${$action_item.attr("data-menu-action")} -> ${$action_item.attr("data-layer-name")}`);

		edit_action_callback($action_item.attr("data-menu-action"), $action_item.attr("data-layer-name"));
	});

	return $item_content;
}

// --------------------------------------------------------------------
function generateEditLayerPopupMenu($parent, layer_name, edit_action_callback)
{
	var $popup = null;

	// TODO: style...
	var $menu_content = $(`<div id="editLayerPopupMenu_${layer_name}Id" class="editLayerPopupMenu"></div>`);
	$menu_content.attr("data-layer-name", layer_name);

	edit_layer_menu_actions.forEach ( (current_action) => 
	{
		var $action_item = generateEditLayerMenuAction(current_action, layer_name, edit_action_callback);
		$menu_content.append($action_item);
	});

	var $popup = new popupper.Create($parent, $menu_content );

	return $popup;
}

