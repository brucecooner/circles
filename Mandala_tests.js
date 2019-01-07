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
class MandalaTester
{
	get log_channel()						{ return "mandala_tests"; };

	// -------------------------------------------------------------------------
	test_Init()
	{
		var mandala = new Mandala();

		if (mandala.getLayerCount() > 0) {
			throw "new mandala contained >0 layers";
		}
		if (mandala.layers_order.length > 0) {
			throw "new mandala layers_order.length > 0";
		}
	}

	// -------------------------------------------------------------------------
	test_addFirstLayer()
	{
		var mandala = new Mandala();

		var layer_name = mandala.addCirclesLayer();

		if (mandala.getLayerCount !== 1) {
			throw "mandala does not have exactly 1 layer";
		}
		if (mandala.layers_order.length !== 1) {
			throw "layers_order.length !== 0";
		}
	}

	// -------------------------------------------------------------------------
	constructor()
	{
		this.test_list = [
			"test_Init",
		];

		this.tester = new MiniTester("Mandala", this, this.test_list );
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
