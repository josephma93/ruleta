
function Roulette (canvasDOM, cx, cy, radius, elements, colors ) {
	var canvas = canvasDOM,
		ctx = null,
		sAngle = 0,
		sectionAngle = 360 / elements.length,
		spinTimeout = null, // stores the identifier of the function setTimeout
		spinAngleStart = 10,
		spinTime = 0,
		spinTimeTotal = 0;

	// checking if browser supports canvas
	if (typeof canvas.getContext === "function") {
		ctx = canvas.getContext("2d");
	} else {
		ctx = null;
		throw new CanvasUnsupportedException();
	};

	var constants = {
		outsideRadius : radius,
		prizes : elements,
		fillStyles : colors,
		rad : Math.PI / 180,
		center : {
			x : cx,
			y : cy
		},
		dimensions : {
			h : canvasDOM.height,
			w : canvasDOM.width
		},
		random : [744, 3478], // [minimum number of rotations in degrees, max number of rotations]
		seconds : 8000,  // how long animation runs

	};

	this.init = function() {
		drawSections();		
	};
	// draws every sector of the roulette
	var drawSections = function() {
		ctx.clearRect(0, 0, constants.dimensions.width, constants.dimensions.height);
		ctx.strokeStyle = "black";
		ctx.lineWidth = 1;

		for (var i = 0, ii = constants.prizes.length; i < ii; i++) {
			var eAngle = sAngle + sectionAngle;

			ctx.fillStyle = constants.fillStyles[i];
			ctx.beginPath();
			// syntax: context.arc(cx, cy,  radiusOftheCircle, startingAngleInRadians, endingAngleInRadians, counterclockwise);
			ctx.arc(constants.center.x, constants.center.y, 
				constants.outsideRadius, converter.degreesTOradians(sAngle),
				converter.degreesTOradians(eAngle));
			ctx.lineTo(constants.center.x, constants.center.y);
			ctx.closePath();
			ctx.stroke(); // draws the path
			ctx.fill(); // Fills the current drawing

			addProviderLogo(i, sAngle, eAngle);

			sAngle = eAngle;
		}
	};

	var addProviderLogo = function(j, sAngle, eAngle) {
		var points = getPoints(sAngle, eAngle),
			img = constants.prizes[j],
			width = img.width,
			height = img.height,
			//Convert degrees to radian
			radians = converter.degreesTOradians(sAngle += sectionAngle/2);

			//save the context
			ctx.save();
			
			//Set the origin to the center of the image
			ctx.translate(points.x1, points.y1);

			//Rotate the canvas around the origin
			ctx.rotate(radians);

			//draw the image
			ctx.drawImage(img, width / 2 * (-1), height / 2 * (-1), width/2, height/2);

			//reset the canvas
			ctx.rotate(radians * ( -1 ) );
			ctx.translate(points.x1 * (-1), points.y1 * (-1));

			//restore the context to its original state
			ctx.restore();
	};
	this.spin = function() {
		spinAngleStart = Math.random() * 10 + 10;
		spinTime = 0;
		spinTimeTotal = Math.random() * 3 + 4 * 1000;
		this.rotateWheel();
	}

	this.rotateWheel = function() {
		spinTime += 30;
		if (spinTime >= spinTimeTotal) {
			stopRotateWheel();
			return;
		}
		var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
		sAngle += spinAngle;
		drawSections();
		spinTimeout = setTimeout('roulette.rotateWheel()', 30);
	}

	var stopRotateWheel = function() {
		spinTimeout = clearTimeout(spinTimeout);
		var index = Math.floor((360 - (sAngle+90) % 360) / sectionAngle);
		var text = constants.prizes[index].src.split("/");
		alert('Usted gano:\n'+text[text.length-1].replace(".png",""));
	}

	var easeOut = function(t, b, c, d) {
		var ts = (t /= d) * t;
		var tc = ts * t;
		return b + c * (tc + -3 * ts + 3 * t);
	}
	// calculates the points at which the arc begins and ends
	var getPoints = function (sAngle, eAngle) {
		sAngle += sectionAngle/1.9;
		var points = {
        	// (cx+(px−cx)cosθ+(cy−py)sinθ,cy+(py−cy)cosθ+(px−cx)sinθ)
			x1 : cx + constants.outsideRadius/1.1 * Math.cos(sAngle * constants.rad),
			x2 : cx + constants.outsideRadius * Math.cos(eAngle * constants.rad),
			y1 : cy + constants.outsideRadius/1.1 * Math.sin(sAngle * constants.rad),
			y2 : cy + constants.outsideRadius * Math.sin(eAngle * constants.rad),
      };
        return points;
    };
    // converter from degrees to radians and vice versa	
    var converter = {
    	degreesTOradians : function(degrees) {
    		return degrees*Math.PI/180;
    	},
    	radiansTOdegrees : function(radians) {
    		return (radians*180)/Math.PI;
    	},
    };

	// Object exception is thrown if canvas is not supported
	function CanvasUnsupportedException () {
		this.message = "You are using an browser without support to use HTML5 Canvas";
		this.toString = function() {
			return this.message
		};
		alert("Usted está utilizando un navegador sin soporte para uso de HTML5 Canvas");
	}
}
$(function() {
	var colors = ["#B8D430", "#3AB745", "#029990", "#3501CB",
	"#2E2C75", "#673A7E", "#CC0071", "#F80120",
	"#F35B20", "#FB9A00", "#FFCC00", "#FEF200"];
	window.roulette = new Roulette(document.getElementById('wheelcanvas'),
		271.5, 329, 230, document.getElementsByClassName('provider'), colors);
	roulette.init();
});