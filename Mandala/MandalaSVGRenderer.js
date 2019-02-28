'use strict';

// TODO:
// get hardwired svg outta here
// better render decomposing i.e. ==> layers

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

/*
// ----------------------------------------------------------------------------
// only doin' circles for now
// TODO: could just clone each spoke, then rotate
MandalaSVGRenderer.MandalaSVGRenderer.prototype.renderLayer = function(layer)
{
	var circle_style = { stroke_width:layer.stroke_width, stroke:layer.stroke, fill:layer.fill };

	const degrees_per_radian = 360.0 / (Math.PI*2);
	var rotate_degrees = layer.spoke_rot_offset * degrees_per_radian;
	var transform_attribute = `transform="rotate(${rotate_degrees})"`;

	var svg_elem = `<g data-layer-name="${layer.name}" ${transform_attribute} opacity=${layer.opacity}>`;

	var current_center = new fnc2d.Point(0, -layer.spoke_length);

	var rotation = my2d.TWO_PI / layer.number_of_spokes;

	var in_spoke_transform = 0;
	var in_spoke_rotation_per_point = (layer.spoke_end_rot / layer.number_of_points) * degrees_per_radian;
	var spoke_template = "";
	var distance_between_points = layer.spoke_length / layer.number_of_points;
	for (var cur_point = 0; cur_point < layer.number_of_points; cur_point +=1 )
	{
		var current_circle = svgee.circle(	0, 
														-distance_between_points * (cur_point + 1), 
														layer.radius, 
														`rotate(${in_spoke_transform})`,
														circle_style);

		spoke_template += current_circle;

		in_spoke_transform += in_spoke_rotation_per_point;
	}

	// note that spokes are ALL generated at zero rotation, and the sub-layer rotation is used to spin them into the spoke's
	// final rotation
	// TODO: better name
	var current_spoke_rotation = 0.0;

	for (var current_spoke = 0; current_spoke < layer.number_of_spokes; current_spoke += 1)
	{
		var current_spoke_rotation_degrees = current_spoke_rotation * degrees_per_radian;
		var current_sub_transform_attribute = `transform="rotate(${current_spoke_rotation_degrees})"`;

		svg_elem += `<g data-spoke-name="${layer.name}_spoke_${current_spoke}" ${current_sub_transform_attribute}>`;

		// var current_circle = svgee.circle(	current_center.x, current_center.y, 
		// 												layer.radius,
		// 												{ stroke_width:layer.stroke_width, stroke:layer.stroke, fill:layer.fill });

		// svg_elem += current_circle;
		svg_elem += spoke_template;

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
*/
// ============================================================================
// ============================================================================

// ----------------------------------------------------------------------------
// only doin' circles for now
// TODO: could just clone each spoke, then rotate
MandalaSVGRenderer.MandalaSVGRenderer.prototype.renderLayer = function(layer)
{
	var circle_style = { stroke_width:layer.stroke_width, stroke:layer.stroke, fill:layer.fill };

	var rotation = (Math.PI * 2) / layer.number_of_spokes;

	const degrees_per_radian = 360.0 / (Math.PI*2);
	var rotate_degrees = layer.spoke_rot_offset * degrees_per_radian;
	var transform_attribute = `transform="rotate(${rotate_degrees})"`;

	var svg_elem = `<g data-layer-name="${layer.name}" ${transform_attribute} opacity=${layer.opacity}>`;

	// var layer_petal = layer.petal_prototype;

	// generate a template for the spokes
	var spoke_template = "";

	// TODO: get rid of hidden coupling to transition_class here!
	var transition_config = { start:layer.start_radius, end:layer.end_radius, number_of_steps:layer.number_of_points };
	var radius_transition = new transition_class.Transition( transition_config );

	// ----------------------------------------------------
	layer.points.forEach( (cur_point) => {

		var current_circle = svgee.circle(	cur_point.x, 
			cur_point.y, 
			radius_transition.next(),
			"", 
			circle_style);

		spoke_template += current_circle;

		// current_radius += layer.radius_growth;
	});

// render each spoke
	// note that spokes are ALL generated at zero rotation, and the sub-layer rotation is used to spin them into the spoke's
	// final rotation
	// TODO: better name
	var current_spoke_rotation = 0.0;

	for (var current_spoke = 0; current_spoke < layer.number_of_spokes; current_spoke += 1)
	{
		var current_spoke_rotation_degrees = current_spoke_rotation * degrees_per_radian;
		var current_sub_transform_attribute = `transform="rotate(${current_spoke_rotation_degrees})"`;

		svg_elem += `<g data-spoke-name="${layer.name}_spoke_${current_spoke}" ${current_sub_transform_attribute}>`;

		svg_elem += spoke_template;

		svg_elem += `</g>`;	// spoke grouping

		current_spoke_rotation += rotation;
	}

	svg_elem += '</g>'; // layer grouping

	return svg_elem;
}

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
		// var current_element = this.renderLayer(this.mandala.getLayer(current_layer_name));
		this.layer_elements.push(current_element);

		svg_elem += current_element;
	});

	svg_elem += "</svg>";
	
	return svg_elem;

};

};
