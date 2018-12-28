'use strict';

/*
TODO:
	* cancel functionality
		*click on body cover
		*optional cancel button
	* optional cover styling
*/

// must have jquery
if (typeof window.jQuery === "undefined")
{
   console.log("ERROR: ValuePickerTable: jQuery unavailable");
}
else
{

// TODO: test for jquery
var modalize = 
{
	// -------------------------------------------------------------------------
	Create:function($parent, $modal_content, modal_id)
	{
		this.modal_id_suffix = "_modal_id";

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
		};

		// -----------------------------------------------------------
		this.dismiss = function()
		{
			// console.log("modalize:dismiss()");
			this.$body_cover.css({"display":"none"});
		};

		this.start = function()
		{
			this.$body_cover.css({"display":"initial"});
		};

		this.$parent = $parent;
		this.$modal_content = $modal_content;
		this.$modal_content.css({"z-index":"1001", "opacity":"1.0"});
		this.body_cover_id = modal_id + this.modal_id_suffix;

		this.$body_cover = $(`<div id="${this.body_cover_id}"></div>`);
		this.$body_cover.css( this.body_cover_css );
		this.$body_cover.click( function(event) {
			this.dismiss();
		}.bind(this) );

		this.$parent.append(this.$body_cover);
		this.$body_cover.append(this.$modal_content);

		return this;
	},

};

} // end else has jquery