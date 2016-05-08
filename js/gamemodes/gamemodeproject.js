/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var SOPos = function () {
    this.X = 0;
    this.Y = 0;
    this.Z = 0;    
};

var SORot = function () {
    this.X = 0;
    this.Y = 0;
    this.Z = 0;    
};

var SOScale = function () {
    this.X = 0;
    this.Y = 0;
    this.Z = 0;    
};

var SOD = function () {
    this.pos = new SOPos();    
};
        
function GameModeProject(name) {
    GameMode.call(this, name);

    this.scene = new THREE.Scene();
    
    this.cameraType = 1;
    
    if( this.cameraType === 1 ){
        this.camera = new THREE.OrthographicCamera( 
            window.innerWidth / -2, window.innerWidth / 2,
            window.innerHeight / 2, window.innerHeight / -2, -1000, 10000);
            //-2.5, 2.5,
            //2.5, -2.5, 
            //-500, 1000);
    } else {
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    }
    this.cameraRestrict = new THREE.Vector3(1000,1000,1000);    
    this.camera.position.set(0,this.cameraRestrict.y,this.cameraRestrict.z);
    
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));		
    
    this.gui = new dat.GUI({
//        height: 5 * 32 - 1
//        autoPlace: false
    });
    
    var folderPosition = this.gui.addFolder('Position');

    this.sod = new SOD();

    var cntr = folderPosition.add(this.sod.pos, 'X').listen();
    cntr.step(0.1);
    cntr.onChange(selObjPosChanged);
    cntr.onFinishChange(selObjPosChanged);

    cntr = folderPosition.add(this.sod.pos, 'Y').listen();
    cntr.step(0.1).min(0);
    cntr.onChange(selObjPosChanged);
    cntr.onFinishChange(selObjPosChanged);

    cntr = folderPosition.add(this.sod.pos, 'Z').listen();
    cntr.step(0.1);
    cntr.onChange(selObjPosChanged);
    cntr.onFinishChange(selObjPosChanged);
       
    
    this.gui.domElement.id = 'guiProject';
    var customContainer = $('.moveGUI').append($(this.gui.domElement));
    

    // Grid
    this.gridStep = 50;
    this.stageSize = 10;
    var gridSize = this.stageSize * this.gridStep;
    this.halfGridStep = this.gridStep * 0.5;
    
    var gridGeometry = new THREE.Geometry();
    
    for (var i = -gridSize; i <= gridSize; i += this.gridStep) {
        gridGeometry.vertices.push(new THREE.Vector3(-gridSize, -this.halfGridStep, i));
        gridGeometry.vertices.push(new THREE.Vector3(gridSize, -this.halfGridStep, i));
        gridGeometry.vertices.push(new THREE.Vector3(i, -this.halfGridStep, -gridSize));
        gridGeometry.vertices.push(new THREE.Vector3(i, -this.halfGridStep, gridSize));
    }
    var gridMaterial = new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2});
    var gridLine = new THREE.LineSegments(gridGeometry, gridMaterial);
    this.scene.add(gridLine);

    this.cubes = [];
    this.selectedCube = null;
    this.highlightCube = null;
    
    var geometry = new THREE.BoxGeometry(50, 50, 50);
    var material = new THREE.MeshBasicMaterial({color: 0xff8000});
    material.transparent = true;
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    this.scene.add(cube);
    this.cubes.push(cube);
    
    var material2 = new THREE.MeshBasicMaterial({color: 0xff8000});
    material2.transparent = true;    
    var cube2 = new THREE.Mesh(geometry, material2);
    this.scene.add(cube2);
    cube2.position.set(0, 150, 0);    
    //cube2.material.transparent = true;
    //cube2.material.opacity = 0.5;
    this.cubes.push(cube2);
    
    //$(this.gui.domElement).attr("hidden", true);
    
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
    
    this.xrat = Math.PI * 0.25;
    this.yrat = Math.PI * 0.25;
    this.zrat = Math.PI * 0.25;
    
    this.raycaster = new THREE.Raycaster();
}

GameModeProject.prototype = Object.create(GameMode.prototype);
GameModeProject.prototype.constructor = GameModeProject;

GameModeProject.prototype.f1 = function () {
    console.log("GameModeProject::f1 " + this.name);
};

GameModeProject.prototype.f2 = function () {
    console.log("GameModeProject::f2 " + this.name);
};

var selObjPosChanged = function (val) {
    if( gameModeProject.selectedCube === null ) return;
    
    //console.log("GameModeProject::posChanged " + val);
    //console.log(this);
    //console.log(this.property + " : " + val);
    
    //if( this.property === "X" )
    switch(this.property){
        case "X":
            gameModeProject.selectedCube.position.x = val * gameModeProject.gridStep;
            break;
        case "Y":
            gameModeProject.selectedCube.position.y = val * gameModeProject.gridStep;
            break;
        case "Z":
            gameModeProject.selectedCube.position.z = val * gameModeProject.gridStep;
            break;
    }
};

GameModeProject.prototype.getClearColor = function () {
    return 0xffffff;
};

GameModeProject.prototype.activate = function(){
    console.log('activate project');
    $(this.gui.domElement).attr("hidden", false);
    
    this.moveUp = false;
    this.moveDown = false;  
    this.moveLeft = false;
    this.moveRight = false;
};
GameModeProject.prototype.deactivate = function(){
    console.log('deactivate project');
    $(this.gui.domElement).attr("hidden", true);
    
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
};

GameModeProject.prototype.keyDown = function (event) {

    //console.log(event.keyCode);
    //console.log(this.text.PosX++);

    //this.text.PosX = "asdf";

    //console.log(this.gui);

    switch (event.keyCode) {

        case 81: //q
            //this.pressedKeys[event.keyCode] = true;
            
            //this.camera.zoom = Math.min(5,this.camera.zoom+0.1);
            //console.log( this.camera.zoom );
            //this.onWindowResize();
            
            break;
            
        case 69: //e
            //this.pressedKeys[event.keyCode] = true;
            
            //this.camera.zoom = Math.max(0.1,this.camera.zoom-0.1);
            //console.log( this.camera.zoom );
            //this.onWindowResize();
            
            break;
            
        case 38: // up
        case 87: // w
            this.moveUp = true;
            break;

        case 37: // left
        case 65: // a
            this.moveLeft = true;
            break;

        case 40: // down
        case 83: // s
            this.moveDown = true;
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
            this.moveUp = false;
            break;

        case 37: // left
        case 65: // a
            this.moveLeft = false;
            break;

        case 40: // down
        case 83: // s
            this.moveDown = false;
            break;

        case 39: // right
        case 68: // d
            this.moveRight = false;
            break;

    }

};

GameModeProject.prototype.onWindowResize = function(){
    if( this.cameraType === 1 ){
        this.camera.left = window.innerWidth / -2;
        this.camera.right = window.innerWidth / 2;
        this.camera.top = window.innerHeight / 2;
        this.camera.bottom = window.innerHeight / -2;
        this.camera.updateProjectionMatrix();    
    }else {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
};

GameModeProject.prototype.mouseDown = function(event){
//    if( this.highlightCube === null ) return; 
//    if( this.selectedCube ){
//        this.selectedCube
//    }
//    this.selectedCube = this.highlightCube;
    
    //console.log(event.target);
    //console.log(renderer.domElement);
    
    if(event.srcElement === renderer.domElement //chrome
            || event.target === renderer.domElement //firefox
            ){
        this.setSelected(this.getFirstUnderMouse());
    }
};
GameModeProject.prototype.mouseUp = function(event){
    
};

GameModeProject.prototype.render = function (renderer) {

    var ms = 1.5;
    
    if( pressedKeys[81] ){
        this.camera.zoom = Math.min(5,this.camera.zoom + deltaTime*ms);
        this.onWindowResize();
    }else if( pressedKeys[69] ){
        this.camera.zoom = Math.max(0.1,this.camera.zoom-deltaTime*ms);
        this.onWindowResize();
    }
    
    if( this.moveLeft ){
        this.xrat -= deltaTime * ms;
        this.zrat -= deltaTime * ms;
    }
    else if( this.moveRight ){
        this.xrat += deltaTime * ms;
        this.zrat += deltaTime * ms;
    }
    
    if( this.moveUp ){
        this.yrat = Math.min(Math.PI*0.5,this.yrat+deltaTime*ms);
    }
    else if( this.moveDown ){
        this.yrat = Math.max(0,this.yrat-deltaTime*ms);
    }
    
    this.camera.position.x = Math.sin( this.xrat ) * this.cameraRestrict.x;
    this.camera.position.y = Math.sin( this.yrat ) * this.cameraRestrict.y;
    this.camera.position.z = Math.cos( this.zrat ) * this.cameraRestrict.z;
    
    this.camera.lookAt( this.scene.position );

    this.setHighlighted(this.getFirstUnderMouse());
    
    renderer.setClearColor(this.getClearColor());
    renderer.render(this.scene, this.camera);

};

GameModeProject.prototype.getFirstUnderMouse = function(){
    this.raycaster.setFromCamera(mouse, this.camera);
    var intersects = this.raycaster.intersectObjects(this.cubes);
    if( intersects.length > 0 ){        
        return intersects[0].object;
    }else{
        return null;
    }
};

GameModeProject.prototype.setHighlighted = function(cube){
    if( cube === null ){ //zerowanie
        if( this.highlightCube !== null && this.highlightCube !== this.selectedCube ) {
            this.highlightCube.material.opacity = 1;
            this.highlightCube = null;
        }
    }else{ //ustawianie
        if( this.highlightCube !== cube ){
            if( this.highlightCube !== null && this.highlightCube !== this.selectedCube ){
                this.highlightCube.material.opacity = 1;
            }
            this.highlightCube = cube;
            this.highlightCube.material.opacity = 0.5;
        }        
    }
};

GameModeProject.prototype.setSelected = function(cube){
    if( this.selectedCube !== null ) this.selectedCube.material.opacity = 1;
    this.selectedCube = cube;
    if( this.selectedCube !== null ) {
        this.selectedCube.material.opacity = 0.5;
        this.sod.pos.X = this.selectedCube.position.x / this.gridStep;
        this.sod.pos.Y = this.selectedCube.position.y / this.gridStep;
        this.sod.pos.Z = this.selectedCube.position.z / this.gridStep;
    }else{
        this.sod.pos.X = "";
        this.sod.pos.Y = "";
        this.sod.pos.X = "";
    }
    
//    if( cube === null ){ //zerowanie
//        if( this.selectedCube !== null ) {
//            this.selectedCube.material.opacity = 1;
//            this.selectedCube = null;
//        }
//    }else{ //ustawianie
//        if( this.selectedCube !== cube ){
//            if( this.selectedCube !== null ) this.selectedCube.material.opacity = 1;
//            this.selectedCube = cube;
//            this.selectedCube.material.opacity = 0.5;
//        }        
//    }
};

GameModeProject.prototype.highlightOn = function (cube) {
    this.highlightCube = cube;
    //console.log("this.highlightOn");
    this.highlightCube.material.opacity = 0.5;
};

GameModeProject.prototype.highlightOff = function () {
    //console.log(this.highlightCube);
    if(this.highlightCube === null) return;
    if(this.highlightCube === this.selectedCube) return;
    
    this.highlightCube.material.opacity = 1.0;
    //console.log("this.highlightOff");
    //console.log(this.highlightCube);
    this.highlightCube = null;
};

GameModeProject.prototype.highlightOnOff = function (cube,hl) {
    //this.highlightCube = cube;
    //console.log("this.highlightOn");
    this.highlightCube.material.opacity = hl === true ? 0.5 : 1;
};
//
//GameModeProject.prototype.highlightOff = function () {
//    //console.log(this.highlightCube);
//    if(this.highlightCube === null) return;
//    if(this.highlightCube === this.selectedCube) return;
//    
//    this.highlightCube.material.opacity = 1.0;
//    //console.log("this.highlightOff");
//    //console.log(this.highlightCube);
//    this.highlightCube = null;
//};