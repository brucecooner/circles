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
