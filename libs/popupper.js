'use strict';

/*
TODO:
	-need to specify item user can remain over without removing popup
	-remove when:
			-user leaves original element, but doesn't enter popup
	-optional dismissal on item click
*/

// ugh, hanging all out in the global scope, sort out later I guess
// All that work, and ECMA still can't give us a decent static variable implementation
const popupper_channel_name = "popupper";

// must have jquery
if (typeof window.jQuery === "undefined")
{
   throw "popupper: requires jquery";
}
else
{
// no way am I typing that name every time...
let pcn = popupper_channel_name;

var popupper = 
{
	// -------------------------------------------------------------------------
	// -------------------------------------------------------------------------
	// Creates popuppable form of content
	// OPTIONAL:
	// position:{left:number, top:number}
	// dismiss_on_item_click:boolean
	// RETURNS: $body_covering_object
	// ASSUMPTIONS:
	//	* modal_id will be unique
	// SIDE EFFECTS:
	//	* $menu_content parameter's css position set to absolute
	//	* $menu_content parameter's css left/top altered
	Create:function($parent, $menu_content, position )
	{
		// --- VALIDATION ---

		// -----------------------------------------------------------
		// --- "CONSTS" ---
		// -----------------------------------------------------------

		// -----------------------------------------------------------
		// --- METHODS ---
		// -----------------------------------------------------------
		this.dismiss = function()
		{
			console.log(pcn, "dismiss() parent id: " + this.$parent.attr("id"));
			// this.$body_cover.css({"display":"none"});
			this.$menu_content.css({"display":"none"});

			// TODO: dismiss callback so creator can handle
			// or optional removal upon dismissal?
		};

		// -------------------------------------------------------------------------
		this.start = function()
		{
			console.log(pcn, "start() parent id:" + this.$parent.attr("id"));
			this.$menu_content.css({"display":"initial"});
		};

		// -------------------------------------------------------------------------
		// moves content to new position
		// new_position: {left:number(optional), top:number(optional)}
		// SIDE EFFECTS:
		//	* $menu_content parameter's css left/top altered
		this.set_position = function(new_position)
		{
			Object.assign(this.position, new_position);

			this.$menu_content.css({"left":this.position.left, "top":this.position.top});
		};

		// --- INIT ---
		this.position = position || {left:0, top:0};
		// this.body_cover_id = modal_id + this.modal_id_suffix;

		this.$parent = $parent;

		this.$menu_content = $menu_content;
		this.$menu_content.css({"z-index":"1001" });
		// position
		this.$menu_content.css({"position":"absolute", left:this.position.left, top:this.position.top});

		// want to know when mouse has entered popup
		this.entered_popup = false;
		this.$menu_content.mouseenter( (event) => {
			console.log(pcn, `parent(${$parent.attr("id")}): entered menu`);
			this.entered_popup = true;
		});
		// this.$menu_content.mouseleave( (event) => {
		// 	console.log(pcn, " : left menu");
		// 	this.dismiss();
		// });

		this.$parent.append(this.$menu_content);

		return this;
	},

};

} // end else has jquery