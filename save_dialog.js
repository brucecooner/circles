'use strict';

// requires: jquery, modalize

// TODO:
// * style stuff here

// --------------------------------------------------------------------------
function onChangeSaveFilename()
{
	var save_filename = $("#save_filename_text_id").val();
	$("#save_anchor_id").attr("download", save_filename);
};

// --------------------------------------------------------------------------
// returns modal
function openSaveDialog(svg_blob_url, save_click_handler)
{
	var default_savefile_name = "defaultsvg.svg";

	var content_string = `<div>
	<input	 type="text"
				 id="save_filename_text_id"
				 onkeyup="onChangeSaveFilename()"
				 value="${default_savefile_name}">
	<a id="save_anchor_id" href="${svg_blob_url}"
		 download="${default_savefile_name}"
		 onclick="onSaveLinkClick()">
		download
	</a>
	</div>`;

	var $modal_content = $(content_string);
	$modal_content.css( {	"position":"absolute",
									"left":"10px",
									"top":"10px",
									"background-color":"rgb(100,100,100)"});

	// $svg_link = $(`<a href="${svg_blob_url}" onclick="onSaveLinkClick()" download="testrevoke_svg_${svg_file_version}.svg">click to download</a>`);
	var save_dialog = new modalize.modal($("body"), $modal_content, "save_link");

	// can plumb things now...
	// this not great, maybe better way?
	$("#save_anchor_id").click(() => { save_dialog.dismiss(); } );

	return save_dialog;
}