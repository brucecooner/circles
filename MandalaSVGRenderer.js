'use strict';

if ( typeof svgee == "undefined")
{
	console.log("ERROR: MandalaSVGRenderer needs svgee library.");
}
else
{
	var MandalaSVGRenderer = {

	// -------------------------------------------------------------------------
	// config: { width:number, height:number }
	// svg local x,y will be at upper left corner of viewbox
	MandalaSVGRenderer:function(mandala, config)
	{
		this.name = "MandalaSVGRenderer";
		this.mandala = mandala;

		Object.assign(this, config);

		this.root_element = "";
		this.layer_elements = [];
	},
};

// ----------------------------------------------------------------------------
// adds empty version of rendering related data
MandalaSVGRenderer.MandalaSVGRenderer.prototype.clear = function()
{
	this.root_element = "";
	this.layer_elements = [];
};

// ----------------------------------------------------------------------------
// only doin' circles for now
// TODO: could just clone each spoke, then rotate
MandalaSVGRenderer.MandalaSVGRenderer.prototype.renderLayer = function(layer)
{
	const degrees_per_radian = 360.0 / (Math.PI*2);
	var rotate_degrees = layer.spoke_rot_offset * degrees_per_radian;
	var transform_attribute = `transform="rotate(${rotate_degrees})"`;

	var svg_elem = `<g data-layer-name="${layer.name}" ${transform_attribute} opacity=${layer.opacity}>`;

	var current_center = new fnc2d.Point(0, -layer.spoke_length);

	var rotation = my2d.TWO_PI / layer.number_of_spokes;

	// note that spokes are ALL generated at zero rotation, and the sub-layer rotation is used to spin them into the spoke's
	// final rotation
	// TODO: better name
	var current_spoke_rotation = 0.0;

	for (var current_spoke = 0; current_spoke < layer.number_of_spokes; current_spoke += 1)
	{
		var current_spoke_rotation_degrees = current_spoke_rotation * degrees_per_radian;
		var current_sub_transform_attribute = `transform="rotate(${current_spoke_rotation_degrees})"`;

		svg_elem += `<g data-layer-name="${layer.name}_spoke_${current_spoke}" ${current_sub_transform_attribute}>`;

		var current_circle = svgee.circle(	current_center.x, current_center.y, 
														layer.radius,
														{ stroke_width:layer.stroke_width, stroke:layer.stroke, fill:layer.fill });

		svg_elem += current_circle;

		svg_elem += `</g>`;

		current_spoke_rotation += rotation;
	}

	svg_elem += "</g>";
	
	return svg_elem;
};

// ----------------------------------------------------------------------------
// returns whole enchilada:string
MandalaSVGRenderer.MandalaSVGRenderer.prototype.render = function()
{
	var width = this.width;
	var height = this.height;
	var x = -width / 2;
	var y = -height / 2;

	this.clear();

	var svg_elem = `<svg width="100%" height="100%" id="mySVG" viewbox="${x} ${y} ${width} ${height}">`;

	// loop over its layers or, something
	this.mandala.layers_order.forEach( (current_layer_name) => {

		var current_element = this.renderLayer(this.mandala.getLayer(current_layer_name));
		this.layer_elements.push(current_element);

		svg_elem += current_element;
	});

	svg_elem += "</svg>";
	
	return svg_elem;

};

};
