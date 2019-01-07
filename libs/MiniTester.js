function MiniTester(test_name, test_object, test_list)
{
	// returns: { tests_passed:number, tests_failed:number, messages:[string,...]}
	function test()
	{
		var test_messages = [];

		function logMessage(message) {
			test_messages.push(message);
		}

		logMessage(`--- begin ${test_name} tests ---`);

		var total_tests = 0;
		var successful_tests = 0;

		test_list.forEach( (current_test_fn_name) => 
		{
			total_tests += 1;
			var current_test_successful = true;

			logMessage(`${current_test_fn_name}...`);

			try {
				if (null !== test_object) 
				{
					test_object[current_test_fn_name]();
				}
				else
				{
					current_test_fn_name();
				}
			}
			catch (err) {
				logMessage(`   failed with message: ${err}`);
				current_test_successful = false;
			}

			if (current_test_successful)
			{
				logMessage("   passed");
				successful_tests += 1;
			}
			// no else, failure is reported above
		});

		logMessage("--- all tests complete ---");
		logMessage(`${successful_tests}/${total_tests} passed`);

		return { tests_passed:successful_tests, tests_failed:total_tests - successful_tests, messages:test_messages };
	}

	return { "test":test };
};