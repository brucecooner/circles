// ============================================================================
// TODO:
//		* test adding second layer, layers_order correct
//		* test adding third layer, layers_order correct
//		* test removing all layers
//		* test removing second (of 3) layers, layers_order_correct
//		* test removing last layer
//		* test removing first layer
//		* test cloning layer
//		* test to/from json
class FractalaTester
{
	get log_channel()						{ return "fractala_tests"; };

	// -------------------------------------------------------------------------
	test_Init()
	{
		var fractala = new Fractala();

		if (fractala.getLayerCount() > 0) {
			throw "new fractala contained >0 layers";
		}
		if (fractala.layers_order.length > 0) {
			throw "new fractala layers_order.length > 0";
		}
	}

	// -------------------------------------------------------------------------
	test_addFirstLayer()
	{
		var fractala = new Fractala();

		var layer_name = fractala.addCirclesLayer();

		if (fractala.getLayerCount !== 1) {
			throw "fractala does not have exactly 1 layer";
		}
		if (fractala.layers_order.length !== 1) {
			throw "layers_order.length !== 0";
		}
	}

	// -------------------------------------------------------------------------
	constructor()
	{
		this.test_list = [
			"test_Init",
		];

		this.tester = new MiniTester("Fractala", this, this.test_list );
	}

	// -------------------------------------------------------------------------
	test()
	{
		var results = this.tester.test();

		results.messages.forEach( (current_message) => {
			console.log(current_message);
		});
	}
};
