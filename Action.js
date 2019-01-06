// receives:
//		config: { action_map:{string:function }};
function ActionInit() {
	var action_log_channel = "Action";

	// -------------------------------------------------------------------------
	function validateConfig(config)
	{
		if (!config.hasOwnProperty('action_map'))
		{
			console.log(action_log_channel, "ERROR: config must contain an action_map");
		}
	}

	// ============================================================================
	var ActionType = {
		add_layer:"add_layer" ,
		set_layer_property:"set_layer_property",
		set_editing_layers:"set_editing_layers",
		delete_layer:"delete_layer",
		highlight_layer:"highlight_layer",
		save:"save",
		restore:"restore",
		new_document:"new_document",
		clone_layer:"clone_layer",
	};

	// ============================================================================
	class Action
	{
		// -------------------------------------------------------------------------
		// receives:
		//		-action_type:string
		//		-layers:[string,...]
		//		-parameters:{layer_property:string, value:any}
		constructor(action_type, layers, parameters)
		{
			this.action_type = action_type;
			this.layers = layers;

			Object.assign(this, parameters);
		}
	};

	// =========================================================================
	// ACTION MAP
	// { ActionType: function}
	var action_map = null;
	// -------------------------------
	function setConfig(config)
	{
		validateConfig(config);
		action_map = config.action_map;
	}

	// =========================================================================
	// Action class
	// [ Action,...]
	var actions_queue = [];
	var processing_queue = false;
	function processActionQueue()
	{
		console.log(action_log_channel, "begin processing queue");
		processing_queue = true;
		while (actions_queue.length > 0)
		{
			// pull first action...
			var current_action = actions_queue[0];
			actions_queue.splice(0,1);
			dispatchAction(current_action);
		}
		processing_queue = false;
		console.log(action_log_channel, "done processing queue");
	}

// --------------------------------------------------------------------
function queueAction(action)
{
	actions_queue.push(action);

	// begin, if not already processing
	// TODO: may eventually want to make this on a timer or thread or something
	if (!processing_queue)
	{
		processActionQueue();
	}
}

// --------------------------------------------------------------------
function dispatchAction(action)
{
	console.log(action_log_channel, "dispatchAction()"); 
	console.log(action_log_channel, action);

	if (action_map.hasOwnProperty(action.action_type))
	{
		var action_handler = action_map[action.action_type];

		action_handler(action);
	}
	else
	{
		console.log(action_log_channel, `ERROR: action type ${action.action_type} not mapped to handler`);
	}
}

	// ----- RETURNED OBJECT -----
	return {
		ActionType:ActionType,
		Action:Action,
		setConfig:setConfig,
		queueAction:queueAction,
	}
};

