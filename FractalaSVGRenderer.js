'use strict';

if ( typeof svgee == "undefined")
{
	console.log("ERROR: FractalaSVGRenderer needs svgee library.");
}
else
{
	var FractalaSVGRenderer = {

	// -------------------------------------------------------------------------
	// config: { width:number, height:number }
	// svg local x,y will be at upper left corner of viewbox
	FractalaSVGRenderer:function(fractala, config)
	{
		this.name = "FractalaSVGRenderer";
		this.fractala = fractala;

		Object.assign(this, config);

		this.root_element = "";
		this.layer_elements = [];
	},
};

// ----------------------------------------------------------------------------
// adds empty version of rendering related data
FractalaSVGRenderer.FractalaSVGRenderer.prototype.clear = function()
{
	this.root_element = "";
	this.layer_elements = [];
};

// ----------------------------------------------------------------------------
// only doin' circles for now
FractalaSVGRenderer.FractalaSVGRenderer.prototype.renderLayer = function(layer)
{
	const degrees_per_radian = 360.0 / (Math.PI*2);
	var rotate_degrees = layer.spoke_rot_offset * degrees_per_radian;
	var transform_attribute = `transform="rotate(${rotate_degrees})"`;

	var svg_elem = `<g data-layer-name="${layer.name}" ${transform_attribute}>`;

	var current_center = new fnc2d.Point(0, -layer.spoke_length);

	var rotation = my2d.TWO_PI / layer.number_of_spokes;

	for (var current_spoke = 0; current_spoke < layer.number_of_spokes; current_spoke += 1)
	{
		var current_circle = svgee.circle(	current_center.x, current_center.y, 
														layer.radius,
														{ stroke_width:layer.stroke_width, stroke:layer.stroke });

		svg_elem += current_circle;

		current_center = current_center.rotate(rotation);
	}

	svg_elem += "</g>";
	
	return svg_elem;
};

// ----------------------------------------------------------------------------
// returns whole enchilada:string
FractalaSVGRenderer.FractalaSVGRenderer.prototype.render = function()
{
	var width = this.width;
	var height = this.height;
	var x = -width / 2;
	var y = -height / 2;

	this.clear();

	var svg_elem = `<svg width="100%" height="100%" id="mySVG" viewbox="${x} ${y} ${width} ${height}">`;

	// loop over its layers or, something
	fractala.layers.forEach( (current_layer) => {

		var current_element = this.renderLayer(current_layer);
		this.layer_elements.push(current_element);

		svg_elem += current_element;
	});

	svg_elem += "</svg>";
	
	return svg_elem;

};

};
