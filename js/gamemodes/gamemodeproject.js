/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var SOPos = function () {
    this.X = 0.0;
    this.Y = 0.0;
    this.Z = 0.0;    
};

var SORot = function () {
    this.X = 0;
    this.Y = 0;
    this.Z = 0;    
};

var SOScale = function () {
    this.X = 0.0;
    this.Y = 0.0;
    this.Z = 0.0;    
};

var SOD = function () {
    this.pos = new SOPos();
    this.rot = new SORot();
    this.scale = new SOScale();
    
    this.Color = "#000000";
    
    //this.Textures = [];
    //this.Textures = 0; //{ Stopped: 0, Slow: 0.1, Fast: 5 }; //["asdf","qwer","zxcv"];
    
    //this.textures["rbn_0"] = ( THREE.ImageUtils.loadTexture('textures/rbn_0.png') );
    //this.textures["rbn_1"] = ( THREE.ImageUtils.loadTexture('textures/rbn_1.png') );
    //this.textures["rbn_2"] = ( THREE.ImageUtils.loadTexture('textures/rbn_2.png') );
    
    this.Textures = ["","rbn_0","rbn_1","rbn_2"];
    this.Texture = this.Textures[0];
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
    
    this.gridStep = 50;
    this.stageSize = 10;
    this.gridSize = this.stageSize * this.gridStep;
    this.halfGridStep = this.gridStep * 0.5;
    
    this.gui = new dat.GUI({
//        height: 5 * 32 - 1
//        autoPlace: false
    });
    
    this.sod = new SOD();

    {
        var folderPosition = this.gui.addFolder('Position');

        var cntr = folderPosition.add(this.sod.pos, 'X',-this.stageSize,this.stageSize).listen();
        cntr.step(0.1);
        //cntr.min(-this.stageSize/2);
        //cntr.max(this.stageSize/2);
        cntr.onChange(selObjPosChanged);
        cntr.onFinishChange(selObjPosChanged);

        cntr = folderPosition.add(this.sod.pos, 'Y',0,10).listen();
        cntr.step(0.1);//.min(0).max(30);
        cntr.onChange(selObjPosChanged);
        cntr.onFinishChange(selObjPosChanged);

        cntr = folderPosition.add(this.sod.pos, 'Z',-this.stageSize,this.stageSize).listen();
        cntr.step(0.1).min(-this.stageSize).max(this.stageSize);
        cntr.onChange(selObjPosChanged);
        cntr.onFinishChange(selObjPosChanged);
    }

    {
        var folder = this.gui.addFolder('Rotation');

        var cntr = folder.add(this.sod.rot, 'X').listen();
        //cntr.step(0.1);
        cntr.onChange(selObjRotChanged);
        cntr.onFinishChange(selObjRotChanged);

        cntr = folder.add(this.sod.rot, 'Y').listen();
        //cntr.step(0.1);
        cntr.onChange(selObjRotChanged);
        cntr.onFinishChange(selObjRotChanged);

        cntr = folder.add(this.sod.rot, 'Z').listen();
        //cntr.step(0.1);
        cntr.onChange(selObjRotChanged);
        cntr.onFinishChange(selObjRotChanged);
    }
    
    {
        var folder = this.gui.addFolder('Scale');

        var cntr = folder.add(this.sod.scale, 'X').listen();
        cntr.step(0.1).min(0.1);
        cntr.onChange(selObjScaleChanged);
        cntr.onFinishChange(selObjScaleChanged);

        cntr = folder.add(this.sod.scale, 'Y').listen();
        cntr.step(0.1).min(0.1);
        cntr.onChange(selObjScaleChanged);
        cntr.onFinishChange(selObjScaleChanged);

        cntr = folder.add(this.sod.scale, 'Z').listen();
        cntr.step(0.1).min(0.1);
        cntr.onChange(selObjScaleChanged);
        cntr.onFinishChange(selObjScaleChanged);
    }
    
    {
        var cntr = null;
        cntr = this.gui.addColor(this.sod, 'Color').listen();
        cntr.onChange(selObjColorChanged);
        cntr.onFinishChange(selObjColorChanged);
    }

    {
        var cntr = null;
        //cntr = this.gui.add(this.sod, 'Textures', ["asdf","qwer","zxcv"]); // { Stopped: 0, Slow: 0.1, Fast: 5 });
        cntr = this.gui.add(this.sod, 'Texture', this.sod.Textures).listen();
        cntr.onChange(selObjTextureChanged);
        cntr.onFinishChange(selObjTextureChanged);
    }
    
    //this.gui.domElement.id = 'guiProject';
    //var customContainer = $('.moveGUI').append($(this.gui.domElement));
        
    this.textures = [];
    this.textures[""] = null;
    this.textures["rbn_0"] = ( THREE.ImageUtils.loadTexture('textures/rbn_0.png') );
    this.textures["rbn_1"] = ( THREE.ImageUtils.loadTexture('textures/rbn_1.png') );
    this.textures["rbn_2"] = ( THREE.ImageUtils.loadTexture('textures/rbn_2.png') );
    
    this.textures["rbn_0"].wrapS = THREE.RepeatWrapping;
    this.textures["rbn_0"].wrapT = THREE.RepeatWrapping;
    this.textures["rbn_0"].repeat = new THREE.Vector2(2,2);
    
    // Grid
//    this.gridStep = 50;
//    this.stageSize = 10;
//    var gridSize = this.stageSize * this.gridStep;
//    this.halfGridStep = this.gridStep * 0.5;
    
    var draggedFloorGeometry = new THREE.BoxGeometry(this.gridStep * this.stageSize * 4, 10, this.gridStep * this.stageSize * 4);
    var draggedFloorMaterial = new THREE.MeshBasicMaterial({color: 0x888888});
    draggedFloorMaterial.transparent = true;
    this.draggedFloor = new THREE.Mesh(draggedFloorGeometry, draggedFloorMaterial);
    this.draggedFloor.position.set(0, -this.halfGridStep-5-0.5, 0);
    this.draggedFloor.visible = true;
    this.scene.add(this.draggedFloor);
    
    //var geometry = new THREE.PlaneGeometry( 5, 20, 32 );
    //var material = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
    //var plane = new THREE.Mesh( geometry, material );
    //scene.add( plane );

    var floorGeometry = new THREE.PlaneGeometry(
            this.gridStep * this.stageSize * 2, 
            this.gridStep * this.stageSize * 2, 
            this.stageSize, this.stageSize);
            
    //var floorGeometry = new THREE.PlaneGeometry(100, 100);
    
    var floorMaterial = new THREE.MeshBasicMaterial({color: 0xbbbbbb, map: this.textures["rbn_0"]});
    //floorMaterial.transparent = false;
    this.floor = new THREE.Mesh(floorGeometry, floorMaterial);
    this.floor.position.set(0, -this.halfGridStep, 0);
    var newRot = this.floor.rotation;
    var rad = THREE.Math.degToRad(-90);    
    newRot.x = rad;
    this.floor.rotation = newRot;
    //this.floor.receiveShadow = true;    
    //this.floor.visible = true;
    this.scene.add(this.floor);
    //console.log(this.floor);
    
    var draggedIndicatorGeometry = new THREE.PlaneGeometry(this.gridStep, this.gridStep);            
    var draggedIndicatorMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    this.draggedIndicator = new THREE.Mesh(draggedIndicatorGeometry, draggedIndicatorMaterial);
    this.draggedIndicator.position.set(100, -this.halfGridStep+0.1, 100);
    var newRot = this.draggedIndicator.rotation;
    var rad = THREE.Math.degToRad(-90);    
    newRot.x = rad;
    this.draggedIndicator.rotation = newRot;
    this.draggedIndicator.visible = false;
    this.scene.add(this.draggedIndicator);
    //console.log(this.floor);
    
    var ggoffset = 0.5;
    var gridGeometry = new THREE.Geometry();
    for (var i = -this.gridSize; i <= this.gridSize; i += this.gridStep) {
        gridGeometry.vertices.push(new THREE.Vector3(-this.gridSize, -this.halfGridStep+ggoffset, i));
        gridGeometry.vertices.push(new THREE.Vector3(this.gridSize, -this.halfGridStep+ggoffset, i));
        gridGeometry.vertices.push(new THREE.Vector3(i, -this.halfGridStep+ggoffset, -this.gridSize));
        gridGeometry.vertices.push(new THREE.Vector3(i, -this.halfGridStep+ggoffset, this.gridSize));
    }
    var gridMaterial = new THREE.LineBasicMaterial({color: 0x000000, opacity: 1.0});
    var gridLine = new THREE.LineSegments(gridGeometry, gridMaterial);
    this.scene.add(gridLine);

    this.cubes = [];
    this.selectedCube = null;
    this.highlightCube = null;
    this.draggedCube = null;
    this.draggedCubeOffset = null;
    
    
    var geometry = new THREE.BoxGeometry(this.gridStep, this.gridStep, this.gridStep);
    var material = new THREE.MeshBasicMaterial({color: 0xff8000, map: this.textures["rbn_0"]});
    //var material = new THREE.MeshLambertMaterial({ map: map1, color: 0xffffff, vertexColors: THREE.VertexColors });
    material.transparent = true;
    var cube = new THREE.Mesh(geometry, material);
    cube.position.set(0, 0, 0);
    this.scene.add(cube);
    this.cubes.push(cube);
    //cube.castShadow = true;
    
    var material2 = new THREE.MeshBasicMaterial({color: 0xff8000, map: this.textures["rbn_1"]});
    material2.transparent = true;
    material2.map = null;
    var cube2 = new THREE.Mesh(geometry, material2);
    this.scene.add(cube2);
    cube2.position.set(-220, 150, -150);    
    //cube2.material.transparent = true;
    //cube2.material.opacity = 0.5;
    this.cubes.push(cube2);
    //cube.castShadow = true;
    
    //this.light = new THREE.PointLight( 0xffffff, 1, 1000 );
    //this.light.position.set( 0, 0, 0 );
    //this.light.castShadow = true;
    //cube2.add( this.light );
    
    //var light = new THREE.AmbientLight( 0xffffff ); // soft white light
    //this.scene.add( light );

    //$(this.gui.domElement).attr("hidden", true);
    
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
    
    this.xrat = Math.PI * 0.25;
    this.yrat = Math.PI * 0.25;
    this.zrat = Math.PI * 0.25;
    
    this.raycaster = new THREE.Raycaster();
    
    this.setSelected(null);
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
    gameModeProject.draggedIndicator.position.x = gameModeProject.selectedCube.position.x;
    gameModeProject.draggedIndicator.position.z = gameModeProject.selectedCube.position.z;
};

var selObjRotChanged = function (val) {
    if( gameModeProject.selectedCube === null ) return;
    
    var newRot = gameModeProject.selectedCube.rotation;
    var rad = THREE.Math.degToRad(val);
    
    switch(this.property){
        case "X":
            newRot.x = rad;
            break;
        case "Y":
            newRot.y = rad;
            break;
        case "Z":
            newRot.z = rad;
            break;
    }
    
    gameModeProject.selectedCube.rotation = newRot;
};

var selObjScaleChanged = function (val) {
    if( gameModeProject.selectedCube === null ) return;
    switch(this.property){
        case "X":
            gameModeProject.selectedCube.scale.x = val;
            break;
        case "Y":
            gameModeProject.selectedCube.scale.y = val;
            break;
        case "Z":
            gameModeProject.selectedCube.scale.z = val;
            break;
    }
};

var selObjColorChanged = function(val){
    if( gameModeProject.selectedCube === null ) return;
    gameModeProject.selectedCube.material.color = new THREE.Color(val);
}

var selObjTextureChanged = function(val){
    if( gameModeProject.selectedCube === null ) return;
    
    var currentMaterial = gameModeProject.selectedCube.material;
    //console.log(currentMaterial);
    var newMaterial = new THREE.MeshBasicMaterial({color: currentMaterial.color});
    if( val !== null ){
        newMaterial.map = gameModeProject.textures[val];
    }
    
//    if( currentMaterial.map !== null ){
//        //console.log("set: " + gameModeProject.textures[val]);
//        var newMaterial = new THREE.MeshBasicMaterial({color: currentMaterial.color});
//        newMaterial.map = 
//        currentMaterial.map = gameModeProject.textures[val];
//    }else{
//        //console.log("set: " + gameModeProject.textures[val]);
//        var newMaterial = new THREE.MeshBasicMaterial({color: currentMaterial.color});        
//    }

    gameModeProject.selectedCube.material = newMaterial;
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
    
    this.setSelected(null);
    this.setHighlighted(null);
    this.draggedCube = null;
};

GameModeProject.prototype.deactivate = function(){
    console.log('deactivate project');
    $(this.gui.domElement).attr("hidden", true);
    
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
    
    this.setSelected(null);
    this.setHighlighted(null);
    this.draggedCube = null;
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
        
        this.raycaster.setFromCamera(mouse, this.camera);
        var intersects = this.raycaster.intersectObject(this.draggedFloor);
        if( intersects.length > 0 ){
            this.draggedCube = this.selectedCube;
            this.draggedCubeOffset = intersects[0].point.clone().sub(this.draggedCube.position.clone());
            this.draggedCubeOffset.y = 0;
            //console.log(this.draggedCubeOffset);            
        }        
    }
};
GameModeProject.prototype.mouseUp = function(event){
    this.draggedCube = null;
};

GameModeProject.prototype.mouseMove = function (event){
    if( this.draggedCube ){
        //console.log("asdf");
        this.raycaster.setFromCamera(mouse, this.camera);
        var intersects = this.raycaster.intersectObject(this.draggedFloor);
        if( intersects.length > 0 ){        
            var newPos = intersects[0].point.clone().sub(this.draggedCubeOffset.clone());
            newPos.x = Math.min( Math.max(-this.gridSize,newPos.x), this.gridSize );
            newPos.z = Math.min( Math.max(-this.gridSize,newPos.z), this.gridSize );
            this.draggedCube.position.set(newPos.x,this.draggedCube.position.y,newPos.z);            
            this.draggedIndicator.position.x = this.draggedCube.position.x;
            this.draggedIndicator.position.z = this.draggedCube.position.z;
            this.udpateGUIPos(this.selectedCube);
        }
    }
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
            this.draggedIndicator.visible = false;
        }        
    }else{ //ustawianie
        if( this.highlightCube !== cube ){
            if( this.highlightCube !== null && this.highlightCube !== this.selectedCube ){
                this.highlightCube.material.opacity = 1;
            }
            this.highlightCube = cube;
            this.highlightCube.material.opacity = 0.5;
            this.draggedIndicator.visible = true;
            this.draggedIndicator.position.x = cube.position.x;
            this.draggedIndicator.position.z = cube.position.z;
        }        
    }
};
GameModeProject.prototype.udpateGUIPos = function(cube){
    if(cube !== null){
        this.sod.pos.X = cube.position.x / this.gridStep;
        this.sod.pos.Y = cube.position.y / this.gridStep;
        this.sod.pos.Z = cube.position.z / this.gridStep;
    }else{
        this.sod.pos.X = "Nan";
        this.sod.pos.Y = "Nan";
        this.sod.pos.Z = "Nan";
    }
}

GameModeProject.prototype.setSelected = function(cube){
    if( this.selectedCube !== null ) this.selectedCube.material.opacity = 1;
    this.selectedCube = cube;
    
    if( this.selectedCube !== null ) {
        this.selectedCube.material.opacity = 0.5;
        
        //this.sod.pos.X = this.selectedCube.position.x / this.gridStep;
        //this.sod.pos.Y = this.selectedCube.position.y / this.gridStep;
        //this.sod.pos.Z = this.selectedCube.position.z / this.gridStep;        
        this.udpateGUIPos(this.selectedCube);
        
        var sor = this.selectedCube.rotation;
        this.sod.rot.X = THREE.Math.radToDeg(sor.x);
        this.sod.rot.Y = THREE.Math.radToDeg(sor.y);
        this.sod.rot.Z = THREE.Math.radToDeg(sor.z);
        
        this.sod.scale.X = this.selectedCube.scale.x;
        this.sod.scale.Y = this.selectedCube.scale.y;
        this.sod.scale.Z = this.selectedCube.scale.z;
        
        //this.sod.Color = "#000000";
        this.sod.Color = "#"+this.selectedCube.material.color.getHexString();
        
        //console.log(this.selectedCube.material.map);
        //console.log(this.selectedCube.material.map.image.src);
        
        var curMap = this.selectedCube.material.map;
        if( curMap !== null){
            var texName = this.selectedCube.material.map.image.src;
            var n1 = texName.lastIndexOf('/')+1;
            var n2 = texName.lastIndexOf('.png');
            this.sod.Texture = texName.substr(n1,n2-n1);
        }else{
            this.sod.Texture = "";
        }
            
    }else{
        //this.sod.pos.X = "Nan";
        //this.sod.pos.Y = "Nan";
        //this.sod.pos.Z = "Nan";
        this.udpateGUIPos(null);
        
        this.sod.rot.X = "Nan";
        this.sod.rot.Y = "Nan";
        this.sod.rot.Z = "Nan";
        
        this.sod.scale.X = "Nan";
        this.sod.scale.Y = "Nan";
        this.sod.scale.Z = "Nan";
        
        this.sod.Color = "#000000";
        
        this.sod.Texture = "";
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