'use strict';

// TODO: test for jquery
// TODO: test for fnc2d?

// TODO: validate config
// TODO: configurable background color?
// TODO: functionize <== ??
// TODO: make pieces percentages of size
// TODO: sort out exact detection of being "over" something

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
		this.drawCurrentColor = function()
		{
			function currentColorStrokeFn(slice_normalized, context, config)
			{
				context.strokeStyle = `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%)`;
			};

			this.renderWheel(this.current_color_wheel_slice_config, currentColorStrokeFn.bind(this));
		};

		// ----------------------------------------------------------------------
		// returns: -1 == not over wheel
		// 0..1 == over wheel, normalized position between wheel start/end
		this.isOverWheel = function(x,y, wheel_config)
		{
			var is_over = -1;

			var delta_x = x - this.container_center_point.x;
			var delta_y = y - this.container_center_point.y;
			var distance_from_center = Math.hypot(delta_x, delta_y);
			var in_radius = wheel_config.inner_radius < distance_from_center
									&& distance_from_center < wheel_config.outer_radius;

			if (in_radius)
			{
				var angle_from_start_of_wheel = this.angleToBasis(x, y, wheel_config.begin_offset_radians);

				if (		0.0 <= angle_from_start_of_wheel >= 0.0 
						&& angle_from_start_of_wheel <= wheel_config.sweep_radians)
				{
					is_over = angle_from_start_of_wheel / (wheel_config.sweep_radians);
				}
			}
			
			return is_over;
		}

		// ----------------------------------------------------------------------
		this.angleToBasis = function(x, y, rot_offset)
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

			angle_to_basis -= rot_offset;

			while (angle_to_basis < 0)
			{ angle_to_basis += Math.PI * 2; }
			while (angle_to_basis > Math.PI*2 )
			{ angle_to_basis -= Math.PI*2; }

			return angle_to_basis;
		}

		// ======================================================================
		// receives:
		// config: {}
		// pre_stroke_fn(normalized_slice, context, config)
		this.renderWheel = function(config, pre_stroke_fn)
		{
			var ctx = this.canvas.getContext('2d');
			// var config = this.hue_pick_wheel_config;

			const slice_sweep_rads = config.sweep_radians / config.num_slices;
			// const slice_sweep_degrees = slice_sweep_rads * (180 / Math.PI);

			var stroke_width = config.outer_radius - config.inner_radius;
			var radius = config.outer_radius - (stroke_width / 2);

			for (var cur_slice = 0; cur_slice < config.num_slices; cur_slice += 1)
			{
				ctx.beginPath();
				ctx.arc(	this.container_size / 2, this.container_size / 2,
							radius, 
							config.begin_offset_radians + (cur_slice * slice_sweep_rads),
							// little extra to cover gaps at ends
							config.begin_offset_radians + ((cur_slice+1) * slice_sweep_rads + 0.01), 
							false);

				pre_stroke_fn(cur_slice / config.num_slices, ctx, config);

				ctx.lineWidth = stroke_width;
				ctx.lineCap = 'butt';
				ctx.stroke();
			}	// end for cur_slice
		}

		// ----------------------------------------------------------------------
		this.renderCombinedColorWheel = function()
		{
			// same for both axes
			var x_y = this.container_size /2;

			function combinedColorStrokeFn(slice_normalized, context, config)
			{
				// saturation 0 --> 100 over sweep
				// lightness 0 --> 100 with gradient
				var current_saturation = Math.floor(slice_normalized * 100);
				
				var grd = context.createRadialGradient(	x_y, x_y, config.inner_radius, 
																x_y, x_y, config.outer_radius);
				grd.addColorStop(0, `hsl(${this.hue},0%, ${current_saturation}%)`);
				grd.addColorStop(1, `hsl(${this.hue},100%, ${current_saturation}%)`);

				context.strokeStyle = grd;
			}

			this.renderWheel(this.combined_color_wheel_config, combinedColorStrokeFn.bind(this));
		}

		// ----------------------------------------------------------------------
		this.renderHueInstaPickWheel = function()
		{
			function hueStrokeFn(slice_normalized, context, config)
			{
				var current_hue = Math.floor( slice_normalized * 360 );
				context.strokeStyle = `hsl(${current_hue},100%,50%)`;
			};

			this.renderWheel(this.hue_instapick_wheel_config, hueStrokeFn.bind(this));
		}

		// receives:
		//		hue:number (0..360)
		this.calculateCurrentColorSliceBegin = function(at_hue)
		{
			const degs_to_rads = (Math.PI / 180);

			var begin = this.hue_instapick_wheel_config.begin_offset_radians + (at_hue * degs_to_rads);
			begin -= this.current_color_slice_sweep_rads / 2;
			return begin;
		};
		
		// ======================================================================
		// ======================================================================
		// ======================================================================
		// ======================================================================
		var default_hue = 0;
		var default_saturation = 100;
		var default_lightness = 50;

		this.color_picked_handler = config.color_picked_handler;
		this.container_center_point = new fnc2d.Point(config.size/2, config.size/2);
		this.container_size = config.size;
		this.center_circle_radius = 50;
		this.wheel_stroke_width = 100;	// todo: configure as % of size?

		// TODO: add function to set these from outside
		this.hue = config.hasOwnProperty("hue") ? config.hue : default_hue;
		this.saturation = config.hasOwnProperty("saturation") ? config.saturation : default_saturation;
		this.lightness = config.hasOwnProperty("lightness") ? config.lightness : default_lightness;

		// ----- wheel configs -----
		var hue_wheel_inner_radius = this.center_circle_radius;
		var hue_wheel_outer_radius = hue_wheel_inner_radius + 30;

		var two_pi = Math.PI * 2;
		var degs_to_rads = Math.PI / 180;

		// note that zero rotation is due right (positive x)
		// instantly select pure color
		this.hue_instapick_wheel_config = {
			num_slices:200,
			begin_offset_radians:-Math.PI / 2,	// 90 degrees counter
			sweep_radians:two_pi, //Math.PI,
			outer_radius:this.container_size / 2,
			inner_radius:this.container_size / 2 - 30,
			sat_gradient_start_radius: hue_wheel_outer_radius - 70, // + (hue_wheel_outer_radius - hue_wheel_inner_radius) / 2,
		};

		this.current_color_slice_sweep_rads = 30 * degs_to_rads;

		this.current_color_wheel_slice_config = {
			num_slices:1,
			begin_offset_radians: this.calculateCurrentColorSliceBegin(this.hue), //-(90 + 45) * degs_to_rads,
			sweep_radians: this.current_color_slice_sweep_rads,
			inner_radius:1, 
			outer_radius:this.hue_instapick_wheel_config.inner_radius,
		};


		// combines saturation and lightness into one wheel
		this.combined_color_wheel_config = {
			num_slices:175,
			begin_offset_radians: this.calculateCurrentColorSliceBegin(this.hue) + this.current_color_slice_sweep_rads,
			sweep_radians: two_pi - this.current_color_slice_sweep_rads,
			inner_radius:1, 
			outer_radius:this.hue_instapick_wheel_config.inner_radius - 10,
		};

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

			var instapick_hue_wheel_value = this.isOverWheel(coords.x,coords.y, this.hue_instapick_wheel_config);
			if ( instapick_hue_wheel_value >= 0)
			{
				this.hue = Math.floor(instapick_hue_wheel_value * 360);
				this.saturation = 100;
				this.lightness = 50;

				// todo: show hue arrow
				// var current_color_slice_begin_rads = this.calculateCurrentColorSliceBegin(this.hue);
				// this.current_color_wheel_slice_config.begin_offset_radians = current_color_slice_begin_rads;

				// console.log("cur color begin: " + current_color_slice_begin_rads);

				// var combined_color_wheel_begin_rads = current_color_slice_begin_rads;
				// combined_color_wheel_begin_rads += this.current_color_slice_sweep_rads;
				// this.combined_color_wheel_config.begin_offset_radians = combined_color_wheel_begin_rads;

				// console.log("combined color begin: " + combined_color_wheel_begin_rads);

				this.renderCombinedColorWheel();
				this.drawCurrentColor();
			}
			else 
			{
				var combined_color_wheel_value = this.isOverWheel(coords.x, coords.y, this.combined_color_wheel_config);

				if (combined_color_wheel_value >= 0)
				{
					// have to extract two axes, saturation and lightness
					// lightness comes from sweep
					this.lightness = Math.floor(combined_color_wheel_value * 100);
					// saturation comes from distance (wheel is conveniently centered at div center )
					var delta_x = coords.x - this.container_size / 2;
					var delta_y = coords.y - this.container_size / 2;
					var distance = Math.hypot(delta_x, delta_y);
					var normalized_to_wheel = distance / this.combined_color_wheel_config.outer_radius;
					this.saturation = Math.floor(normalized_to_wheel * 100);
					this.drawCurrentColor();
				}
			}
		}.bind(this));

		this.$container_div.click( function(event) {
			event.stopPropagation();

			var coords = getRelativeCoordinates(event, this.$container_div[0]);

			if (		( this.isOverWheel(coords.x, coords.y, this.combined_color_wheel_config) >= 0)
					||	( this.isOverWheel(coords.x, coords.y, this.current_color_wheel_slice_config) >= 0)
					||	this.isOverWheel(coords.x, coords.y, this.hue_instapick_wheel_config))
			{
				this.color_picked_handler({hue:this.hue, saturation:this.saturation, lightness:this.lightness});
			}
		}.bind(this));

		this.$wheel_canvas = $("<canvas></canvas>");
		this.$wheel_canvas.attr("width", this.container_size);
		this.$wheel_canvas.attr( "height", this.container_size);

		this.$container_div.append(this.$wheel_canvas);

		this.canvas = this.$wheel_canvas[0];

		this.wheel_radius = (this.container_size / 2) - (this.wheel_stroke_width / 2);

		// make basis_line that points to rotation zero (without rot_offset)
		this.basis_line = new fnc2d.Line([0,0], [this.container_size/2, 0]);

		// ---- RENDER ----
		this.renderHueInstaPickWheel();
		this.renderCombinedColorWheel();
		this.drawCurrentColor();

		return this;
	},	// end Create

}; // end fncColorPicker
