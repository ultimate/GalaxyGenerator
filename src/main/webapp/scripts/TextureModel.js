TextureModel = {
	first: true,
	size: 50,
	// display helper
	createRadioButton: function(tm, parentElement, callback) {
		var texturemodel = this[tm];
		var div = document.createElement("div");
		div.className = "model texture";
		div.style.height = (this.size+2) + "px";
   		div.style.position = "relative";
   		div.style.top = (-this.size/2) + "px";
		var radio = document.createElement("input");
		radio.type = "radio";
		radio.value = tm;
		radio.name = "texturemodel";
		radio.onchange = callback;
		if(this.first)
		{
			radio.checked = "checked";
			this.first = false;
		}
		div.appendChild(radio);
		texturemodel.canvas = document.createElement("canvas");
		texturemodel.canvas.setAttribute("width", this.size);
		texturemodel.canvas.setAttribute("height", this.size);
		texturemodel.canvas.style.top = (this.size/2-6) + "px";
		texturemodel.canvas.id = "texture_" + tm;
		div.appendChild(texturemodel.canvas);
		var desc = document.createElement("span");
		desc.className = "description";
		desc.innerHTML = "(" + texturemodel.name + ")";
		div.appendChild(desc);
		parentElement.appendChild(div);
		console.log("adding texturemodel: " + texturemodel.name);
		var ctx = texturemodel.canvas.getContext("2d");
		ctx.clearRect(0, 0, this.size, this.size);
		ctx.translate(this.size/2, this.size/2);
		texturemodel.draw(ctx, this.size);
	},
	
	// available models
	softdot: {
		name: "soft dot",
		draw: function(ctx, size) {
			var grd = ctx.createRadialGradient(0, 0, size/10, 0, 0, size/2);
			grd.addColorStop(0, "rgba(255,255,255,1)");
			grd.addColorStop(1, "rgba(255,255,255,0)");
			ctx.fillStyle = grd;
			ctx.fillRect(-size/2, -size/2, size, size);
		}
	},	
	sparkle: {
		name: "sparkle",
		draw: function(ctx, size) {
			ctx.fillStyle = "white";
			var sparkles = [1.0, 0.7, 1.0, 0.7, 1.0, 0.7, 1.0, 0.7];
			for(let s in sparkles)
			{
				ctx.beginPath();
				ctx.moveTo(0, size/2*sparkles[s]);
				ctx.lineTo(-size/20, 0);
				ctx.lineTo(+size/20, 0);
				ctx.fill();
				ctx.rotate(2*Math.PI/sparkles.length); 
			}
		}
	},	
	sun: {
		name: "sun",
		draw: function(ctx, size) {
			ctx.fillStyle = "white";
			ctx.beginPath();
			var r = size/4;
			ctx.moveTo(r, 0);
			ctx.arc(0, 0, r, 0, 2*Math.PI);
			ctx.fill();
			ctx.strokeStyle = "white";
			ctx.lineWidth = size/20;
			var rays = 20;
			for(let ri = 0; ri < rays; ri++)
			{
				ctx.beginPath();
				ctx.moveTo(0, r*1.2);
				ctx.lineTo(0, size/2*0.8);
				ctx.stroke();
				ctx.rotate(2*Math.PI/rays); 
			}
		}
	},	
}; 