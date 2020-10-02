/**
 * Syncnapsis Framework - Copyright (c) 2012-2014 ultimate
 * 
 * This program is free software; you can redistribute it and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation; either version
 * 3 of the License, or any later version.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MECHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Plublic License along with this program;
 * if not, see <http://www.gnu.org/licenses/>.
 */
//@requires("vertexshader")
//@requires("fragmentshader")

var ViewUtil = {};

ViewUtil.INSTANT = Number.MAX_VALUE;
ViewUtil.INFINITY = new THREE.Vector3(1000000,1000000,1000000);
ViewUtil.WHITE = new THREE.Color(1,1,1);
ViewUtil.BLACK = new THREE.Color(0,0,0);
ViewUtil.RED = new THREE.Color(1,0,0);
ViewUtil.GREEN = new THREE.Color(0,1,0);
ViewUtil.BLUE = new THREE.Color(0,0,1);
ViewUtil.SELECTION_COLOR = new THREE.Color(0,1,1);
ViewUtil.AMPLITUDE = 500.0;

ViewUtil.SYSTEM_SIZE_MIN = 10;
ViewUtil.SYSTEM_SIZE_MAX = 30;
ViewUtil.SELECTIONS_MAX = 2;
ViewUtil.ROTATION_TIMEOUT = 3000;
	
ViewUtil.loadShader = function(name) {
	var index = DependencyManager.indexOf(name);
	return DependencyManager.scriptContents[index];
};

ViewUtil.AnimatedVariable = function(initialValue, min, max, animationSpeed) {
	this.value = initialValue;
	this.target = initialValue;
	this.min = min;
	this.max = max;	
	this.speed = animationSpeed;	
	
	this.animate = function(time) {
		if(this.min != null && this.target < this.min)
			this.target = this.min;
		if(this.max != null && this.target > this.max)
			this.target = this.max;
			
		var step = this.speed * time / 1000;
			
		var dist = Math.abs(this.target - this.value);
		var sgn = Math.sign(this.target - this.value);
		
		var changed;
		if(time == ViewUtil.INSTANT || dist < step)
		{
			changed = (this.value != this.target);
			this.value = this.target;
		}
		else 
		{
			changed = true;
			this.value += sgn*step;		
		}
		
		return changed;
	};
};

ViewUtil.AnimatedVector3 = function(initialValue, animationSpeed) {
	this.value = initialValue.clone();
	this.target = initialValue.clone();
	this.speed = animationSpeed;
	
	this.animate = function(time) {
		var dx = this.target.x - this.value.x;
		var dy = this.target.y - this.value.y;
		var dz = this.target.z - this.value.z;
		var dist2 = dx*dx + dy*dy + dz*dz;
		
		var step = this.speed * time / 1000;
		
		var changed;
		if(time == ViewUtil.INSTANT || dist2 < (step*step))
		{
			changed = ((this.value.x != this.target.x) || (this.value.y != this.target.y) || (this.value.z != this.target.z));
			// copy each coordinate individually
			// otherwise we would have the same object and manipulating the target-object would not be possible
			this.value.x = this.target.x;
			this.value.y = this.target.y;
			this.value.z = this.target.z;
		}
		else
		{
			changed = true;
			var anim = 2; // DECIDE WHICH OPTION TO USE...
			if(anim == 1)
			{
				var max = Math.max(Math.abs(dx), Math.max(Math.abs(dy), Math.abs(dz)));
				this.value.x += dx/max * step;
				this.value.y += dy/max * step;
				this.value.z += dz/max * step;
			}
			else
			{
				var s = Math.abs(step) / Math.sqrt(dist2);
				this.value.x += s*dx;
				this.value.y += s*dy;
				this.value.z += s*dz;
			}
		}
		
		return changed;
	};
};

ViewUtil.AnimatedColor = function(initialValue, animationSpeed) {
	this.value = initialValue.clone();
	this.target = initialValue.clone();
	this.speed = animationSpeed;
	
	this.animate = function(time) {
		var dx = this.target.r - this.value.r;
		var dy = this.target.g - this.value.g;
		var dz = this.target.b - this.value.b;
		var dist2 = dx*dx + dy*dy + dz*dz;
		
		var step = this.speed * time / 1000;
		
		var changed;
		if(time == ViewUtil.INSTANT || dist2 < (step*step))
		{
			changed = ((this.value.r != this.target.r) || (this.value.g != this.target.g) || (this.value.b != this.target.b));
			// copy each coordinate individually
			// otherwise we would have the same object and manipulating the target-object would not be possible
			this.value.r = this.target.r;
			this.value.g = this.target.g;
			this.value.b = this.target.b;
		}
		else
		{
			changed = true;
			var anim = 2; // DECIDE WHICH OPTION TO USE...
			if(anim == 1)
			{
				var max = Math.max(Math.abs(dx), Math.max(Math.abs(dy), Math.abs(dz)));
				this.value.r += dx/max * step;
				this.value.g += dy/max * step;
				this.value.b += dz/max * step;
			}
			else
			{
				var s = Math.abs(step) / Math.sqrt(dist2);
				this.value.r += s*dx;
				this.value.g += s*dy;
				this.value.b += s*dz;
			}
		}
		
		return changed;
	};
};

ViewUtil.ColorModel = ColorModel;

ViewUtil.GalaxyInfo = function() {
	this.reset = function() {
		this.minX = 1000000000;
		this.minY = 1000000000;
		this.minZ = 1000000000;
		this.maxX = -1000000000;
		this.maxY = -1000000000;
		this.maxZ = -1000000000;
		this.maxR = 0;
		this.boundX = 0;
		this.boundY = 0;
		this.boundZ = 0;
	};
	
	this.update = function(system) {
		if(system.coords.value.x < this.minX)	this.minX = system.coords.value.x;
		if(system.coords.value.x > this.maxX)	this.maxX = system.coords.value.x;
		if(system.coords.value.y < this.minY)	this.minY = system.coords.value.y;
		if(system.coords.value.y > this.maxY)	this.maxY = system.coords.value.y;
		if(system.coords.value.z < this.minZ)	this.minZ = system.coords.value.z;
		if(system.coords.value.z > this.maxZ)	this.maxZ = system.coords.value.z;
		if(system.radius > this.maxR) 			this.maxR = system.radius;
		this.boundX = this.getBounds(this.minX, this.maxX);
		this.boundY = this.getBounds(this.minY, this.maxY);
		this.boundZ = this.getBounds(this.minZ, this.maxZ);
	};
	
	this.getBounds = function(min, max)
	{
		var absMax = Math.max(Math.abs(min), Math.abs(max));
		var leadingDigit = parseInt((absMax + "").substring(0,1));
		var digits = (absMax + "").length;
		var base10 = Math.pow(10, digits-1);
		return (leadingDigit+1)*base10;
	};
	
	this.reset();
};

ViewUtil.GalaxyShader = function(imgPath) {

	this.attributes = {
		size: {	type: 'f', value: [] },
		customColor: { type: 'c', value: [] }
	};
	
	this.uniforms = {
		amplitude: { type: "f", value: ViewUtil.AMPLITUDE },
		color:     { type: "c", value: ViewUtil.WHITE },
		texture:   { type: "t", value: THREE.ImageUtils.loadTexture( imgPath ) },
		//texture:   { type: "t", value: new THREE.TextureLoader().load( imgPath ) },
	};
	
	this.vertexShader = ViewUtil.loadShader( "vertexshader" );
	this.fragmentShader = ViewUtil.loadShader( "fragmentshader" );
		
	this.material = new THREE.ShaderMaterial( {
		uniforms: 		this.uniforms,
		attributes:     this.attributes,
		vertexShader:   this.vertexShader,
		fragmentShader: this.fragmentShader,
		blending: 		THREE.AdditiveBlending,
		depthTest: 		false,
		transparent:	true,
	});
};

ViewUtil.Galaxy = function(systems) {

	this.systems = systems; // TODO think about copying the array?!
	
	{ // particles for all systems
		this.systemShader = new ViewUtil.GalaxyShader("img/star.png");
		
		this.systemGeometry = new THREE.Geometry();
		this.systemGeometry.vertices = new Array(this.systems.length); // can't change the amount later!!!
		for(var v = 0; v < this.systemGeometry.vertices.length; v++)
		{
			this.systemGeometry.vertices[v] = ViewUtil.INFINITY.clone();
			this.systemShader.attributes.size.value[v] = 0;
			this.systemShader.attributes.customColor.value[v] = ViewUtil.BLACK.clone();
		}
		this.systemGeometry.dynamic = true;
		
		this.systemParticles = new THREE.ParticleSystem(this.systemGeometry, this.systemShader.material);
		this.systemParticles.name = "galaxy.systemParticles";
		this.systemParticles.dynamic = true;
	}
	
	{ // particles for selected system(s)
		this.selectionShader = new ViewUtil.GalaxyShader("img/circle.png");
		this.selectionShader.material.blending = THREE.NormalBlending; // marker must always be in front of view
		
		this.selectionGeometry = new THREE.Geometry({name: "galaxy.selectionGeometry"});
		this.selectionGeometry.vertices = new Array(ViewUtil.SELECTIONS_MAX); // can't change the amount later!!!
		for(var v = 0; v < this.selectionGeometry.vertices.length; v++)
		{
			this.selectionGeometry.vertices[v] = ViewUtil.INFINITY.clone();
			this.selectionShader.attributes.size.value[v] = 0;
			this.selectionShader.attributes.customColor.value[v] = ViewUtil.BLACK.clone();
		}
		this.selectionGeometry.dynamic = true;
		
		this.selectionParticles = new THREE.ParticleSystem(this.selectionGeometry, this.selectionShader.material);
		this.selectionParticles.name = "galaxy.selectionParticles";
		this.selectionParticles.dynamic = true;
	}

	this.info = new ViewUtil.GalaxyInfo();
			
	for(var s = 0; s < this.systems.length; s++)
	{
		this.systems[s].index = s;
		this.systems[s].galaxy = this;
		this.systems[s].updateColor();
		this.info.update(this.systems[s]);
	}
	
	this.selections = new Array(ViewUtil.SELECTIONS_MAX);
		
	this.select = function(system, selectionIndex) {
		if(selectionIndex == null)
			selectionIndex = 0;
			
		if(selectionIndex > this.selections.length)
			throw new Error("index exceeding max selections");
			
		this.selections[selectionIndex] = system;		
		return selectionIndex;
	};
	
	this.deselect = function(selectionIndex) {
		this.select(null, selectionIndex);
	};
	
	this.animate = function(time) {
		for(var s = 0; s < this.systems.length; s++)
		{
			if(this.systems[s])
				this.systems[s].animate(time);	
		}
		this.systemGeometry.verticesNeedUpdate = true;
		this.systemShader.attributes.size.needsUpdate = true;	
		this.systemShader.attributes.customColor.needsUpdate = true;
		
		for(var s = 0; s < this.selections.length; s++)
		{
			if(this.selections[s])
			{				
				this.selectionGeometry.vertices[s] = this.selections[s].coords.value.clone();
				this.selectionShader.attributes.size.value[s] = this.selections[s].size.value * 1.5;
				this.selectionShader.attributes.customColor.value[s] = ViewUtil.SELECTION_COLOR.clone(); // = this.selections[s].customColor.value;
			}
			else
			{
				this.selectionGeometry.vertices[s] = ViewUtil.INFINITY.clone();
				this.selectionShader.attributes.size.value[s] = 0;
				this.selectionShader.attributes.customColor.value[s] = ViewUtil.BLACK.clone();
			}
		}
		this.selectionGeometry.verticesNeedUpdate = true;
		this.selectionShader.attributes.size.needsUpdate = true;	
		this.selectionShader.attributes.customColor.needsUpdate = true;	
	};
};

ViewUtil.System = function(x, y, z, size, heat) {
	
	var animationSpeed = 100;
	this.coords = new ViewUtil.AnimatedVector3(new THREE.Vector3(x,y,z), animationSpeed);
	this.size = new ViewUtil.AnimatedVariable(size, 10, 30, animationSpeed); 
	this.heat = new ViewUtil.AnimatedVariable(heat, 0, 1, animationSpeed); 
	this.color = new ViewUtil.AnimatedColor(new THREE.Color(), animationSpeed);
	this.colorModel = ViewUtil.ColorModel.white;
	
	this.firstAnimation = true;
	
	this.updateColor = function() {
		var x = this.coords.target.x;
		var y = this.coords.target.y;
		var z = this.coords.target.z;
		this.radius = Math.sqrt(x*x + y*y + z*z);
		this.color.target = this.colorModel.getRGB(this.size.target, this.heat.target, this.radius / this.galaxy.info.maxR);
	};
	
	this.animate = function(time) {
		if(this.coords.animate(time) || this.firstAnimation)
		{
			this.galaxy.systemGeometry.vertices[this.index] = this.coords.value;
			this.galaxy.systemGeometry.verticesNeedUpdate = true;
		}
		if(this.size.animate(time) || this.firstAnimation)
		{
			this.galaxy.systemShader.attributes.size.value[this.index] = this.size.value;
			this.galaxy.systemShader.attributes.size.needsUpdate = true;	
		}
		if(this.color.animate(time) || this.firstAnimation)
		{
			this.galaxy.systemShader.attributes.customColor.value[this.index] = this.color.value;
			this.galaxy.systemShader.attributes.customColor.needsUpdate = true;	
		}
		
		this.heat.animate(time);
		
		this.firstAnimation = false;
	};
};

ViewUtil.EventManager = function(view)
{
	this.view = view;
	this.lastX = 0;
	this.lastY = 0;
	this.inDragMode = false;
	this.dragEventCount = 0;
	this.cameraRotationBeforeDrag = 0;
	this.cameraTimeout = null;
		
	this.handleDragStart = function(event) {
		this.lastX = event.pageX;
		this.lastY = event.pageY;
		this.inDragMode = true;
		this.dragEventCount = 0;
		this.cameraRotationBeforeDrag = this.view.camera.rotation;
		if(this.cameraTimeout != null)
		{
			clearTimeout(this.cameraTimeout);
			this.cameraTimeout = null;
		}
	};
		
	this.handleDragStop = function(event) {
		this.inDragMode = false;
		if(this.dragEventCount < 5)
			//this.handleClick(event);
			onClick(event);
		this.cameraTimeout = setTimeout(function(rotation) { return function() {
			this.view.camera.rotate(rotation);
		}; }(this.cameraRotationBeforeDrag), ViewUtil.ROTATION_TIMEOUT);
	};
		
	this.handleDrag = function(event) {
		if(this.inDragMode)
		{
			var x = event.pageX;
			var y = event.pageY;
			
			this.view.camera.sphere_phi.target = this.view.camera.sphere_phi.value - (x-this.lastX)/window.innerWidth * Math.PI * 1.5;
			this.view.camera.sphere_theta.target = this.view.camera.sphere_theta.value + (y-this.lastY)/window.innerHeight * Math.PI * 1.5;
			
			this.view.camera.sphere_phi.animate(ViewUtil.INSTANT);
			this.view.camera.sphere_theta.animate(ViewUtil.INSTANT);
			
			this.lastX = x;
			this.lastY = y;
			
			this.dragEventCount++;
		}
	};
	
	this.handleScroll = function(event) {				
		var event = window.event || event;
		event.preventDefault();
		
		var delta = Math.max(-1, Math.min(1, (event.wheelDelta || -event.detail)));

		this.view.camera.radius.target -= delta * 100;
		
		return false;			
	};
	
	this.handleClick = function(event) {
		// TODO
	};
	
	Events.addEventListener("mousedown", Events.wrapEventHandler(this, this.handleDragStart), this.view.canvas);
	Events.addEventListener("mousemove", Events.wrapEventHandler(this, this.handleDrag), this.view.canvas);
	Events.addEventListener("mouseup", Events.wrapEventHandler(this, this.handleDragStop), this.view.canvas);
	Events.addEventListener("DOMMouseScroll", Events.wrapEventHandler(this, this.handleScroll), this.view.canvas);
};

// for debugging without Request.js - START
ViewUtil.loadShader = function(name) {
	if(name == "vertexshader")
	{	
		return "uniform float amplitude;\
attribute float size;\
attribute vec3 customColor;\
varying vec3 vColor;\
void main() {\
	vColor = customColor;\
	vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\
	gl_PointSize = size * ( amplitude / length( mvPosition.xyz ) );\
	gl_Position = projectionMatrix * mvPosition;\
}";
	}
	else if(name == "fragmentshader")
	{
		return "uniform vec3 color;\
uniform sampler2D texture;\
varying vec3 vColor;\
void main() {\
	gl_FragColor = vec4( color * vColor, 1.0 );\
	gl_FragColor = gl_FragColor * texture2D( texture, gl_PointCoord );\
}";
	}
};
// for debugging without Request.js - END