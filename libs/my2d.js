// TODO : not a huge fan of this ns scheme, find a better one?
var my2d = {

   TWO_PI:3.14159 * 2.0,

   // -----------------------------------------------------------------------------
   Point:function( x, y )
   {
      this.x = x;
      this.y = y;
   },

   // -----------------------------------------------------------------------------
   Line:function( point1, point2 )
   {
      this.p1 = point1;
      this.p2 = point2;
   },

   // -----------------------------------------------------------------------------
   rotatePoint:function(x, y, radians)
   {
      let cos = Math.cos(radians);
      let sin = Math.sin(radians);

      let rot_x = x * cos - y * sin;
      let rot_y = x * sin + y * cos;
      return {x:rot_x, y:rot_y}
   },

   // -----------------------------------------------------------------------------
   square:function(val)
   {
      return val * val;
   },

   // -----------------------------------------------------------------------------
   // receives : point1|point2:{x,y}
   distanceBetweenPoints:function(point1, point2)
   {
      let xDiff = point2.x - point1.x;
      let yDiff = point2.y - point1.y;
      return Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
   },

   // -----------------------------------------------------------------------------
   // receives: line{ p1:{x,y}, p2:{x,y}}
   // returns: number
   lineLength:function(line)
   {
      return my2d.distanceBetweenPoints( line.p1, line.p2);
   },

   // -----------------------------------------------------------------------------
   // receives: line1|line2:{p1:{x,y}, p2:{x,y}}
   dotProduct:function(line1, line2)
   {
      return ((line1.p2.x - line1.p1.x) * (line2.p2.x - line2.p1.x))
               + ((line1.p2.y - line1.p1.y) * (line2.p2.y - line2.p1.y));
   },

   // -----------------------------------------------------------------------------
   // receives : point: {x,y}, line:{p1:{x,y}, p2:{x,y}}
   distancePointToLine:function( point, line)
   {
      let numerator = Math.abs((line.p2.y - line.p1.y) * point.x - (line.p2.x - line.p1.x) * point.y + line.p2.x*line.p1.y - line.p2.y*line.p1.x);

      let denominator = Math.sqrt( my2d.square(line.p2.y - line.p1.y) + my2d.square(line.p2.x - line.p1.x) );

      return numerator / denominator;
   },

   // -----------------------------------------------------------------------------
   // technically the difference (p2 - p1), delta can be confused with distance
   // receives : point1|point2:{x,y}
   // returns : point:{x,y}
   delta:function( point1, point2 )
   {
      return { x:point2.x - point1.x, y:point2.y - point1.y };
   },

   // -----------------------------------------------------------------------------
   // receives: scale:number, line:{p1:{x,y}, p2:{x,y}}
   scaleLine:function(scale, line)
   {
      return { p1:{x:line.p1.x * scale, y:line.p1.y * scale},
               p2:{x:line.p2.x * scale, y:line.p2.y * scale}};
   },

   // -----------------------------------------------------------------------------
   // receives: point:{x,y}, line:{p1|p2:{x,y}}
   reflectPoint:function( point, line )
   {
      // assuming line and point are in same coordinate space, of course, let's move
      // both to the origin so maths is easier
      let lineLocal = Object.assign({}, line);
      lineLocal.p2.x -= line.p1.x;
      lineLocal.p2.y -= line.p1.y;

      let pointLocal = Object.assign({}, point);
      pointLocal.x -= line.p1.x;
      pointLocal.y -= line.p1.y;

      let lineLen = my2d.lineLength(lineLocal);

      let lineStartToPoint = { p1:{x:0,y:0}, p2:pointLocal };
      let lineStartToPointLen = my2d.lineLength(lineStartToPoint);

      let oneOverLineLen = 1 / lineLen;
      let oneOverLineToPointLen = 1 / lineStartToPointLen;

      let unitLine = my2d.scaleLine(oneOverLineLen, lineLocal);
      let unitLineToPoint = my2d.scaleLine(oneOverLineToPointLen, lineStartToPoint);

      let dotP = my2d.dotProduct(unitLine, unitLineToPoint);

      let projectedPoint = my2d.scaleLine(dotP * lineStartToPointLen, unitLine).p2;

      // line from point to projectedPoint
      let pointToProjectedPointDelta = my2d.delta( pointLocal, projectedPoint );
      pointToProjectedPointDelta.x *= 2;
      pointToProjectedPointDelta.y *= 2;

      // add original point to put projected point back into original space
      return { x:point.x + pointToProjectedPointDelta.x, y:point.y + pointToProjectedPointDelta.y};
   }

};
