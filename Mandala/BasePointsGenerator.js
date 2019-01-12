function init_BasePointsGenerator()
{

// -------------------------------------------------------------------------
// generates a specified number of points spaced along the sine curve,
// over total_rotations (2PI == 1 complete travel over curve)
// resulting points are normalized from -1,-1...1,1
function generateSinePoints(num_points, total_rotation)
{
	const sine_length_0_2pi = 7.640395578;
	const TWO_PI = Math.PI * 2;
	// const rot_step = 0.01;

	// var total_rotation = num_sine_iterations * TWO_PI;  
	var total_distance = sine_length_0_2pi * (total_rotation / TWO_PI);

	// (0..total_rotation) => (0..1)
	const x_normalizer = 1 / total_rotation;
	// y, being the result of sine(), is already normalized

	// cut sine curve into n segments, take point at greater end
	// of segments (so NO point at rotation=0)
	var distance_between_points = total_distance / (num_points);

	// how far to step along rotation axis on each iteration
	// should be small enough to guarantee good accuracy
	var rot_step = distance_between_points / 10;
	// console.log("rot_step:" + rot_step);

	// start at end so that last point is placed at EXACTLY total_rotation
	var current_rot = total_rotation;

	points = [];

	var last_point = { x:total_rotation * x_normalizer, y:Math.sin(total_rotation)};
	var points_generated = 1;

	var current_accum_distance = 0.0;
	var last_x = total_rotation; 
	var last_y = last_point.y;

	points.push(last_point);

	while (points_generated < num_points)
	{
		current_rot -= rot_step;

		cur_x = current_rot;
		cur_y = Math.sin(current_rot);

		var delta_x = cur_x - last_x;
		var delta_y = cur_y - last_y;

		var cur_distance = Math.hypot(delta_x, delta_y);

		current_accum_distance += cur_distance;
		// potential for error here -v
		if (current_accum_distance >= distance_between_points)
		{
			// console.log("current error: " + (current_accum_distance - distance_between_points));

			last_point = { x:cur_x * x_normalizer, y:cur_y };

			points.push(last_point);

			points_generated += 1;
			// remove error from next iteration (so they don't accumulate)
			var current_error = current_accum_distance - distance_between_points;
			current_accum_distance = current_error;
			
		}

		last_x = cur_x;
		last_y = cur_y;
	};  // end while

	return points;
};

// ============================================================================
// generates points along a line going from 0 to this.length at intervals calculated 
// from the number_of points. 
// This line can be straight or taken from sine(x) (triggered by amplitude > 0)
// Given N segments, points lie at greater-x end of the N segments
// ex. N == 3  (+ == point)
// 0                1
// -----+-----+-----+
//
// For sine curves, sine goes from rotation 0 to sine_length
function generateBasePoints(config)
{
	var base_points = [];
	
	if (false == (config.amplitude && config.number_of_points > 1 ))
	{
		var point_frequency = 1 / config.number_of_points;
		for (var current_index = 0; current_index < config.number_of_points; current_index += 1)
		{
			// note: +1 on index, to shift points to larger-x end of segments
			base_points.push( {x:((current_index + 1) * point_frequency), y:0 } );
		}
	}
	else
	{
		base_points = generateSinePoints(config.number_of_points, config.sine_length);
	}

	return base_points;
};

	// -------------------------------------------------------------------------
	// takes base points and generates final points based on transform aspects
	// generatePoints(base_points)
	// {
	// 	var points = [];
	// 	var cur_point = {};

	// 	this.base_points.forEach( (cur_base_point) => {
	// 		// note that x and y are swapped so that points go up in screen/device coordinates
	// 		// TODO: I think the x should actually be -y, or else it's REFLECTING around x=y, investigate
	// 		cur_point = { x:cur_base_point.y, y:cur_base_point.x };

	// 		cur_point.y *= this.length;
	// 		if (this.use_sine_curve)
	// 		{
	// 			cur_point.x *= this.amplitude;
	// 		}

	// 		points.push(cur_point);
	// 	});

	// 	return points;
	// }

	return generateBasePoints;
};	// end iife

