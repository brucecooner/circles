/* TODO:
* class with functions for easier use (just get values, report to console, etc.)
* make non-validated parameter reporting optional
* optionally throw (for easier detection)
*/
// validators: { min, max, validate_fn }
// validate_fn : returns "".length  == 0, valid OR "".length > 0, not valid
function generateValidatorFunctions(validators_obj)
{
	// -------------------------------------------------------------------------
	function validateObject(test_obj, report_non_validated_properties = false )
	{
		var result = 
		{
			passed:true,
			// non_validated_properties: [],
			missing_properties: [],
			failed_values: {},	// { property_name : "reason", ...}
		};

		// non-validated properties
		// TODO: good idea, make optional
		if ( report_non_validated_properties )
		{
			result.non_validated_properties = [];
			Object.keys(test_obj).forEach( (current_object_key) => {
				if (false == validators_obj.hasOwnProperty(current_object_key))
				{
					result.non_validated_properties.push(current_object_key);
				}
			});
		}

		Object.keys(validators_obj).forEach( (current_validator_key) => {
			if (!test_obj.hasOwnProperty(current_validator_key))
			{
				result.missing_properties.push(current_validator_key);
			}
			else
			{
				// var current_validator = validators_obj[current_validator_key];
				var current_test_value = test_obj[current_validator_key];

				validate_result = validateValue(current_validator_key, current_test_value);

				if (false == validate_result.passed)
				{
					result.failed_values[current_validator_key] = result.reason;
				}
			}
		});

		// note: not considering a non-validated property to be a failure
		if ( result.missing_properties.length || result.failed_values.length)
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
							reason:""}; // "" == no failure

		// non-validated?
		// note: does NOT trigger failure
		if (false == validators_obj.hasOwnProperty(name))
		{
			result.no_validator = true;
		}
		else
		{
			var validator = validators_obj[name];

			if (validator.validate_fn)
			{
				result.reason = validator.validate_fn(value);
			}

			if (result.reason.legnth <= 0)
			{
				if (		value < validator.min
						||	value > validator.max )
				{
					result.reason = `value ${value} outside of range [${validator.min},${validator.max}`;
				}
			}

			result.passed = result.reason.length <= 0;
		}

		return result;
	}

	return { validateObject, validateValue };
};
