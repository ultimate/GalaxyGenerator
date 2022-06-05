ColorModel = {
	first: true,
	// display helper
	createRadioButton: function(colormodel, parentElement) {
		var div = document.createElement("div");
		div.className = "colormodel";
		var radio = document.createElement("input");
		radio.type = "radio";
		radio.value = cm;
		radio.name = "colormodel";
		radio.onchange = updateColors;
		if(this.first)
		{
			radio.checked = "checked";
			this.first = false;
		}
		div.appendChild(radio);
		var bar = document.createElement("div");
		bar.className = "colorbar";
		div.appendChild(bar);
		var desc = document.createElement("span");
		desc.className = "colorbar_description";
		desc.innerHTML = "(" + colormodel.type + ": " + colormodel.name + ")";
		div.appendChild(desc);
		parentElement.appendChild(div);
		var steps = 100;
		console.log("adding colormodel: " + colormodel.name);
		for(i = 0; i <= steps; i++)
		{
			if(debugRGB)
			{
				for(h = 0; h < 3; h++)
				{
					var div2 = document.createElement("div");
					div2.style.position = "absolute";
					div2.style.top = h*30  + "%";
					div2.style.left = i + "%";					
					div2.style.width = "1%";
					div2.style.height = "30%";
					var c = colormodel.getRGB(i/steps, i/steps, i/steps);
					var cs;
					if(h == 0)
						cs = "rgb(" + Math.round(c.r*255) + ",0,0)";
					if(h == 1)
						cs = "rgb(0," + Math.round(c.g*255) + ",0)";
					if(h == 2)
						cs = "rgb(0,0," + Math.round(c.b*255) + ")";
					div2.style.background = cs;
					bar.appendChild(div2);						
				}
			}
			else
			{
				div2 = document.createElement("div");
				div2.style.position = "absolute";
				div2.style.left = i + "%";					
				div2.style.width = "1%";
				div2.style.height = "100%";
				var c = colormodel.getRGB(i/steps, i/steps, i/steps);
				var cs= "rgb(" + Math.round(c.r*255) + "," + Math.round(c.g*255) + "," + Math.round(c.b*255) + ")";
				div2.style.background = cs;
				bar.appendChild(div2);						
			}
		}
	},
	
	// available models
	white: {
		name: "white",
		type: "fixed",
		getRGB: function(size, heat, radius) {
			return new THREE.Color(1,1,1);
		}
	},	
	yellowwhite1: {
		name: "yellowwhite1",
		type: "heat",
		getRGB: function(size, heat, radius) {
			return new THREE.Color(1,1,Math.sqrt(heat));
		}
	},	
	yellowwhite2: {
		name: "yellowwhite2",
		type: "heat",
		getRGB: function(size, heat, radius) {
			return new THREE.Color(1,1,heat);
		}
	},	
	yellowwhite3: {
		name: "yellowwhite3",
		type: "heat",
		getRGB: function(size, heat, radius) {
			return new THREE.Color(1,1,Math.pow(heat,2));
		}
	},	
	yellow: {
		name: "yellow",
		type: "fixed",
		getRGB: function(size, heat, radius) {
			return new THREE.Color(1,1,0);
		}
	},	
	fullrange1 : {
		name: "fullrange1",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			
			var bound1 = 0.1;
			var bound2 = 0.5;
			var bound3 = 0.9;
			var redStart = 0.6;
			var blueEnd = 0.8;			
				
			if(param < bound1)
				return new THREE.Color(param/bound1*(1-redStart)+redStart, 0, 0);
			else if(param < bound2)
				return new THREE.Color(1, (param-bound1)/(bound2-bound1), 0);
			else if(param < bound3)
				return new THREE.Color(1, 1, (param-bound2)/(bound3-bound2));
			else
				return new THREE.Color((1-(param-bound3)/(1-bound3))*(1-blueEnd)+blueEnd, 1, 1);
		}
	},
	fullrange2 : {
		name: "fullrange2",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			
			var bound1 = 0.1;
			var bound2 = 0.5;
			var bound3 = 0.9;
			var redStart = 0.6;
			var blueEnd = 0.8;			
				
			if(param < bound1)
				return new THREE.Color(param/bound1*(1-redStart)+redStart, 0, 0);
			else if(param < bound2)
				return new THREE.Color(1, (param-bound1)/(bound2-bound1), 0);
			else if(param < bound3)
				return new THREE.Color(1, 1, Math.pow((param-bound2)/(bound3-bound2), 2));
			else
				return new THREE.Color((1-(param-bound3)/(1-bound3))*(1-blueEnd)+blueEnd, 1, 1);
		}
	},
	partrange1a: {
		name: "partrange1a",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			
			var bound = 0.5;
			
			if(param < bound)
				return new THREE.Color(1, param/bound, 0);
			else
				return new THREE.Color(1, 1, (param-bound)/(1-bound));
		}
	},	
	partrange1b: {
		name: "partrange1b",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			
			var bound = 0.5;
			
			if(param < bound)
				return new THREE.Color(1, Math.sqrt(param/bound), 0);
			else
				return new THREE.Color(1, 1, Math.pow((param-bound)/(1-bound),2));
		}
	},	
	partrange1c: {
		name: "partrange1c",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			
			var bound = 0.3;
			
			if(param < bound)
				return new THREE.Color(1, param/bound, 0);
			else
				return new THREE.Color(1, 1, (param-bound)/(1-bound));
		}
	},	
	partrange1d: {
		name: "partrange1d",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			
			var bound = 0.3;
			
			if(param < bound)
				return new THREE.Color(1, Math.sqrt(param/bound), 0);
			else
				return new THREE.Color(1, 1, Math.pow((param-bound)/(1-bound),2));
		}
	},	
	partrange2a: {
		name: "partrange2a",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			
			var bound = 0.3;
			var greenStart = 0.6;	
			
			if(param < bound)
				return new THREE.Color(1, param/bound*(1-greenStart)+greenStart, 0);
			else
				return new THREE.Color(1, 1, (param-bound)/(1-bound));
		}
	},	
	partrange2b: {
		name: "partrange2b",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			
			var bound = 0.3;
			var greenStart = 0.6;	
			
			if(param < bound)
				return new THREE.Color(1, param/bound*(1-greenStart)+greenStart, 0);
			else
				return new THREE.Color(1, 1, Math.sqrt((param-bound)/(1-bound)));
		}
	},	
	orangewhite1: {
		name: "orangewhite1",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			var greenStart = 0.6;	
			return new THREE.Color(1, param*(1-greenStart)+greenStart, param);
		}
	},	
	orangewhite2: {
		name: "orangewhite2",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			var greenStart = 0.6;	
			return new THREE.Color(1, Math.sqrt(param*(1-greenStart)+greenStart), Math.sqrt(param));
		}
	},	
	fullrange3a : {
		name: "fullrange3a",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			
			var bound1 = 0.3;	
			var bound2 = 0.7;		
				
			if(param < bound1)
				return new THREE.Color(1, param/bound1, 0);
			else if(param < bound2)
				return new THREE.Color(1, 1, (param-bound1)/(bound2-bound1));
			else
				return new THREE.Color((1-(param-bound2)/(1-bound2)), (1-(param-bound2)/(1-bound2)), 1);
		}
	},
	fullrange3b : {
		name: "fullrange3b",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			
			var bound1 = 0.3;	
			var bound2 = 0.7;		
				
			if(param < bound1)
				return new THREE.Color(1, param/bound1, 0);
			else if(param < bound2)
				return new THREE.Color(1, 1, (param-bound1)/(bound2-bound1));
			else
				return new THREE.Color(Math.sqrt(1-(param-bound2)/(1-bound2)), Math.sqrt(1-(param-bound2)/(1-bound2)), 1);
		}
	},
	fullrange4a : {
		name: "fullrange4a",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			
			var bound1 = 0.3;	
			var bound2 = 0.7;
			var notBlueMin = 0.5;			
				
			if(param < bound1)
				return new THREE.Color(1, param/bound1, 0);
			else if(param < bound2)
				return new THREE.Color(1, 1, (param-bound1)/(bound2-bound1));
			else
				return new THREE.Color((1-(param-bound2)/(1-bound2))*(1-notBlueMin)+notBlueMin, (1-(param-bound2)/(1-bound2))*(1-notBlueMin)+notBlueMin, 1);
		}
	},
	fullrange4b : {
		name: "fullrange4a",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			
			var bound1 = 0.3;	
			var bound2 = 0.7;
			var notBlueMin = 0.5;			
				
			if(param < bound1)
				return new THREE.Color(1, param/bound1, 0);
			else if(param < bound2)
				return new THREE.Color(1, 1, (param-bound1)/(bound2-bound1));
			else
				return new THREE.Color(Math.sqrt(1-(param-bound2)/(1-bound2))*(1-notBlueMin)+notBlueMin, Math.sqrt(1-(param-bound2)/(1-bound2))*(1-notBlueMin)+notBlueMin, 1);
		}
	},
	fullrange5a : {
		name: "fullrange5a",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			
			var bound1 = 0.3;	
			var bound2 = 0.7;
			var redMin = 0.5;	
			var greenMin = 0.75;	
						
			if(param < bound1)
				return new THREE.Color(1, param/bound1, 0);
			else if(param < bound2)
				return new THREE.Color(1, 1, (param-bound1)/(bound2-bound1));
			else
				return new THREE.Color((1-(param-bound2)/(1-bound2))*(1-redMin)+redMin, (1-(param-bound2)/(1-bound2))*(1-greenMin)+greenMin, 1);
		}
	},
	fullrange5b : {
		name: "fullrange5b",
		type: "heat",
		getRGB: function(size, heat, radius) {
			var param = heat;
			
			var bound1 = 0.3;	
			var bound2 = 0.7;
			var redMin = 0.5;	
			var greenMin = 0.75;	
						
			if(param < bound1)
				return new THREE.Color(1, param/bound1, 0);
			else if(param < bound2)
				return new THREE.Color(1, 1, (param-bound1)/(bound2-bound1));
			else
				return new THREE.Color(Math.sqrt(1-(param-bound2)/(1-bound2))*(1-redMin)+redMin, Math.sqrt(1-(param-bound2)/(1-bound2))*(1-greenMin)+greenMin, 1);
		}
	},
	fullcolorrange : {
		name: "fullcolorrange",
		type: "radius",
		getRGB: function(size, heat, radius) {
			var param = radius;
			
			var bound1 = 1/6;	
			var bound2 = 2/6;	
			var bound3 = 3/6;	
			var bound4 = 4/6;		
			var bound5 = 5/6;
						
			if(param < bound1)
				return new THREE.Color(1-param/bound1, 0, 1);
			else if(param < bound2)
				return new THREE.Color(0, (param-bound1)/(bound2-bound1), 1);
			else if(param < bound3)
				return new THREE.Color(0, 1, 1-(param-bound2)/(bound3-bound2));
			else if(param < bound4)
				return new THREE.Color((param-bound3)/(bound4-bound3), 1, 0);
			else if(param < bound5)
				return new THREE.Color(1, 1-(param-bound4)/(bound5-bound4), 0);
			else
				return new THREE.Color(1, 0, (param-bound5)/(1-bound5));
		}
	},
	bluewhite1 : {
		name: "bluewhite1",
		type: "radius",
		getRGB: function(size, heat, radius) {
			var param = 1-radius;
			return new THREE.Color(param, param, 1);
		}
	},	
	bluewhite2 : {
		name: "bluewhite2",
		type: "radius",
		getRGB: function(size, heat, radius) {
			var param = 1-radius;
			return new THREE.Color(Math.pow(param,2), Math.sqrt(param), 1);
		}
	},	
	bluewhite3 : {
		name: "bluewhite3",
		type: "radius",
		getRGB: function(size, heat, radius) {
			var param = 1-radius;
			return new THREE.Color(Math.sqrt(param), Math.pow(param,2), 1);
		}
	},	
	spectrum1 : {
		name: "spectrum1",
		type: "radius",
		getRGB: function(size, heat, radius) {
			var param = 1-radius;
			
			var bound = 0.6;
			var red1 = 0.3;
			var green1 = 0.7;
			var green2 = 0.4;
			var blueMin = 0.6;		
						
			if(param < bound)
				return new THREE.Color((param/bound)*(1-red1)+red1, green1-Math.pow(param/bound,2)*(green1-green2), (1-Math.pow(param/bound,2))*(1-blueMin)+blueMin);
			else
				return new THREE.Color(1, Math.pow((param-bound)/(1-bound),0.7)*(1-green2)+green2, Math.pow((param-bound)/(1-bound),0.7)*(1-blueMin)+blueMin);
		}
	},	
	spectrum2 : {
		name: "spectrum2",
		type: "radius",
		getRGB: function(size, heat, radius) {
			var param = 1-radius;
			
			var bound = 0.6;
			var red1 = 0.3;
			var green1 = 0.7;
			var green2 = 0.2;
			var blueMin = 0.3;		
						
			if(param < bound)
				return new THREE.Color((param/bound)*(1-red1)+red1, green1-Math.pow(param/bound,2)*(green1-green2), (1-Math.pow(param/bound,2))*(1-blueMin)+blueMin);
			else
				return new THREE.Color(1, Math.pow((param-bound)/(1-bound),0.7)*(1-green2)+green2, Math.pow((param-bound)/(1-bound),0.7)*(1-blueMin)+blueMin);
		}
	},
	spectrum3 : {
		name: "spectrum3",
		type: "radius",
		getRGB: function(size, heat, radius) {
			var param = 1-radius;
			
			var bound = 0.6;
			var red1 = 0.3;
			var green1 = 0.7;
			var green2 = 0.2;
			var blueMin = 0.3;			
						
			if(param < bound)
				return new THREE.Color((param/bound)*(1-red1)+red1, green1-Math.pow(param/bound,2)*(green1-green2), (1-Math.pow(param/bound,2))*(1-blueMin)+blueMin);
			else
				return new THREE.Color(1, Math.pow((param-bound)/(1-bound),0.7)*(1-green2)+green2, Math.pow((param-bound)/(1-bound),1.2)*(1-blueMin)+blueMin);
		}
	},
}; 