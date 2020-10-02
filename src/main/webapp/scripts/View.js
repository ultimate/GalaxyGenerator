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
//@requires("ViewUtil")

var View = function(container) {
	
	this.container = container;
	this.canvas = document.createElement("canvas");
	this.container.appendChild(this.canvas);
	
	this.materials = {
		planeT: new THREE.MeshBasicMaterial( { opacity:0.2 , wireframe: false, transparent:	true, side: THREE.DoubleSide } ),
		planeW: new THREE.MeshBasicMaterial( { opacity:0.6 , wireframe: true } ),	
		invisible: new THREE.MeshBasicMaterial( { visible: false} ),
	};	

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
	this.planes = {};
	
	this.updateSize = function() {
		this.renderer.setSize( this.container.offsetWidth, this.container.offsetHeight, true );
		this.camera.camera.aspect = this.container.offsetWidth / this.container.offsetHeight;
		this.camera.camera.updateProjectionMatrix();
		console.log("updating view size: " + this.container.offsetWidth + "x" + this.container.offsetHeight + " (aspect: " + this.camera.camera.aspect + ")");
	};
	
	this.getScreenCoords = function(vector) {
		var vec = vector.clone();
		vec.applyProjection(this.camera.projection);
		vec.x = (vec.x + 1) * this.container.offsetWidth / 2 + this.container.offsetLeft;
		vec.y = (-vec.y + 1) * this.container.offsetHeight / 2 + this.container.offsetTop;
		return vec;
	};
	
	this.getScreenSize = function(vector, size) { //system) {
		var p1 = vector; //system.coords.value;
		//var size = system.size.value;
		var p2 = this.camera.camera.position;
		var dist = Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y) + (p1.z-p2.z)*(p1.z-p2.z));
		return size / (2 * Math.tan((camera.camera.fov * Math.PI / 180) / 2) * dist) * this.container.offsetWidth / 2;
	};
	
	// TODO for debug only
	
	var g = new THREE.CubeGeometry(100,100,100);
	var m = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( g, m );
	cube.name = "cube";
	this.scene.add(cube);
	
	// TODO end
	
	this.load = function(sectors, stepSize) {
		console.log("loading " + sectors.length + " sectors...");
		if(stepSize == undefined)
			stepSize = 1;	
			
		if(this.galaxy != null)
		{
			console.log("removing previous galaxy...");
			// TODO animate?!
			
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
			if(this.galaxy.selectionParticles != null)
				this.scene.remove(this.galaxy.selectionParticles);
				
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
		var count = 9;
		var geometry;
		var material;
		var mesh;			
		// XY
		console.log("XY: " + this.galaxy.info.boundX*2 + " x " + this.galaxy.info.boundY*2);
		if(this.planes.xy == null)
		{			
			geometry = new THREE.PlaneGeometry(this.galaxy.info.boundX*2, this.galaxy.info.boundY*2);					
			material = this.materials.planeT.clone();
			material.color = new THREE.Color(0x00ff99);		
			this.planes.xy = new THREE.Mesh(geometry, material);
			this.planes.xy.name = "planes.xy";			
			//this.planes.xy.position.z = this.galaxy.info.boundZ/count * 2 * (i+0.5) - this.galaxy.info.boundZ;
			this.planes.xy.rotation.z = Math.PI / 2;			
			this.scene.add(this.planes.xy);
		}
		// XZ
		console.log("XZ: " + this.galaxy.info.boundX*2 + " x " + this.galaxy.info.boundZ*2);				
		if(this.planes.xz == null)
		{
			geometry = new THREE.PlaneGeometry(this.galaxy.info.boundX*2, this.galaxy.info.boundZ*2);				
			material = this.materials.planeT.clone();
			material.color = new THREE.Color(0x9900ff);
			this.planes.xz = new THREE.Mesh(geometry, material);
			this.planes.xz.name = "planes.xz";
			//this.planes.xz.position.y = this.galaxy.info.boundY/count * 2 * (i+0.5) - this.galaxy.info.boundY;
			this.planes.xz.rotation.x = Math.PI / 2;
			this.scene.add(this.planes.xz);
		}
		// YZ		
		console.log("YZ: " + this.galaxy.info.boundY*2 + " x " + this.galaxy.info.boundZ*2);		
		if(this.planes.yz == null)
		{
			geometry = new THREE.PlaneGeometry(this.galaxy.info.boundZ*2, this.galaxy.info.boundY*2);				
			material = this.materials.planeT.clone();
			material.color = new THREE.Color(0xff9900);
			this.planes.yz = new THREE.Mesh(geometry, material);
			this.planes.yz.name = "planes.yz";
			//this.planes.yz.position.x = this.galaxy.info.boundX/count * 2 * (i+0.5) - this.galaxy.info.boundX;
			this.planes.yz.rotation.y = Math.PI / 2;
			this.scene.add(this.planes.yz);
		}		
		
		// add the new particle system
		console.log("adding galaxy...");
		this.scene.add(this.galaxy.systemParticles);
		this.scene.add(this.galaxy.selectionParticles);			
		
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
	
	this.selections = new Array(ViewUtil.SELECTIONS_MAX);
		
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