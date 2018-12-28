function svgColorWheel()
{
	var num_slices = 12;

	var svg_elem = `<svg width="100px" height="100px" id="mySVG" viewbox="-50 -50 100 100">`;

	var current_spoke = 0;

	var current_rot = 0;

	var cur_hue = 0;
	var cur_saturation = 100;
	var cur_lightness = 50;

	var radians_per_slice = my2d.TWO_PI / num_slices;

	var cur_edge_point = new fnc2d.Point(0, 50);

	for (current_spoke = 0; current_spoke < num_spokes; current_spoke += 1 )
	{
		var current_fill = `hsl(${cur_hue},${cur_saturation},${cur_lightness})`;

		var point_1 = cur_edge_point;
		cur_edge_point = cur_edge_point.rotate()

		svg_elem += `<g transform="rotate(${current_rot})">`;
		svg_elem += `<polygon points="0,0 0,50 5,50" style="fill:${current_fill};stroke:purple;stroke-width:1" />`;
		svg_elem += "</g>";

		current_rot += 360.0 / num_spokes;
	}

	svg_elem += "</svg>";

}

/*
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" viewBox="-10 -10 220 220">
  <defs>
    <linearGradient id="redyel" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ff0000"/>   
        <stop offset="100%" stop-color="#ffff00"/>   
    </linearGradient>
    <linearGradient id="yelgre" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ffff00"/>   
        <stop offset="100%" stop-color="#00ff00"/>   
    </linearGradient>
    <linearGradient id="grecya" gradientUnits="objectBoundingBox" x1="1" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#00ff00"/>   
        <stop offset="100%" stop-color="#00ffff"/>   
    </linearGradient>
    <linearGradient id="cyablu" gradientUnits="objectBoundingBox" x1="1" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#00ffff"/>   
        <stop offset="100%" stop-color="#0000ff"/>   
    </linearGradient>
    <linearGradient id="blumag" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#0000ff"/>   
        <stop offset="100%" stop-color="#ff00ff"/>   
    </linearGradient>
    <linearGradient id="magred" gradientUnits="objectBoundingBox" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stop-color="#ff00ff"/>   
        <stop offset="100%" stop-color="#ff0000"/>   
    </linearGradient>
  </defs>

  <g fill="none" stroke-width="15" transform="translate(100,100)">
    <path d="M 0,-100 A 100,100 0 0,1 86.6,-50" stroke="url(#redyel)"/>
    <path d="M 86.6,-50 A 100,100 0 0,1 86.6,50" stroke="url(#yelgre)"/>
    <path d="M 86.6,50 A 100,100 0 0,1 0,100" stroke="url(#grecya)"/>
    <path d="M 0,100 A 100,100 0 0,1 -86.6,50" stroke="url(#cyablu)"/>
    <path d="M -86.6,50 A 100,100 0 0,1 -86.6,-50" stroke="url(#blumag)"/>
    <path d="M -86.6,-50 A 100,100 0 0,1 0,-100" stroke="url(#magred)"/>
  </g>
</svg>

*/