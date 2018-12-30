if (typeof LogChannels_t == "undefined")
{
	var LogChannels_t = {
		LogChannels:function()
		{
			// { enabled:boolean, captured:boolean? }
			// note: are enabled by default
			this.channels = {};

			this.original_console_log = console.log;
		}
	};

	// ----------------------------------------------------------------------------
	LogChannels_t.LogChannels.prototype.GetChannel = function(channel_name)
	{
		if ( !this.channels.hasOwnProperty(channel_name))
		{
			this.channels[channel_name] = { "enabled":true };
		}

		return this.channels[channel_name];
	}

	// ----------------------------------------------------------------------------
	LogChannels_t.LogChannels.prototype.EnableChannel = function(channel_name, enabled = true)
	{
		var channel = this.GetChannel(channel_name);

		channel.enabled = enabled;
	}

	// ----------------------------------------------------------------------------
	LogChannels_t.LogChannels.prototype.CaptureConsoleLog = function()
	{
		console.log = this.Log.bind(this);
	}

	// ----------------------------------------------------------------------------
	LogChannels_t.LogChannels.prototype.Log = function(...args)
	{
		var show_message = true;

		if (args.length > 1) 
		{
			const channel_name = args[0];

			show_message = this.GetChannel(channel_name).enabled;
		}

		if (show_message)
		{
			this.original_console_log(...args);
		}
	}

	// should be a singleton-ish, maybe, who knows what you get with javascript
	LogChannels = new LogChannels_t.LogChannels();
};

/*
// testing
function test_ChannelLog()
{
	// make a fresh one
	var testLog = new LogChannels_t.LogChannels();

	// should have no channels
	if (Object.getOwnPropertyNames(testLog.channels).length > 0)
	{
		throw "LogChannels should start with zero channels";
	}

	// a call to Log with one parameter should not add a channel
	testLog.Log("test1");
	if (Object.getOwnPropertyNames(testLog.channels).length > 0) {
		throw "LogChannels added a channel for a single argument log message";
	}

	// getting a channel should add one
	var test_channel_name = "testChannel1";
	var testChannel1 = testLog.GetChannel(test_channel_name);
	if (!testLog.channels.hasOwnProperty(test_channel_name)) {
		throw "LogChannels did not add a channel when GetChannel() was called.";
	}

	// and a newly added channel should be enabled by default
	if ( false == testLog.GetChannel(test_channel_name).enabled) {
		throw "LogChannels new channels should be enabled by default";
	}

	// toggling a channel
	testLog.EnableChannel(test_channel_name, false);
	if (true == testLog.GetChannel(test_channel_name).enabled) {
		throw "LogChannels did not toggle channel enabled to false";
	}

	testLog.EnableChannel(test_channel_name);
	if (true !== testLog.GetChannel(test_channel_name).enabled) {
		throw "LogChannels did not toggle channel enabled to true";
	}

	// TODO: test the output...somehow
	// -----------------------------------------
	console.log("LogChannels tests complete");
}

test_ChannelLog();
*/


