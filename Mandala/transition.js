/*
config:
	start:number
	end:number
	steps:number
*/

function initTransition()
{
	console.log("initTransition()");

	var transition = {};

	transition.default_transition = {
		start:0.0,
		end:1.0,
		number_of_steps:1,
	};

	// -------------------------------------------------------------------------
	// TODO: validate config?
	transition.Transition = function(config)
	{
		Object.assign(this, transition.default_transition);
		Object.assign(this, config);

		if (this.number_of_steps < 1)
		{
			this.number_of_steps = 1;
		}

		this.current_t = 0.0;	// 0..1
		this.t_delta = 1.0 / this.number_of_steps;

		this.reset();
	};

	// -------------------------------------------------------------------------
	transition.Transition.prototype.reset = function()
	{
		this.current_t = 0.0;
	}

	// -------------------------------------------------------------------------
	transition.Transition.prototype.delta = function()
	{
		return this.end - this.start;
	}

	// -------------------------------------------------------------------------
	transition.Transition.prototype.next = function()
	{
		// TODO: expose this
		// var cos_value = Math.cos(this.current_t * Math.PI);
		// cos_value += 1.0; // 1..-1 => 2..0
		// cos_value *= 0.5;	// 2..0 => 1..0
		// cos_value = 1.0 - cos_value;
		// var current = this.start + (this.delta() * cos_value);

		var current = this.start + (this.delta() * this.current_t);

		this.current_t = Math.min(1.0, this.current_t + this.t_delta);
		
		return current;
	}

	return transition;

};	// end initTransition()