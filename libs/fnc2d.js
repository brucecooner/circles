;'use strict';

var fnc2d = {

   // --------------------------------------------------------------------------
   square:function(val) {
      return val * val;
   },

   // --------------------------------------------------------------------------
   Point:function() {
      this.set(...arguments)
   },

   // --------------------------------------------------------------------------
   Line:function() {
      if (1 === arguments.length) {
         if (arguments[0] instanceof fnc2d.Line) {
            this.p1 = new fnc2d.Point(arguments[0].p1);
            this.p2 = new fnc2d.Point(arguments[0].p2);
         }
         else {
            console.log(`ERROR : Line() : one argument, unhandled type`);
            this.p1 = new fnc2d.Point(0,0);
            this.p2 = new fnc2d.Point(0,0);
         }
      }
      else { // >1 arguments, try this...
         this.p1 = new fnc2d.Point(arguments[0]);
         this.p2 = new fnc2d.Point(arguments[1]);
      }
   }
}

// -----------------------------------------------------------------------------
// receives:
// no args -> {x:0, y:0}
// number -> {x:number, y:number}
// Object -> {x:Object.x || 0, y:Object.y || 0}
// Array -> [x,y]
// >2 args -> msg, {x:0, y:0}
fnc2d.Point.prototype.set = function()
{
   if (null == arguments[0])
   {
      console.log('fnc2d:point constructor received null')
   }

   if (1 === arguments.length) {
      if (arguments[0] instanceof fnc2d.Point)
      {
         Object.assign(this, arguments[0])
      }
      else if (typeof arguments[0] === 'number') {
         this.x = arguments[0];
         this.y = arguments[0];
      }
      else if (Array.isArray(arguments[0])) {
         this.x = arguments[0][0];
         this.y = arguments[0][1];
      }
      else {
         if (typeof arguments[0] === 'undefined')
         {
            console.log(`args 0 undefined`);
         }
         else
         {
            if (arguments[0].hasOwnProperty('x'))
            {
               this.x = arguments[0]['x']
            }
            else
            {
               console.log(`fnc2d.Point : unable to determine x value from ${arguments[0]} to set, defaulting to 0`);
            }

            if (arguments[0].hasOwnProperty('y'))
            {
               this.y = arguments[0]['y']
            }
            else
            {
               console.log(`fnc2d.Point : unable to determine y value from ${arguments[0]} to set, defaulting to 0`);
            }
         }
      }
   }
   else if (2 === arguments.length) {
      this.x = arguments[0];
      this.y = arguments[1];
   }
   else if (0 === arguments.length) {
      this.x = 0;
      this.y = 0;
   }
   else {
      console.log(`ERROR Point() : unable to construct with ${arguments.length} parameters`)
      this.x = 0;
      this.y = 0;
   }

   return this;
}

// -----------------------------------------------------------------------
fnc2d.Point.prototype.str = function() {
   return `(${this.x},${this.y})`;
}

// -----------------------------------------------------------------------
fnc2d.Point.prototype.scale = function(scaleFactor) {
   return new fnc2d.Point(this.x * scaleFactor, this.y * scaleFactor);
}
// these ...Eq seem a bit redundant but (I think) saves a constructor call
fnc2d.Point.prototype.scaleEq = function(scaleFactor) {
   this.x *= scaleFactor;
   this.y *= scaleFactor;
   return this;
}

// -----------------------------------------------------------------------
fnc2d.Point.prototype.translate = function() {
   let translation = new fnc2d.Point(...arguments);

   return new fnc2d.Point(this.x + translation.x, this.y + translation.y);
}

fnc2d.Point.prototype.translateEq = function() {
   let translation = new fnc2d.Point(...arguments);

   this.x += translation.x;
   this.y += translation.y;

   return this;
}

// -----------------------------------------------------------------------------
// receives: pointSpec: Point specifier (see constructor)
// shorthand for Point.translate(point2.scale(-1))
fnc2d.Point.prototype.minus = function() {
   let point2 = new fnc2d.Point(...arguments);

   return new fnc2d.Point(this.x - point2.x, this.y - point2.y);
}

fnc2d.Point.prototype.minusEq = function() {
   let minusPt = new fnc2d.Point(...arguments);

   this.x -= minusPt;
   this.y -= minusPt;

   return this;
}

// -----------------------------------------------------------------------------
// receives : line:Line
fnc2d.Point.prototype.reflect = function(line)
{
   // assuming line and point are in same coordinate space, of course, let's move
   // both to the origin so maths is easier
   let lineLocal = line.translate(line.p1.scale(-1));

   let pointLocal = this.minus(line.p1);

   let lineLen = lineLocal.length();

   let lineOriginToPoint = new fnc2d.Line( {x:0,y:0}, pointLocal );

   /*
   // different way...works really but needs logic to determine proper rotation direction
   // and you have to be comfortable rotating a lot of points, meh for now
   let angleTo = lineOriginToPoint.angleTo(lineLocal);
   lineOriginToPoint.p2.rotateEq(-angleTo * 2);
   return lineOriginToPoint.p2.translate(line.p1);
   */

   let lineOriginToPointLen = lineOriginToPoint.length();

   let unitLineLocal = lineLocal.normalized();
   let unitLineOriginToPoint = lineOriginToPoint.normalized();

   let dotP = unitLineLocal.dot(unitLineOriginToPoint);

   let projectedPoint = unitLineLocal.scale(dotP * lineOriginToPointLen).p2;

   // line from point to projectedPoint
   let pointToProjectedPointDelta = pointLocal.delta(projectedPoint);

   pointToProjectedPointDelta.scaleEq(2);

   // add original point to put projected point back into original space
   return new fnc2d.Point(this.x + pointToProjectedPointDelta.p2.x, this.y + pointToProjectedPointDelta.p2.y);
}

fnc2d.Point.prototype.reflectEq = function(line) {
   return this.set(this.reflect(line));
}

// -----------------------------------------------------------------------------
// receives: pointSpec: Point specifier (see constructor)
// returns Line (pointSpec - this)
fnc2d.Point.prototype.delta = function() {
   let point2 = new fnc2d.Point(...arguments).minus(this);

   return new fnc2d.Line([0,0], point2);
}

// -----------------------------------------------------------------------
// receives : radians:number
// note : right handed (I think)
fnc2d.Point.prototype.rotate = function(radians) {
   let cos = Math.cos(radians);
   let sin = Math.sin(radians);

   return new fnc2d.Point(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
}

fnc2d.Point.prototype.rotateEq = function(radians) {
   return this.set(this.rotate(radians));
}

// -----------------------------------------------------------------------------
fnc2d.Point.prototype.floor = function()
{
   return new fnc2d.Point(Math.floor(this.x), Math.floor(this.y))
}

fnc2d.Point.prototype.floorEq = function()
{
   this.x = Math.floor(this.x)
   this.y = Math.floor(this.y)

   return this
}

// -----------------------------------------------------------------------
fnc2d.Line.prototype.str = function() {
   return `{p1:${this.p1.str()} p2:${this.p2.str()}}`;
}

// -----------------------------------------------------------------------
fnc2d.Line.prototype.length = function() {
   let xDiff = this.p2.x - this.p1.x;
   let yDiff = this.p2.y - this.p1.y;

   return Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
}

// -----------------------------------------------------------------------
fnc2d.Line.prototype.lengthSquared = function() {
   let xDiff = this.p2.x - this.p1.x;
   let yDiff = this.p2.y - this.p1.y;

   return (xDiff * xDiff) + (yDiff * yDiff);
}

// -----------------------------------------------------------------------------
// receives: line1:Line, line2:Line
fnc2d.Line.prototype.dot = function(line2)
{
   return ((this.p2.x - this.p1.x) * (line2.p2.x - line2.p1.x))
            + ((this.p2.y - this.p1.y) * (line2.p2.y - line2.p1.y));
}

// -----------------------------------------------------------------------------
// receives : pointSpec: point Point constructor
fnc2d.Line.prototype.perpDistance = function(pointSpec)
{
   let point = new fnc2d.Point(pointSpec);

   let numerator = Math.abs((this.p2.y - this.p1.y) * point.x - (this.p2.x - this.p1.x) * point.y + this.p2.x * this.p1.y - this.p2.y * this.p1.x);

   let denominator = Math.sqrt(Math.pow(this.p2.y - this.p1.y, 2) + Math.pow(this.p2.x - this.p1.x, 2));

   return numerator / denominator;
}

// -----------------------------------------------------------------------------
// receives : pointSpec: point Point constructor
fnc2d.Line.prototype.translate = function()
{
   let transPt = new fnc2d.Point(...arguments);

   return new fnc2d.Line(this.p1.translate(transPt), this.p2.translate(transPt));
}

fnc2d.Line.prototype.translateEq = function()
{
   let transPt = new fnc2d.Point(...arguments);

   this.p1 = this.p1.translate(transPt);
   this.p2 = this.p2.translate(transPt);

   return this;
}

// -----------------------------------------------------------------------------
fnc2d.Line.prototype.scale = function(scaleFactor) {
   return new fnc2d.Line( this.p1.scale(scaleFactor), this.p2.scale(scaleFactor));
}

fnc2d.Line.prototype.scaleEq = function(scaleFactor) {
   this.p1 = this.p1.scale(scaleFactor);
   this.p2 = this.p2.scale(scaleFactor);

   return this;
}

// -----------------------------------------------------------------------------
fnc2d.Line.prototype.normalized = function() {
   thisLen = this.length();

   let returnLine = new fnc2d.Line(this);

   if (thisLen > 0) {
      let factor = 1 / this.length()

      returnLine.scaleEq(factor);
   }

   return returnLine;
}

fnc2d.Line.prototype.normalizedEq = function()
{
   return Object.assign(this, this.normalized(this));
}

// =============================================================================
// note: result is between 0 and PI
fnc2d.Line.prototype.angleTo = function(line)
{
   let thisNormalized = this.normalized()
   let otherNormalized = line.normalized()

   let dot = otherNormalized.dot(thisNormalized)

   return Math.acos(dot)
}

// =============================================================================
/*
let testfnc2d = false;

if (testfnc2d) {
   console.log('<<<<< fnc2d >>>>>>')

   // points
   console.log(`point construction...`);
   let point1 = new fnc2d.Point();
   console.log(`no params: ${point1.str()}`);
   point1 = new fnc2d.Point(11);
   console.log(`1 number: ${point1.str()}`);
   point1 = new fnc2d.Point(19,73);
   console.log(`2 numbers: ${point1.str()}`);
   point1 = new fnc2d.Point({x:1});
   console.log(`obj (x only): ${point1.str()}`);
   point1 = new fnc2d.Point({y:1});
   console.log(`obj (y only): ${point1.str()}`);
   point1 = new fnc2d.Point({foo:0, bar:11});
   console.log(`obj (no x, no y):${point1.str()}`);
   point1 = new fnc2d.Point([1,2]);
   console.log(`array:${point1.str()}`);
   point1 = new fnc2d.Point(1,2,3);
   console.log(`3 args:${point1.str()}`);
   orgPoint = new fnc2d.Point(1,1);
   point1 = new fnc2d.Point(orgPoint);
   console.log(`from Point(1,1):${point1.str()}`);

   // scale
   point1.set([1,1]);
   console.log(`scale [1,1] by 0.5:${point1.scale(0.5).str()}`)

   // point translation
   let trans = point1.set(0).translate({x:10});
   console.log(`trans [0,0] by {x}:${trans.str()}`);
   trans = point1.set(0).translate({y:10});
   console.log(`trans [0,0] by {y}:${trans.str()}`);
   trans = point1.set(0).translate({x:10,y:10});
   console.log(`trans [0,0] by {x,y}:${trans.str()}`);
   trans = point1.set(0).translate( new fnc2d.Point(12,12));
   console.log(`trans [0,0] by Point(12,12):${trans.str()}`);

   // rotation
   let rotPt = point1.set(0,1).rotate(Math.PI);
   console.log(`rotate [0,1] by PI)):${rotPt.str()}`);

   // minus
   point1 = new fnc2d.Point([2,3]);
   point2 = new fnc2d.Point(1,1);
   console.log(`${point1.str()} minus ${point2.str()}:${point1.minus(point2).str()}`)

   // --- lines ---
   console.log(`line construction...`);
   let line1 = new fnc2d.Line({x:0,y:0}, {x:1,y:0});
   console.log(`from {0,0},{1,0}:${line1.str()}`);

   line1 = new fnc2d.Line({x:0,y:0}, [1,2]);
   console.log(`from {0,0},[1,2]:${line1.str()}`);

   line1 = new fnc2d.Line([0,0], [1,2]);
   console.log(`from [0,0],[1,2]:${line1.str()}`);

   line1 = new fnc2d.Line({x:0,y:0}, new fnc2d.Point(1,2));
   console.log(`from {0,0}, Point(1,2):${line1.str()}`);

   line1 = new fnc2d.Line([0,0], [1,1]);
   let line2 = new fnc2d.Line(line1);
   console.log(`from ${line1.str()}: ${line2.str()}`)

   //from delta
   point1 = new fnc2d.Point(1,1);
   line1 = new point1.delta(2,2);
   console.log(`from Point(${point1.str()}).delta(2,2):${line1.str()}`)

   // length
   line1 = new fnc2d.Line( [0,0], [1,0]);
   console.log(`length of ${line1.str()}:${line1.length()}`);

   // dot
   line1 = new fnc2d.Line( [0,0], [1,0]);
   line2 = new fnc2d.Line({x:0,y:0}, {x:0,y:1});
   console.log(`${line1.str()} dot ${line2.str()}:${line1.dot(line2)}`)

   // perp distance
   line1 = new fnc2d.Line( [0,0], [0,1]);
   let point = new fnc2d.Point([1,0]);
   console.log(`perp distance ${line1.str()} to ${point.str()}:${line1.perpDistance(point)}`);
   line1 = new fnc2d.Line( [0,0], [1,1]);
   point = new fnc2d.Point([1,0]);
   console.log(`perp distance ${line1.str()} to ${point.str()}:${line1.perpDistance(point)}`);

   // trans
   line1 = new fnc2d.Line([0,0],[1,1]);
   let transPt = new fnc2d.Point(1,2);
   console.log(`translate ${line1.str()} by ${transPt.str()}:${line1.translate(transPt).str()}`);

   // trans equals
   line1 = new fnc2d.Line([0,0],[1,1]);
   transPt = new fnc2d.Point(1,2);
   console.log(`translateEq ${line1.str()} by ${transPt.str()}:${line1.translateEq(transPt).str()}`);

   // normalization
   line1 = new fnc2d.Line([0,0], [100,100]);
   console.log(`normalize of ${line1.str()} : ${line1.normalized().str()}`)
   // ...with assign
   line1 = new fnc2d.Line([0,0], [100,100]).normalizedEq();
   console.log(`normalize (and assign) ${line1.str()}`)

   // reflection
   line1 = new fnc2d.Line([1,1], [2,2]);
   let reflectPt = new fnc2d.Point(1,0);
   let reflectedPt = reflectPt.reflect(line1);
   console.log(`reflected ${reflectPt.str()} around ${line1.str()}:${reflectedPt.str()}`)

   console.log('<<<<< fnc2d >>>>>>')
}
*/
