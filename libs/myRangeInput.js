// range input, placed within a particular div (could be
// other stuff I guess) and calling a callback when the range changes, also
// gives you a callback to change the range input externally
myRangeInput = {
   // config :
   // id:range element id
   // containerId:div(whatev) that will contain range
   // min, max : min/max values
   // step : step value
   // initValue: initial value
   // onInputHandler:handler for range element oninput,
   //          should receive a string (will be range element id) and
   //          number (value of range)
   createRange:function(config)
   {
      console.log(`createRange() : ${config.id}`)

      containerEl = document.getElementById(config.containerId)

      if (null != containerEl)
      {
         let newRangeEl = document.createElement('input')
         newRangeEl.type = 'range'
         newRangeEl.id = config.id

         // ---------------------------------------
         function myInputHandler(evt)
         {
				let myOuterHandler = config.onInputHandler
				

            elem = evt.target
            value = parseFloat(elem.value)
            myOuterHandler(value, elem.id)
         }

         newRangeEl.oninput = myInputHandler

         if (config.hasOwnProperty('min'))
         { newRangeEl.min = config.min }

         if (config.hasOwnProperty('max'))
         { newRangeEl.max = config.max }

         if (config.hasOwnProperty('step'))
         { newRangeEl.step = config.step }

         if (config.hasOwnProperty('initialValue'))
			{ newRangeEl.value = config.initialValue }
			
			if (config.hasOwnProperty('wheelStep'))
			{ 
				newRangeEl.addEventListener("wheel", function(evt) {
					deltaY = evt.deltaY;

					var currentValue = parseFloat(newRangeEl.value);

					if (deltaY < 0) // forward
					{
						currentValue += config.wheelStep;
					}
					else // back
					{
						currentValue -= config.wheelStep;
					}

					currentValue = Math.min( Math.max(currentValue, config.min), config.max);
					newRangeEl.value = currentValue;
					config.onInputHandler( currentValue, newRangeEl.id);
			  });
			}

         containerEl.appendChild(newRangeEl)

         function setRangeValue(newValue)
         {
            newRangeEl.value = newValue
         }
         return setRangeValue
      }
      else
      {
         console.log(`myRangeInput:could not get container:${config.containerId}`)
      }

      // if got here, return empty func
      function noop(newValue){}
      return noop
   }

}
