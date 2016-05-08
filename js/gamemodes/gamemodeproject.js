/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function GameModeProject(name) {
    GameMode.call(this, name);

    this.scene = new THREE.Scene();
    //this.camera = new THREE.OrthographicCamera( 
    //        window.innerWidth / - 2, window.innerWidth / 2, 
    //        window.innerHeight / 2, window.innerHeight / - 2, - 500, 1000 );
    
    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;
    var aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    var frustumSize = 600;
    
//    this.camera = new THREE.OrthographicCamera( 
//            0.5 * frustumSize * aspect / - 2, 
//            0.5 * frustumSize * aspect / 2,
//            frustumSize / 2,
//            frustumSize / - 2, 
//            150, 1000 );
            
    this.camera = new THREE.OrthographicCamera( 
        window.innerWidth / -2, window.innerWidth / 2, 
        window.innerHeight / 2, window.innerHeight / -2, - 500, 1000 );
				
                                
    //this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    this.camera.position.set(0,100,100);
    
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));		
    this.camera.zoom = 2;
    //this.camera.position.x = 200;
    //this.camera.position.y = 100;
    //this.camera.position.z = 200;
    
    this.gui = new dat.GUI({
//        height: 5 * 32 - 1
//        autoPlace: false
    });
    var params = {
        project: 5000
    };
    this.gui.add(params, 'project');
    
    this.gui.domElement.id = 'guiProject';
    var customContainer = $('.moveGUI').append($(this.gui.domElement));
    

    // Grid
    var gridSize = 500, gridStep = 50;
    var gridGeometry = new THREE.Geometry();
    for (var i = -gridSize; i <= gridSize; i += gridStep) {
        gridGeometry.vertices.push(new THREE.Vector3(-gridSize, 0, i));
        gridGeometry.vertices.push(new THREE.Vector3(gridSize, 0, i));
        gridGeometry.vertices.push(new THREE.Vector3(i, 0, -gridSize));
        gridGeometry.vertices.push(new THREE.Vector3(i, 0, gridSize));
    }
    var gridMaterial = new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2});
    var gridLine = new THREE.LineSegments(gridGeometry, gridMaterial);
    this.scene.add(gridLine);

    var geometry = new THREE.BoxGeometry(50, 50, 50);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    this.scene.add(cube);
    
    //$(this.gui.domElement).attr("hidden", true);
}

GameModeProject.prototype = Object.create(GameMode.prototype);
GameModeProject.prototype.constructor = GameModeProject;

GameModeProject.prototype.f1 = function () {
    console.log("GameModeProject::f1 " + this.name);
};

GameModeProject.prototype.f2 = function () {
    console.log("GameModeProject::f2 " + this.name);
};

GameModeProject.prototype.getClearColor = function () {
    return 0xffffff;
};

GameModeProject.prototype.activate = function(){
    console.log('activate project');
    $(this.gui.domElement).attr("hidden", false);
};
GameModeProject.prototype.deactivate = function(){
    console.log('deactivate project');
    $(this.gui.domElement).attr("hidden", true);
};

GameModeProject.prototype.keyDown = function (event) {

    //console.log(event.keyCode);

    switch (event.keyCode) {

        case 81: //q
            //this.pressedKeys[event.keyCode] = true;
            
            this.camera.zoom = this.camera.zoom+1;
            console.log( this.camera.zoom );
            this.onWindowResize();
            
            break;
            
        case 69: //e
            //this.pressedKeys[event.keyCode] = true;
            
            this.camera.zoom = this.camera.zoom-1;
            console.log( this.camera.zoom );
            this.onWindowResize();
            
            break;
            
        case 38: // up
        case 87: // w
            //this.moveForward = true;
            break;

        case 37: // left
        case 65: // a
           // this.moveLeft = true;
            break;

        case 40: // down
        case 83: // s
            //this.moveBackward = true;
            break;

        case 39: // right
        case 68: // d
           // this.moveRight = true;
            break;

        case 32: // space
//            if (canJump === true)
//                velocity.y += 350;
//            canJump = false;
            break;

    }

};

GameModeProject.prototype.keyUp = function (event) {

    //console.log(event.keyCode);

    switch (event.keyCode) {

        case 81: //q
            //this.pressedKeys[event.keyCode] = false;
            break;
            
        case 69: //e
            //this.pressedKeys[event.keyCode] = false;
            break;
            
        case 38: // up
        case 87: // w
            //this.moveForward = false;
            break;

        case 37: // left
        case 65: // a
           // this.moveLeft = false;
            break;

        case 40: // down
        case 83: // s
            //this.moveBackward = false;
            break;

        case 39: // right
        case 68: // d
           // this.moveRight = false;
            break;

    }

};

GameModeProject.prototype.onWindowResize = function(){
    this.camera.left = window.innerWidth / -2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = window.innerHeight / -2;
    this.camera.updateProjectionMatrix();
                                
//    this.camera.left = -0.5 * frustumSize * aspect / 2;
//    this.camera.right = 0.5 * frustumSize * aspect / 2;
//    this.camera.top = frustumSize / 2;
//    this.camera.bottom = -frustumSize / 2;
//    this.camera.updateProjectionMatrix();
};
