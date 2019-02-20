'use strict';

// requires: jquery, modalize

// TODO:
// * style stuff here

var SaveDialog = 
{
	// --------------------------------------------------------------------------
	Create:function()
	{
		this.onChangeSaveFilename = function()
		{
			var save_filename = this.$input.val();
			this.$anchor.attr("download", save_filename);
		};

		// --- INIT ---
		this.container_id = "saveFileContainerId";
		this.anchor_id = "saveFileAnchorId";
		this.text_input_id = "saveFilenameTextInputId";
		this.default_savefile_name = "circles.svg";

		this.$container = $(`<div id="${this.container_id}" onclick="event.stopPropagation()"></div>`);
		this.$container.css( {	"position":"absolute",
								"background-color":"rgb(100,100,100)",
								"border":"2px solid black",
								"padding":"8px"});

		this.$input = $(`<input	type="text" id="${this.text_input_id}"/>`);
		this.$input.keyup( this.onChangeSaveFilename.bind(this));
		this.$anchor = $(`<a	id="${this.anchor_id}" href=""><button>download</button></a>)`);
		this.$anchor.click(() => { this.save_dialog_modal.dismiss(); } );

		this.$container.append(this.$input);
		this.$container.append(this.$anchor);

		this.save_dialog_modal = new modalize.Create($("body"), this.$container, "save_link", {left:"50px", top:"50px"});
	},

};

// ----------------------------------------------------------------------------
SaveDialog.Create.prototype.start = function(svg_blob_url)
{
	this.$anchor.attr({ "href":svg_blob_url, "download":this.default_savefile_name});
	this.$input.attr("value", this.default_savefile_name);

	this.save_dialog_modal.start();
};

