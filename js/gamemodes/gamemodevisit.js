/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function GameModeVisit(name) {
    GameMode.call(this, name);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.gui = new dat.GUI({
//        height: 5 * 32 - 1
//        autoPlace: false
    });
    var params = {
        visit: 5000
    };
    this.gui.add(params, 'visit');

    var params2 = {
        visit2: 500,
    };
    this.gui.add(params2, 'visit2');

    this.gui.domElement.id = 'guiVisit';
    var customContainer = $('.moveGUI').append($(this.gui.domElement));
    //$(this.gui.domElement).attr("hidden", true);

    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, -5);
    this.scene.add(cube);
    walls.push(cube);

    //var geometry2 = new THREE.BoxGeometry(1, 1, 1);
    //material.color = 0xffffff;
    
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 5);
    this.scene.add(cube);
    walls.push(cube);

    cube = new THREE.Mesh(geometry, material);
    cube.position.set(5, 0, 0);
    this.scene.add(cube);
    walls.push(cube);
    
    //this.camera.position.z = 5;

    this.camera.rotation.set(0, 0, 0);

    this.pitchObject = new THREE.Object3D();
    this.pitchObject.add(this.camera);

    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 0;
    this.yawObject.add(this.pitchObject);
    this.scene.add(this.yawObject);

    this.PI_2 = Math.PI / 2;
    
    //this.pressedKeys2 = []; //new Array();
    //this.pressedKeys[69] = false;
    //this.pressedKeys[81] = false;
    
    this.moveForward = false;
    this.moveLeft = false;
    this.moveBackward = false;
    this.moveRight = false;
    
    this.raycaster = new THREE.Raycaster();
}

GameModeVisit.prototype = Object.create(GameMode.prototype);
GameModeVisit.prototype.constructor = GameModeVisit;

GameModeVisit.prototype.f1 = function () {
    console.log("GameModeVisit::f1 " + this.name);
};

GameModeVisit.prototype.getClearColor = function () {
    return 0xffffff;
};

GameModeVisit.prototype.activate = function () {
    console.log('activate visit');
    $(this.gui.domElement).attr("hidden", false);

    //document.addEventListener('keydown', this.onKeyDown, false);
    //document.addEventListener('keyup', this.onKeyUp, false);
    
    this.moveForward = false;
    this.moveLeft = false;
    this.moveBackward = false;
    this.moveRight = false;
};
GameModeVisit.prototype.deactivate = function () {
    //console.log('deactivate visit');
    $(this.gui.domElement).attr("hidden", true);

    //document.removeEventListener('keydown', this.onKeyDown, false);
    //document.removeEventListener('keyup', this.onKeyUp, false);
    
    this.moveForward = false;
    this.moveLeft = false;
    this.moveBackward = false;
    this.moveRight = false;
};

GameModeVisit.prototype.mouseMove = function (event){
    
    if (mousePressed) {
        var movementX = mouse.x - mouseLast.x; // mouseLast event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = mouse.y - mouseLast.y; //event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        this.yawObject.rotation.y -= movementX * 1;// * 0.002;
        this.pitchObject.rotation.x += movementY * 1;// * 0.002;

        this.pitchObject.rotation.x = Math.max(-this.PI_2, Math.min(this.PI_2, this.pitchObject.rotation.x));
    }
    //console.log(movementX + " " + movementY + " " + this.yawObject.rotation.y + " " + this.pitchObject.rotation.x);
};

GameModeVisit.prototype.render = function (renderer) {
    
    if( pressedKeys[81] === true ){ //q
        this.yawObject.rotation.y += deltaTime * 1;// * 0.002;
    }
    if( pressedKeys[69] === true ){ //e
        this.yawObject.rotation.y -= deltaTime * 1;// * 0.002;
    }
    
    var trans = new THREE.Vector3();
    
    if( this.moveForward ){ 
        trans.z -= 3.0 * deltaTime;        
    }else if( this.moveBackward ){
        trans.z += 3.0 * deltaTime;
    }
    
    if( this.moveLeft ){
         trans.x -= 3.0 * deltaTime;
    }else if( this.moveRight ){
        trans.x += 3.0 * deltaTime;
    }
    
//     if (moveForward)
//                        velocity.z -= 400.0 * delta;
//                    if (moveBackward)
//                        velocity.z += 400.0 * delta;
//
//                    if (moveLeft)
//                        velocity.x -= 400.0 * delta;
//                    if (moveRight)
//                        velocity.x += 400.0 * delta;

    //console.log(this.getDirection());
    
    var canMove = true;
    
    //var oldPos = this.yawObject.position.clone();
    
    //if( trans.lengthSq() !== 0 ) console.log(this.pitchObject.localToWorld(trans.clone()));
    
    //var cpOldPos = this.camera.localToWorld( new THREE.Vector3() );
    //var cpNewPos = this.camera.localToWorld( new THREE.Vector3() );
    
    
    var trLen = trans.length()
    if( trLen !== 0 ) {
        //console.log(trans);
        //console.log(moveDir);
        
        var moveDir = this.yawObject.localToWorld(trans.clone()).sub( this.yawObject.position.clone() ).normalize();
        
        this.raycaster.set(this.yawObject.position.clone(),moveDir);
        this.raycaster.far = 1;//trLen;
        
        var intersects = this.raycaster.intersectObjects(walls);
        if (intersects.length > 0) {
            canMove = false;
        } else {
        }
    }
    
    if( canMove ){
        this.yawObject.translateX(trans.x);
        this.yawObject.translateY(trans.y);
        this.yawObject.translateZ(trans.z);
    }
    
    
    
    //if( !canMove ){        
    //    this.yawObject.position.copy(oldPos);
    //}  
    
    renderer.setClearColor(this.getClearColor());
    renderer.render(this.scene, this.camera);

};

GameModeVisit.prototype.keyDown = function (event) {

    //console.log(event.keyCode);

    switch (event.keyCode) {

        case 81: //q
            //this.pressedKeys[event.keyCode] = true;
            //console.log( this );
            break;
            
        case 69: //e
            //this.pressedKeys[event.keyCode] = true;
            break;
            
        case 38: // up
        case 87: // w
            this.moveForward = true;
            break;

        case 37: // left
        case 65: // a
            this.moveLeft = true;
            break;

        case 40: // down
        case 83: // s
            this.moveBackward = true;
            break;

        case 39: // right
        case 68: // d
            this.moveRight = true;
            break;

        case 32: // space
//            if (canJump === true)
//                velocity.y += 350;
//            canJump = false;
            break;

    }

};

GameModeVisit.prototype.keyUp = function (event) {

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
            this.moveForward = false;
            break;

        case 37: // left
        case 65: // a
            this.moveLeft = false;
            break;

        case 40: // down
        case 83: // s
            this.moveBackward = false;
            break;

        case 39: // right
        case 68: // d
            this.moveRight = false;
            break;

    }

};

GameModeVisit.prototype.onWindowResize = function(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();        
};

GameModeVisit.prototype.getDirection = function () {

    // assumes the camera itself is not rotated

    var direction = new THREE.Vector3(0, 0, -1);
    var rotation = new THREE.Euler(0, 0, 0, "YXZ");

//    return function (v) {
//
//        rotation.set(pitchObject.rotation.x, yawObject.rotation.y, 0);
//
//        v.copy(direction).applyEuler(rotation);
//
//        return v;
//
//    };

    var v = new THREE.Vector3();
    rotation.set(this.pitchObject.rotation.x, this.yawObject.rotation.y, 0);
    v.copy(direction).applyEuler(rotation);
    return v;
};
        