/**
 * Copyright (c) ultimate
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
//@requires("ViewUtil")

var View = function(container) {
	
	this.container = container;
	this.canvas = document.createElement("canvas");
	this.container.appendChild(this.canvas);
	
	this.camera = {
		target: new ViewUtil.AnimatedVector3(new THREE.Vector3(0,0,0), 500),
		radius: new ViewUtil.AnimatedVariable(2000, 100, 2500, 2500),
		sphere_phi: new ViewUtil.AnimatedVariable(0, null, null, 0.25),
		sphere_theta: new ViewUtil.AnimatedVariable(0.4, - Math.PI / 2 + 0.01, Math.PI / 2 - 0.01, 0.25),
		sphere_axis: new ViewUtil.AnimatedVariable(0, 0, 0, 0),
		flip: 0,
		up: new THREE.Vector3(0, 0, 1),
		camera: new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 ),
		projection: new THREE.Matrix4(), // set in update function
		rotation: 0,
		
		animate: function(time) {
			this.target.animate(time);
			this.radius.animate(time);
			this.sphere_phi.animate(time);
			this.sphere_theta.animate(time);
			this.sphere_axis.animate(time);		
						
			//console.log("camera:    angles=" + this.sphere_phi.value + "|" + this.sphere_theta.value + "|" + this.sphere_axis.value + "    target=" + this.target.value.x + "|" + this.target.value.y + "|" + this.target.value.z);
		},
		
		update: function() {
				var x = this.radius.value * Math.sin(Math.PI/2 - this.sphere_theta.value) * Math.cos(this.sphere_phi.value);
				var y = this.radius.value * Math.sin(Math.PI/2 - this.sphere_theta.value) * Math.sin(this.sphere_phi.value);
				var z = this.radius.value * Math.cos(Math.PI/2 - this.sphere_theta.value); 
										
				//console.log("camera:    pos=" + this.camera.position.x + "|" + this.camera.position.y + "|" + this.camera.position.z + "    rot=" + this.camera.rotation.x + "|" + this.camera.rotation.y + "|" + this.camera.rotation.z);
				this.camera.position.x = x + this.target.value.x;
				this.camera.position.y = y + this.target.value.y;
				this.camera.position.z = z + this.target.value.z;
				//console.log("camera:    pos=" + this.camera.position.x + "|" + this.camera.position.y + "|" + this.camera.position.z + "    rot=" + this.camera.rotation.x + "|" + this.camera.rotation.y + "|" + this.camera.rotation.z);
				//console.log("look at: " + this.target.value.x + "|" + this.target.value.y + "|" + this.target.value.z + ", up: " + this.up);
				this.camera.up = this.up;
				//console.log("camera:    pos=" + this.camera.position.x + "|" + this.camera.position.y + "|" + this.camera.position.z + "    rot=" + this.camera.rotation.x + "|" + this.camera.rotation.y + "|" + this.camera.rotation.z);
				this.camera.lookAt(this.target.value);
				//console.log("camera:    pos=" + this.camera.position.x + "|" + this.camera.position.y + "|" + this.camera.position.z + "    rot=" + this.camera.rotation.x + "|" + this.camera.rotation.y + "|" + this.camera.rotation.z);
				//console.log("camera:    pos=" + this.camera.position.x + "|" + this.camera.position.y + "|" + this.camera.position.z + "    rot=" + this.camera.rotation.x + "|" + this.camera.rotation.y + "|" + this.camera.rotation.z);
				this.camera.rotation.z += this.sphere_axis.value; // otherwise we will always look upright
				
				this.projection.multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse);
		},
		
		rotate: function(direction) {
			console.log("rotation = " + direction);
			this.rotation = direction;
			if(direction != 0)
				this.sphere_phi.target = direction * Number.MAX_VALUE;
			else
				this.sphere_phi.target = this.sphere_phi.value;
		},
	};
	
	this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true, clearColor: 0x000000, clearAlpha: 1 }); 
	this.scene = new THREE.Scene(); 
	
	this.cube = new THREE.Mesh( new THREE.BoxGeometry(100,100,100), new THREE.MeshBasicMaterial( { color: 0x00ff00 } ) ); // for DEBUG
	this.cube.name = "cube";
	this.scene.add(this.cube);
	
	this.planes = {};
	
	this.updateSize = function() {
		this.renderer.setSize( this.container.offsetWidth, this.container.offsetHeight, true );
		this.camera.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
		this.camera.camera.updateProjectionMatrix();
		console.log("updating view size: " + this.container.offsetWidth + "x" + this.container.offsetHeight + " (aspect: " + this.camera.camera.aspect + ")");
	};
	
	this.updateOptions = function(args) {
		if(args.rotate != null && this.camera != null)
			this.camera.rotate(args.rotate);
		if(args.planesXY != null && this.planes.xy != null)
			this.planes.xy.material.visible = args.planesXY;
		if(args.planesXZ != null && this.planes.xz != null)
			this.planes.xz.material.visible = args.planesXZ;
		if(args.planesYZ != null && this.planes.yz != null)
			this.planes.yz.material.visible = args.planesYZ;
		if(args.cube != null && this.cube != null)
			this.cube.material.visible = args.cube;
		if(args.colormodel != null && this.galaxy != null)
		{
			console.log("update colormodel: " + args.colormodel.name);
			for(i = 0; i < this.galaxy.systems.length; i++)
			{
				this.galaxy.systems[i].colorModel = args.colormodel;
				this.galaxy.systems[i].updateColor();
			}
			this.galaxy.systemGeometry.getAttribute(ViewUtil.ATTRIBUTE_COLOR).needsUpdate = true;
		}
		if(args.texturemodel != null && this.galaxy != null)
		{
			console.log("update texturemodel: " + args.texturemodel.name);
			this.galaxy.systemMaterial.uniforms[ViewUtil.UNIFORM_TEXTURE] = new THREE.Uniform(new THREE.CanvasTexture(args.texturemodel.canvas));
			this.galaxy.systemMaterial.uniformsNeedUpdate = true;
		}
		if(args.texturesize != null && this.galaxy != null)
		{
			console.log("update texturesize: " + args.texturesize);
			this.galaxy.systemMaterial.uniforms[ViewUtil.UNIFORM_SIZE] = new THREE.Uniform(args.texturesize);
			this.galaxy.systemMaterial.uniformsNeedUpdate = true;
		}
	};
	
	this.getScreenCoords = function(vector) {
		var vec = vector.clone();
		vec.applyMatrix4(this.camera.projection);
		vec.x = (vec.x + 1) * this.container.offsetWidth / 2 + this.container.offsetLeft;
		vec.y = (-vec.y + 1) * this.container.offsetHeight / 2 + this.container.offsetTop;
		return vec;
	};
	
	this.raycaster = new THREE.Raycaster();	
	
	this.findObjectsAt = function(screenX, screenY) {
		var mouse = new THREE.Vector2();

//		mouse.x = ( screenX / window.innerWidth ) * 2 - 1;
//		mouse.y = - ( screenY / window.innerHeight ) * 2 + 1;	
		
		mouse.x = ( screenX / this.renderer.domElement.clientWidth ) * 2 - 1;
		mouse.y = - ( screenY / this.renderer.domElement.clientHeight ) * 2 + 1;
		
		this.raycaster.setFromCamera(mouse, this.camera.camera);

		return this.raycaster.intersectObjects(this.scene.children);
	};
	
	this.findSectorAt = function(screenX, screenY) {		
		var mouse = new THREE.Vector2();
		var sec;
		var secScreen;

		console.time("ray");
		{		
			// NOTE: this variant is faster but not as accurate
			mouse.x = ( screenX / this.renderer.domElement.clientWidth ) * 2 - 1;
			mouse.y = - ( screenY / this.renderer.domElement.clientHeight ) * 2 + 1;
			
			this.raycaster.setFromCamera(mouse, this.camera.camera);
			
			var o = this.raycaster.ray.origin;
			var d = this.raycaster.ray.direction;
			//console.log("origin: (" + o.x + "," + o.y + "," + o.z + ") direction: (" + d.x + "," + d.y + "," + d.z + ")");
			var p;
			var n = new THREE.Vector3(0,0,0);; // normal vector to line = (o-p)-((o-p)*d)d // * = dot-product
			var dist2; // = (|n|)^2 // use square to avoid sqrt
			var opd; // temp for (o-p)*d
			var opdMin = 10000000;
			var dist2Min = 10000000;
					
			for(var i = 0; i < this.galaxy.systems.length; i++)
			{
				p = this.galaxy.systems[i].coords.value;
				size = this.galaxy.systems[i].size.value;
				if(size == 0)
					continue;
				
				opd = (p.x-o.x)*d.x + (p.y-o.y)*d.y + (p.z-o.z)*d.z;
				// opd is in direction to n (intersection have positive opd)
				if(opd < 0) // wrong direction (behind the camera)
					continue;
				n.x = (o.x - p.x)+opd*d.x;
				n.y = (o.y - p.y)+opd*d.y;
				n.z = (o.z - p.z)+opd*d.z;
				dist2 = (n.x*n.x + n.y*n.y + n.z*n.z);
				//if(dist2 < 10000)
				//	console.log("opd=" + opd + " dist=" + dist2 + " x|y|z= " + p.x + "|" + p.y + "|" + p.z);
				if(dist2 < dist2Min)
						dist2Min = dist2;
				if(opd < opdMin && dist2 <= size*size)
				{
					opdMin = opd;
					sec = this.galaxy.systems[i];
					secScreen = this.getScreenCoords(sec.coords.value);
				}									
			}
		}
		console.timeEnd("ray");console.log("sec=" + (sec == null ? null : (sec.coords.value.x + "|" + sec.coords.value.y + "|" + sec.coords.value.z)) + " @ screen coords=" + (secScreen == null ? null : (secScreen.x + "|" + secScreen.y + "|" + secScreen.z)));
		
		console.time("scr");
		{	
			// NOTE: this variant is slower but more accurate
			mouse.x = screenX;
			mouse.y = screenY;
			
			var p;
			var dist2;
			var screenCoords;
			var screenSize;
			var zMin = 10000000;
			var distMin = 10000000;
			
			for(var i = 0; i < this.galaxy.systems.length; i++)
			{
				p = this.galaxy.systems[i];
				if(p.size.value == 0)
					continue;
					
				screenCoords = this.getScreenCoords(p.coords.value);
				screenSize = this.getScreenSize(p.coords.value, p.size.value);
				
				dist2 = (screenCoords.x-mouse.x)*(screenCoords.x-mouse.x) + (screenCoords.y-mouse.y)*(screenCoords.y-mouse.y);
				//console.log("dist=" + dist2 + " x|y|z= " + p.x + "|" + p.y + "|" + p.z);
				if((dist2 < distMin || (dist2 == distMin && screenCoords.z < zMin)) && dist2 < screenSize*screenSize/4)
				{
					zMin = screenCoords.z;
					distMin = dist2;
					sec = p;
					secScreen = screenCoords;
				}
			}
		}
		console.timeEnd("scr");
		console.log("sec=" + (sec == null ? null : (sec.coords.value.x + "|" + sec.coords.value.y + "|" + sec.coords.value.z)) + " @ screen coords=" + (secScreen == null ? null : (secScreen.x + "|" + secScreen.y + "|" + secScreen.z)));
		
		return sec;
	};
	
	this.click = function(x, y) {
		console.log("click @ " + x + "|" + y);
		this.deselect(0);					
		var activeSector = this.findSectorAt(x, y);					
		if(activeSector == null)
			this.camera.target.target = new THREE.Vector3(0,0,0);
		else
			this.camera.target.target = activeSector.coords.value;
		this.select(activeSector, 0);
	};
	
	this.getScreenSize = function(vector, size) { //system) {
		var p1 = vector; //system.coords.value;
		//var size = system.size.value;
		var p2 = this.camera.camera.position;
		var dist = Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y) + (p1.z-p2.z)*(p1.z-p2.z));
		return size / (2 * Math.tan((this.camera.camera.fov * Math.PI / 180) / 2) * dist) * this.container.offsetWidth / 2;
	};
	
	this.load = function(sectors, stepSize) {
		console.log("loading " + sectors.length + " sectors...");
		if(stepSize == undefined)
			stepSize = 1;	
			
		if(this.galaxy != null)
		{
			console.log("removing previous galaxy...");
			// TODO animate?!
			
			/*
			var galaxy;
			
			updateStars = function(firstCall)
			{
				console.log("update stars");
				var factor = 0.6;				
				var diffTreshold;
				if(galaxy.animation == -1)
					diffTreshold = 10;
				else
					diffTreshold = 1;
				
				var inMotion = 0;
				var diff;
				var target;
				for(i = 0; i < galaxy.particles.vertices.length; i++)
				{
					if(galaxy.animation == -1)
						target = new THREE.Vector3(0,0,0);
					else
						target = galaxy.particles.vertices[i].target;
						
					// x
					diff = Math.abs(target.x - galaxy.particles.vertices[i].x);
					if(diff < diffTreshold && diff > 0)
					{
						//galaxy.particles.vertices[i].x = target.x;
					}
					else if(diff > 0)
					{
						galaxy.particles.vertices[i].x = target.x - (target.x - galaxy.particles.vertices[i].x)*factor;
						inMotion++;
					}
					// y
					diff = Math.abs(target.y - galaxy.particles.vertices[i].y);
					if(diff < diffTreshold && diff > 0)
					{
						//galaxy.particles.vertices[i].y = target.y;
					}
					else if(diff > 0)
					{
						galaxy.particles.vertices[i].y = target.y - (target.y - galaxy.particles.vertices[i].y)*factor;
						inMotion++;
					}
					// z
					diff = Math.abs(target.z - galaxy.particles.vertices[i].z);
					if(diff < diffTreshold && diff > 0)
					{
						//galaxy.particles.vertices[i].z = target.z;
					}
					else if(diff > 0)
					{
						galaxy.particles.vertices[i].z = target.z - (target.z - galaxy.particles.vertices[i].z)*factor;
						inMotion++;
					}
				}
				
				if((inMotion == 0 && galaxy.animation == -1) || (galaxy.animation == 1 && firstCall == true))			
				{				
					console.log("animation -1 done!");
					galaxy.animation = 1;		
					inMotion = 1;
					
					var colormodel = colormodels[checkedRadioButton("colormodel")];
					for(i = 0; i < galaxy.particles.vertices.length; i++)
					{
						target = galaxy.particles.vertices[i].target;
						if(target.x == 0 && target.y == 0 && target.z == 0)
						{
							galaxy.sizes[i] = 0;
							
							galaxy.colors[i].radius = 0;
							galaxy.colors[i].radius2 = 0;
						}
						else
						{
							galaxy.colors[i].radius = galaxy.colors[i].radius_tmp;
							galaxy.colors[i].radius2 = galaxy.colors[i].radius2_tmp;
							galaxy.colors[i].calculateRGB(colormodel);
						}
					}					
					view.shaders.attributes.size.needsUpdate = true;	
					view.shaders.attributes.customColor.needsUpdate = true;	
				}
				
				//console.log("stars updated: " + inMotion);
				if(inMotion > 0)
				{
					galaxy.particleSystem.geometry.verticesNeedUpdate = true;
					setTimeout(updateStars, 100);
				}
			}
			*/
			
			// remove old planes
			if(this.planes.xy != null)
				this.scene.remove(this.planes.xy.mesh);
			if(this.planes.xz != null)
				this.scene.remove(this.planes.xz.mesh);
			if(this.planes.yz != null)
				this.scene.remove(this.planes.yz.mesh);
			
			// remove the old particle system(s)
			if(this.galaxy.systemParticles != null)
				this.scene.remove(this.galaxy.systemParticles);
			if(this.galaxy.selectionMarker != null)
				this.scene.remove(this.galaxy.selectionMarker);
				
			delete this.galaxy;
		}
		
		console.log("parsing sectors...");
		
		var systems = new Array();
		var x, y, z, size, heat;
				
		for(var s = 0; s < sectors.length; s += stepSize)
		{			
			x = sectors[s][0];
			y = sectors[s][1];
			z = sectors[s][2];
			size = Math.random()*(ViewUtil.SYSTEM_SIZE_MAX-ViewUtil.SYSTEM_SIZE_MIN)+ViewUtil.SYSTEM_SIZE_MIN; // TODO
			heat = Math.random(); // TODO
			systems[systems.length] = new ViewUtil.System(x, y, z, size, heat);
		};
		
		// create a new galaxy object
		console.log("creating galaxy...");
		this.galaxy = new ViewUtil.Galaxy(systems);
		
		// add planes for orientation
		console.log("creating planes...");
		var divisions = 8;
		var geometry;
		var material;
		var mesh;			
		// XY
		console.log("XY: " + this.galaxy.info.boundX*2 + " x " + this.galaxy.info.boundY*2);
		if(this.planes.xy == null)
		{			
			this.planes.xy = new ViewUtil.Plane(this.galaxy.info.boundX, this.galaxy.info.boundY, new THREE.Color(0x00ff99));
			this.planes.xy.name = "planes.xy";			
			this.planes.xy.rotation.z = Math.PI / 2;			
			this.scene.add(this.planes.xy);
		}
		// XZ
		console.log("XZ: " + this.galaxy.info.boundX*2 + " x " + this.galaxy.info.boundZ*2);				
		if(this.planes.xz == null)
		{
			this.planes.xz = new ViewUtil.Plane(this.galaxy.info.boundX, this.galaxy.info.boundZ, new THREE.Color(0x9900ff));
			this.planes.xz.name = "planes.xz";
			this.planes.xz.rotation.x = Math.PI / 2;
			this.scene.add(this.planes.xz);
		}
		// YZ		
		console.log("YZ: " + this.galaxy.info.boundY*2 + " x " + this.galaxy.info.boundZ*2);		
		if(this.planes.yz == null)
		{			
			this.planes.yz = new ViewUtil.Plane(this.galaxy.info.boundZ, this.galaxy.info.boundY, new THREE.Color(0xff9900));
			this.planes.yz.name = "planes.yz";
			this.planes.yz.rotation.y = Math.PI / 2;
			this.scene.add(this.planes.yz);
		}		
		
		// add the new particle system
		console.log("adding galaxy...");
		this.scene.add(this.galaxy.systemParticles);
		for(var i = 0; i < this.galaxy.selectionMarkers.length; i++)
		{
			this.scene.add(this.galaxy.selectionMarkers[i]);
		}			
	};
	
	this.lastAnimation = new Date().getTime();
	
	this.render = function() {
		var now = new Date().getTime();
		var time = now - this.lastAnimation;
		this.lastAnimation = now;
		
		if(this.galaxy != null)
			this.galaxy.animate(time);
		this.camera.animate(time);
		
		this.camera.update();
		this.renderer.render( this.scene, this.camera.camera );
	};
			
	this.select = function(system, selectionIndex) {
		return this.galaxy.select(system, selectionIndex);
	};
	
	this.deselect = function(selectionIndex) {
		this.galaxy.deselect(selectionIndex);
	};	
	
	this.eventManager = new ViewUtil.EventManager(this);
	
	console.log("the camera:    pos=" + this.camera.camera.position.x + "|" + this.camera.camera.position.y + "|" + this.camera.camera.position.z + "    rot=" + this.camera.camera.rotation.x + "|" + this.camera.camera.rotation.y + "|" + this.camera.camera.rotation.z);
	this.camera.update();
			
	Events.addEventListener(Events.ONRESIZE, Events.wrapEventHandler(this, this.updateSize), window);	
	Events.fireEvent(window, Events.ONRESIZE);	
}