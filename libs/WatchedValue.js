WatchedValue =
{
   Create:function(initialValue, setCallbacks)
   {
      let obj =
      {
         currentValue:initialValue,
         setterCallbacks:setCallbacks,
      }

      // ------------------
      // called whenever value is set
      function addSetCallback(addedCallback)
      { obj.setterCallbacks.push(addedCallback) }
      obj.addSetCallback = addSetCallback

      function setFunc(newValue, use_callbacks = true )
      {
         obj.currentValue = newValue

			if ( use_callbacks )
			{
				obj.setterCallbacks.forEach( function(currentCallback)
				{
					currentCallback(obj.currentValue)
				})
			}
      }
      obj.set = setFunc

      function getFunc()
      { return obj.currentValue }
      obj.get = getFunc

      return obj
   }

}
