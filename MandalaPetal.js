// TODO: rename to something that indicates this is just a point generator
function initMandalaPetal()
{
	var default_petal_parameters = {
		number_of_points:2,
		length:50,

		end_rot:0,	// rotated offset of end of line from beginning (can be +/-)

		// sine wave  /\/\/\/
		amplitude:0,				// if >0, points are along a sine curve with this amplitude
		sine_length:Math.PI * 2,	// rotational distance of sine x coordinate

		mirror:false,	// if true, points are mirrored about the base line
	};

// ============================================================================
class MandalaPetal
{
	get sine_points() 				{ return sine_curve_points; };
	get default_parameters()		{ return default_petal_parameters; };
	get max_amplitude()				{ return 50; };
	get max_number_of_points()		{ return 50; };
	get max_sine_rot()				{ return Math.PI * 2; };
	get min_sine_length()			{ return Math.PI; };
	get max_sine_length()			{ return Math.PI * 2; };

	get use_sine_curve()				{ return this.amplitude > 0.0 || this.number_of_points == 1; };

	// -------------------------------------------------------------------------
	constructor(parameters)
	{
		Object.assign(this, this.default_parameters);
		Object.assign(this, parameters);

		// currently amorphous piece through which pieces pass on the way to being generated
		this.points_pipeline = [];

		this.base_points = this.generateBasePoints();

		// points list?
		this.points = this.generatePoints();
	};

	// -------------------------------------------------------------------------
	// generates points along a "baseline" going from 0 to 1 at
	// intervals calculated from the number_of points.
	// With no sine curve this line is straight and the sampling is straightforward.
	// If amplitude is specified, however, the points are generated along a sine curve 
	// from rotation == 0 to rotation this.sine_length
	// given N segments, points lie at greater-x end of the N segments
	// ex. N == 3  (+ == point)
	// 0                1
	// -----+-----+-----+
	generateBasePoints()
	{
		var base_points = [];
		
		if (false == this.use_sine_curve)
		{
			var point_frequency = 1 / this.number_of_points;
			for (var current_index = 0; current_index < this.number_of_points; current_index += 1)
			{
				// note: +1 on index, to shift points to larger-x end of segments
				base_points.push( {x:0, y:((current_index + 1) * point_frequency) * this.length} );
			}
		}
		else
		{
			base_points = generateSinePoints(this.number_of_points, this.sine_length);
		}

		return base_points;
	};

	// -------------------------------------------------------------------------
	// takes base points and generates final points based on transform aspects
	generatePoints(base_points)
	{
		var points = [];
		var cur_point = {};

		this.base_points.forEach( (cur_base_point) => {
			// note that x and y are swapped so that points go up in screen/device coordinates
			// TODO: I think the x should actually be -y, or else it's REFLECTING around x=y, investigate
			cur_point = { x:cur_base_point.y, y:cur_base_point.x };

			cur_point.y *= this.length;
			if (this.use_sine_curve)
			{
				cur_point.x *= this.amplitude;
			}

			points.push(cur_point);
		});

		return points;
	}

	// =========================================================================
	// TESTING
	has_all_expected_parameters()
	{
		var missing_properties = [];

		Object.keys(default_petal_parameters).forEach( (current_key) => {
			if (!this.hasOwnProperty(current_key))
			{
				missing_properties.push(current_key);
			}
		});

		if (missing_properties.length)
		{
			throw `petal is missing properties ${missing_properties.join()}`;
		}
	}

	// -------------------------------------------------------------------------
	all_parameters_within_ranges()
	{
		var out_of_range_properties = [];

		if (this.number_of_points <= 0 || this.number_of_points > this.get_max_number_of_points)
		{ out_of_range_properties.push("number_of_points"); };

		if (Math.abs(this.amplitude) > this.max_amplitude)
		{ out_of_range_properties.push("amplitude");	}

		if (this.length <= 0 || this.length > this.max_length)
		{ out_of_range_properties.push("length"); }

		if (Math.abs(this.end_rot) > this.max_sine_rot)
		{ out_of_range_properties.push("end_rot"); }

		if (sine_length < this.min_sine_length || sine_length > this.max_sine_length)
		{ out_of_range_properties.push("sine_length"); }

		if (out_of_range_properties.length)
		{
			throw `properties ${out_of_range_properties.join()} were out of range`;
		}
	}

	// -------------------------------------------------------------------------
	// returns error array if errors, [] otherwise
	testIntegrity()
	{
		var results = [];

		var test_list = [
			"has_all_expected_parameters",
			"all_parameters_within_ranges",
		];

		var integrity_tester = new MiniTester("mandala int chk", this, test_list );

		var results = integrity_tester.test();

		if (results.tests_failed > 0)
		{
			results.messages.forEach( (current_message) => {
				results.push(current_message);
			});
		}

		return results;
	};

};	// end class MandalaPetal

return MandalaPetal;

}; // end iife