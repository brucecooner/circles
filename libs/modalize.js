'use strict';

/*
TODO:
	* consts better placeing
	* cancel functionality
		*click on body cover
		*optional cancel button
			-should be specifiable by creator
		*popup behaviors
			-need to specify item user can remain over without removing popup
				-remove when:
					-user leaves original element, but doesn't enter popup
	* optional cover styling
*/

// must have jquery
if (typeof window.jQuery === "undefined")
{
   throw "modalize: requires jquery";
}
else
{
var modalize = 
{
	// -------------------------------------------------------------------------
	// -------------------------------------------------------------------------
	// Creates modalized form of content
	// modal_id: string
	// OPTIONAL:
	// position:{left:number, top:number}
	// RETURNS: $body_covering_object
	// ASSUMPTIONS:
	//	* modal_id will be unique
	// SIDE EFFECTS:
	//	* $modal_content parameter's css position set to absolute
	//	* $modal_content parameter's css left/top altered
	Create:function($parent, $modal_content, modal_id, position)
	{
		// --- VALIDATION ---
		if (modal_id == "")
		{
			throw "modalize: modal_id cannot be empty.";
		}

		// -----------------------------------------------------------
		// --- "CONSTS" ---
		// -----------------------------------------------------------
		this.body_cover_id_suffix = "_body_cover_id";

		this.body_cover_css = 
		{
			"display":"none",
			// can't use opacity for these or child elements get opacified too
			// "background-color":"rgba(100,0,0,0.5)",
			"z-index":"1000",
			"position":"absolute",
			"left":"0px",
			"top":"0px",
			"width":"100%",
			"height":"100%",
			"background-color":"rgba(255,0,0,0.5)",
		};

		// -----------------------------------------------------------
		// --- METHODS ---
		// -----------------------------------------------------------
		this.dismiss = function()
		{
			console.log("modalize:dismiss()");
			this.$body_cover.css({"display":"none"});

			// TODO: dismiss callback so creator can handle
			// or optional removal upon dismissal?
		};

		// -------------------------------------------------------------------------
		this.start = function()
		{
			console.log("modalize:start()");
			this.$body_cover.css({"display":"initial"});
		};

		// -------------------------------------------------------------------------
		// moves modal content to new position
		// new_position: {left:number(optional), top:number(optional)}
		// SIDE EFFECTS:
		//	* $modal_content parameter's css left/top/z-index altered
		this.set_position = function(new_position)
		{
			Object.assign(this.position, new_position);

			this.$modal_content.css({"left":this.position.left, "top":this.position.top});
		};

		// --- INIT ---
		this.position = position || {left:0, top:0};
		this.body_cover_id = modal_id + this.body_cover_id_suffix;

		this.$parent = $parent;

		this.$modal_content = $modal_content;
		this.$modal_content.css({"z-index":"1001" });
		// position
		this.$modal_content.css({"position":"absolute", left:this.position.left, top:this.position.top});

		this.$body_cover = $(`<div id="${this.body_cover_id}"></div>`);
		this.$body_cover.css( this.body_cover_css );
		this.$body_cover.click( function(event) {

			// ignore clicks over modal content

			this.dismiss();
		}.bind(this) );

		this.$parent.append(this.$body_cover);
		this.$body_cover.append(this.$modal_content);

		return this;
	},

};

} // end else has jquery