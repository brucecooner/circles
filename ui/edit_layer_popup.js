'use strict';

// TODO: make into a module maybe?
// TODO: class maybe? KISS for now though...

// ---- EDIT LAYER ----
// var $edit_layer_popup_menu = null;

// --------------------------------------------------------------------
// assumes only one of these will be created (id is hardwired)
function generateEditLayerPopupMenu(parent_selector)
{
	// TODO: style...
	var $menu_content = $('<div id="editLayerPopupMenuId" class="editLayerPopupMenu"></div>');

	// TODO: make edit items dynamical?
	$menu_content.append( $(`<div id="editLayerPopupMenuCopyId" class="editLayerPopupMenuItem">copy</div>`) );
	$menu_content.append( $(`<div id="editLayerPopupMenuDelId" class="editLayerPopupMenuItem">delete</div>`) );

	var $popup = popupper.Create($(parent_selector), $menu_content );

	return $popup;
}

