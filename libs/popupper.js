'use strict';

/*
TODO:
	-need to specify item user can remain over without removing popup
	-remove when:
			-user leaves original element, but doesn't enter popup
*/

// must have jquery
if (typeof window.jQuery === "undefined")
{
   throw "popupper: requires jquery";
}
else
{
var popupper = 
{
	// -------------------------------------------------------------------------
	// -------------------------------------------------------------------------
	// Creates popuppable form of content
	// OPTIONAL:
	// position:{left:number, top:number}
	// RETURNS: $body_covering_object
	// ASSUMPTIONS:
	//	* modal_id will be unique
	// SIDE EFFECTS:
	//	* $menu_content parameter's css position set to absolute
	//	* $menu_content parameter's css left/top altered
	Create:function($parent, $menu_content, position)
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
			console.log("popupper:dismiss()");
			// this.$body_cover.css({"display":"none"});
			this.$menu_content.css({"display":"none"});

			// TODO: dismiss callback so creator can handle
			// or optional removal upon dismissal?
		};

		// -------------------------------------------------------------------------
		this.start = function()
		{
			console.log("popupper:start()");
			// this.$body_cover.css({"display":"initial"});
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
			console.log("popupper : entered menu");
			this.entered_popup = true;
		});
		this.$menu_content.mouseleave( (event) => {
			console.log("popupper : left menu");
			this.dismiss();
		});

		// this.$body_cover = $(`<div id="${this.body_cover_id}"></div>`);
		// this.$body_cover.css( this.body_cover_css );
		// this.$body_cover.click( function(event) {
		// 	this.dismiss();
		// }.bind(this) );

		this.$parent.append(this.$menu_content);
		// this.$body_cover.append(this.$menu_content);

		return this;
	},

};

} // end else has jquery