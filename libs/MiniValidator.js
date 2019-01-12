/* TODO:
* class with functions for easier use (just get values, report to console, etc.)
* make non-validated parameter reporting optional
*/

function generateValidatorFunctions(validators_obj)
{
	// -------------------------------------------------------------------------
	function validateObject(test_obj)
	{
		var result = 
		{
			passed:true,	// could just ditch this
			missing_properties: [],
			invalid_values: [],
			non_validated_properties: [],
		};

		// non-validated properties
		// TODO: good idea, make optional
		// Object.keys(test_obj).forEach( (current_object_key) => {
		// 	if (false == validators_obj.hasOwnProperty(current_object_key))
		// 	{
		// 		result.non_validated_properties.push(current_object_key);
		// 	}
		// });

		Object.keys(validators_obj).forEach( (current_validator_key) => {
			if (!test_obj.hasOwnProperty(current_validator_key))
			{
				result.missing_properties.push(current_validator_key);
			}
			else
			{
				var current_validator = validators_obj[current_validator_key];
				var current_test_value = test_obj[current_validator_key];

				if (		current_test_value < current_validator.min
						||	current_test_value > current_validator.max )
				{
					result.invalid_values.push(`${current_validator_key}(${current_test_value})`);
				}
			}
		});

		// note: not considering a non-validated property to be a failure
		if ( result.missing_properties.length || result.invalid_values.length)
		{
			result.passed = false;
		}

		return result;
	};

	// -------------------------------------------------------------------------
	function validateValue(name, value)
	{
		var result = {	passed:true, 
							no_validator:false, 
							invalid_value:false };

		// non-validated?
		// note: does NOT trigger failure
		if (false == validators_obj.hasOwnProperty(name))
		{
			result.no_validator = true;
		}
		else
		{
			var validator = validators_obj[name];

			if (		value < validator.min
					||	value > validator.max )
			{
				result.passed = false;
				result.invalid_value = true;;
			}
		}

		return result;
	}

	return { validateObject, validateValue };
};
