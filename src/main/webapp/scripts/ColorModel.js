ColorModel = {
	first: true,
	width: 100,
	height: 20,
	// display helper
	createRadioButton: function(cm, parentElement) {
		var colormodel = this[cm];
		var div = document.createElement("div");
		div.className = "model color";
		div.style.height = (this.height+2) + "px";
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
		colormodel.canvas = document.createElement("canvas");
		colormodel.canvas.setAttribute("width", this.width);
		colormodel.canvas.setAttribute("height", this.height);
		colormodel.canvas.style.top = (this.height/2-6) + "px";
		div.appendChild(colormodel.canvas);
		var desc = document.createElement("span");
		desc.className = "description";
		desc.innerHTML = "(" + colormodel.name + ")";
		div.appendChild(desc);
		parentElement.appendChild(div);
		console.log("adding colormodel: " + colormodel.name);
		var ctx = colormodel.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.width, this.height);
		for(let i = 0; i <= this.width; i++)
		{
			let arg = i/this.width;
			let color = colormodel.getRGB(arg, arg, arg);
			//console.log("draw: " + arg + " " + color.getHexString());
			ctx.fillStyle = "#" + color.getHexString();
			ctx.fillRect(i,0,1,this.height);
		}
	},
	
	// available models
	white: {
		name: "fixed: white",
		getRGB: function(size, heat, radius) {
			return new THREE.Color(1,1,1);
		}
	},	
	yellowwhite: {
		name: "heat: yellow-white",
		getRGB: function(size, heat, radius) {
			return new THREE.Color(1,1,Math.sqrt(heat));
		}
	},	
	fullrange : {
		name: "heat: fullrange",
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
	rainbow : {
		name: "radius: rainbow",
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
	spectrumlight : {
		name: "radius: spectrum (light)",
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
	spectrumintense : {
		name: "radius: spectrum (intense)",
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