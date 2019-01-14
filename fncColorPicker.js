'use strict';

// TODO: test for jquery
// TODO: test for fnc2d?

// TODO: validate config
// TODO: configurable background color?
// TODO: functionize
// TODO: make pieces percentages of size

var fncColorPicker =
{
	// ----------------------------------------------------------------------------
	// receives : config { 	size:number, 
	//								container_div_id:string
	//								color_picked_handler:function
	//								OPTIONAL:
	//								num_slices:number }
	Create: function(config)
	{
		// --------------------------------------------------------------------------
		// draws center cirlce in hue, looks like
		// better name, this is more render-y than set-y
		this.setHue = function(hue)
		{
			var canvas = this.$wheel_canvas[0];

			var context = canvas.getContext('2d');

			// probably should be in a function or, something
			context.beginPath();
			context.arc(	this.container_center_point.x, this.container_center_point.x, 
								this.center_circle_radius, 
								0, 2 * Math.PI, false);
			context.fillStyle = `hsl(${hue},100%,50%)`;
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = '#AAAAAA';
			context.stroke();
		}

		// --------------------------------------------------------------------------
		this.isOverColorWheel = function(x, y)
		{
			// (radius - stroke_width/2) <= point <= (radius + stroke_width/2)
			var over_wheel = false;

			var test_point = new fnc2d.Point(x,y);
			var distance = test_point.delta(this.container_center_point).length();

			if (		(distance >= (this.wheel_radius - (this.wheel_stroke_width / 2))) 
					&& (distance <= (this.wheel_radius + (this.wheel_stroke_width / 2))) )
			{
				over_wheel = true;
			}

			return over_wheel;
		};

		// ----------------------------------------------------------------------
		this.angleToBasis = function(x, y)
		{
			var test_point = new fnc2d.Point(x,y);
			var test_line = this.container_center_point.delta(test_point);

			// console.log("test line:" + test_line.str())
			var angle_to_basis = test_line.angleTo(this.basis_line);

			// assumes y-up is negative (most device coordinate systems)
			if (test_line.p2.y < 0)
			{
				angle_to_basis = Math.PI * 2 - angle_to_basis;
			}

			angle_to_basis -= this.rot_offset;

			while (angle_to_basis < 0)
			{ angle_to_basis += Math.PI * 2; }
			while (angle_to_basis > Math.PI*2 )
			{ angle_to_basis -= Math.PI*2; }

			return angle_to_basis;
		}

		// ======================================================================
		// receives: config:{	context:canvas_context,
		//								num_slices:number,
		//								cx:number,
		//								cy:number,
		//								radius:number,
		//								rot_offset:number,
		//								width:number }
		this.renderWheel = function(config)
		{
			const slice_sweep_rads = (Math.PI * 2) / config.num_slices;

			for (var cur_slice = 0; cur_slice < config.num_slices; cur_slice += 1)
			{
				var start_color = cur_slice * slice_sweep_degrees;
	
				config.context.beginPath();
				config.context.arc(	config.cx, config.cy,
											config.radius, 
											config.rot_offset + (cur_slice * slice_sweep_rads),
											// little extra to cover gaps at ends
											config.rot_offset + ((cur_slice+1) * slice_sweep_rads + 0.01), 
											false);
				// ctx.strokeStyle = gradient;
				ctx.strokeStyle = `hsl(${cur_slice * slice_sweep_degrees},100%,50%)`;
				ctx.lineWidth = config.width;
				ctx.lineCap = 'butt';
				ctx.stroke();
			}	// end for cur_slice
		};

		// ======================================================================
		var default_num_slices = 64;
		var default_hue = 0;

		this.color_picked_handler = config.color_picked_handler;
		this.container_center_point = new fnc2d.Point(config.size/2, config.size/2);
		this.container_size = config.size;
		this.center_circle_radius = 50;
		this.wheel_stroke_width = 100;	// todo: configure as % of size
		// TODO: complete control of initial color
		this.hue = config.hasOwnProperty("hue") ? config.hue : default_hue;

		this.$container_div = $("<div></div>");

		this.$container_div.attr("id", config.container_div_id);	

		var div_style =
		{
			"display":"inline-block",
			"margin":"0px",
			"padding":"0px",
			"width":`${this.container_size}px`,
			"height":`${this.container_size}px`,
			// "border-width":"1px",
			// "border-color":"black",
			// "border-style":"solid",
			// "background-color":`hsl(${this.hue},100%,50%)`,
		};

		this.$container_div.css( div_style );

		this.$container_div.mousemove( function(event) {
			var coords = getRelativeCoordinates(event, this.$container_div[0]);
			if (this.isOverColorWheel(coords.x,coords.y))
			{
				var angle_to_basis = this.angleToBasis(coords.x,coords.y);

				this.hue = angle_to_basis * (360 / (Math.PI*2));
				// TODO: make function!
				// this.$container_div.css("background-color", `hsl(${this.hue},100%,50%)`);
				this.setHue(this.hue);
			}
		}.bind(this));

		this.$container_div.click( function(event) {
			event.stopPropagation();
			this.color_picked_handler({hue:this.hue, saturation:100, lightness:50});
		}.bind(this));

		this.$wheel_canvas = $("<canvas></canvas>");
		this.$wheel_canvas.attr("width", this.container_size);
		this.$wheel_canvas.attr( "height", this.container_size);

		this.$container_div.append(this.$wheel_canvas);

		var canvas = this.$wheel_canvas[0];

		// todo: move rendering to a function ?
		var ctx = canvas.getContext('2d');

		var num_slices = config.hasOwnProperty("num_slices") ? config.num_slices : default_num_slices;
		this.wheel_radius = (this.container_size / 2) - (this.wheel_stroke_width / 2);

		// radians of each slice
		const slice_sweep_rads = (Math.PI*2) / num_slices;
		const slice_sweep_degrees = 360.0 / num_slices;

		this.rot_offset = config.hasOwnProperty("rot_offset") ? config.rot_offset : 0;

		// make basis_line that points to rotation zero (without rot_offset)
		this.basis_line = new fnc2d.Line([0,0], [this.container_size/2, 0]);

		// ---- RENDER ----
		this.renderWheel( {	context:ctx,
									num_slices:num_slices,
									cx:this.container_center_point.x,
									cy:this.container_center_point.y,
									radius:this.wheel_radius,
									rot_offset:this.rot_offset,
									width:this.wheel_stroke_width } );

		return this;
	},	// end Create

}; // end fncColorPicker
