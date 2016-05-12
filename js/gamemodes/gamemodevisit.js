var VGUIData = function (game) {
    this.game = game;
    
    this.GoToProject = function(){
        setMode(gameModeProject);
    };
};

function GameModeVisit(name) {
    GameMode.call(this, name);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.gui = new dat.GUI({
//        height: 5 * 32 - 1
//        autoPlace: false
    });
    this.walls = [];
    this.floor = null;
    
    var guiData = new VGUIData(this);    
    this.gui.add(guiData, 'GoToProject');

    this.camera.rotation.set(0, 0, 0);

    this.pitchObject = new THREE.Object3D();
    this.pitchObject.add(this.camera);

    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 1;
    this.yawObject.add(this.pitchObject);
    this.scene.add(this.yawObject);

    this.PI_2 = Math.PI / 2;
    
    this.moveForward = false;
    this.moveLeft = false;
    this.moveBackward = false;
    this.moveRight = false;
    
    this.raycaster = new THREE.Raycaster();
}

GameModeVisit.prototype = Object.create(GameMode.prototype);
GameModeVisit.prototype.constructor = GameModeVisit;

GameModeVisit.prototype.getClearColor = function () {
    return 0xffffff;
};

GameModeVisit.prototype.activate = function () {
    //console.log('activate visit');
    $(this.gui.domElement).attr("hidden", false);
    this.clear();
    
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, -5);
    this.scene.add(cube);
    this.walls.push(cube);
    
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 5);
    this.scene.add(cube);
    this.walls.push(cube);

    cube = new THREE.Mesh(geometry, material);
    cube.position.set(5, 0, 0);
    this.scene.add(cube);
    this.walls.push(cube);
    
    this.createFloor(gameModeProject.floor);    
    for(var i = 0 ; i < gameModeProject.walls.length ; ++i ){
       this.createWall( gameModeProject.walls[i] );
    }    
};
GameModeVisit.prototype.deactivate = function () {
    //console.log('deactivate visit');
    $(this.gui.domElement).attr("hidden", true);
    this.clear();
};

GameModeVisit.prototype.clear = function () {
    this.moveForward = false;
    this.moveLeft = false;
    this.moveBackward = false;
    this.moveRight = false;
    
    if( this.floor ) this.scene.remove(this.floor);
    this.floor = null;
    
    for( var i = 0 ; i < this.walls.length ; ++i ){
        this.scene.remove(this.walls[i]);
    }
    this.walls = [];
    
    //this.scene. = [];
};

GameModeVisit.prototype.createFloor = function(projFloor){
    var gmp = gameModeProject;
    
    var floorGeometry = new THREE.PlaneGeometry(
            gmp.stageSize * 2, gmp.stageSize * 2,
            gmp.stageSize, gmp.stageSize);

    //var floorMaterial = new THREE.MeshBasicMaterial({color: 0xbbbbbb});    
    this.floor = new THREE.Mesh(floorGeometry, gmp.floor.material);
    this.floor.position.set(0, -gmp.halfGridStep / gmp.gridStep, 0);
    //this.floor.position.set(0, -1, 0);
    var newRot = this.floor.rotation;
    var rad = THREE.Math.degToRad(-90);
    newRot.x = rad;
    this.floor.rotation = newRot;
    //this.floor.receiveShadow = true;    
    //this.floor.visible = true;
    this.scene.add(this.floor);
    //console.log(this.floor);
};

GameModeVisit.prototype.createWall = function(projWall){
    var gmp = gameModeProject;
    
    var geometry = new THREE.BoxGeometry(1,1,1);
    var material = projWall.material; //new THREE.MeshBasicMaterial({color: nwd.Material.Color, map: null});
//    material.transparent = true;
//    if( nwd.Material.File ){
//        var _tex = this.textures[nwd.Material.File].clone();
//        _tex.repeat.x = nwd.Material.RepeatX;
//        _tex.repeat.y = nwd.Material.RepeatY;
//        _tex.needsUpdate = true;
//        material.map = _tex;
//        material.needsUpdate = true;
//    }
    var newWall = new THREE.Mesh(geometry, material);
    
    //newWall.position.set(nwd.Pos.X * this.gridStep, nwd.Pos.Y * this.gridStep, nwd.Pos.Z * this.gridStep);
    newWall.position.set( projWall.position.x / gmp.gridStep, projWall.position.y / gmp.gridStep , projWall.position.z / gmp.gridStep);    
    newWall.rotation = projWall.rotation.clone();
    newWall.scale = projWall.scale.clone();
    
    this.scene.add(newWall);
    this.walls.push(newWall);
    return newWall;
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
    
    
    var trLen = trans.length();
    if( trLen !== 0 ) {
        //console.log(trans);
        //console.log(moveDir);
        
        var moveDir = this.yawObject.localToWorld(trans.clone()).sub( this.yawObject.position.clone() ).normalize();
        
        this.raycaster.set(this.yawObject.position.clone(),moveDir);
        this.raycaster.far = 1;//trLen;
        
        var intersects = this.raycaster.intersectObjects(this.walls);
        if (intersects.length > 0) {
            canMove = false;
        } else {
        }
    }
    
    if( canMove ){
        //console.log("move : " + trans.x);
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
        