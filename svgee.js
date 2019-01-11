// svgee
'use strict';

// TODO:
// Wrap in IFF

// ============================================================
// functions to generate svg related tags

var svgee_defaults = 
{
	stroke: "rgb(0,0,0)", 
	stroke_width: "1",
	fill: "none",
};

// ----------------------------------------------------------------------------
// todo: comment
function get_style(style_in = null)
{
	var new_style = svgee_defaults;

	if (style_in)
	{
		Object.assign(new_style, style_in);
	}

	return new_style;
};

var svgee = 
{
	// -------------------------------------------------------------------------
	svg: function()
	{
		return "<svg></svg>";
	},

	// -------------------------------------------------------------------------
	// todo: fill parameter
	circle: function(x, y, r, transform, style_in=null)
	{
		var _style = get_style(style_in);

		 return `<circle	cx="${x}"
								 cy="${y}"
								 r="${r}"
								 stroke="${_style.stroke}"
								 fill="${_style.fill}" 
								 stroke-width="${_style.stroke_width}"
								 transform="${transform}"
								 opacity="1.0"/>`;
	},
	
	// -------------------------------------------------------------------------
	// todo: optional stroke and color parameters?
	line : function(x1, y1, x2, y2, style_in = null)
	{
		var _style = get_style(style_in);

		 return `<line	x1="${x1}"
							  y1="${y1}"
							  x2="${x2}"
							  y2="${y2}"
							  stroke="${_style.stroke}"
							  stroke-width="${_style.stroke_width}" />`;
	}
	

};