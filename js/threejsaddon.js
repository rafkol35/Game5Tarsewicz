//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function MyTex(name,type){
    this.name = name;
    this.type = type;
};

MyTex.prototype.getTHREETexture = function(){
    return null;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function MyTexGfx(name){
    MyTex.call(name,1);
    //tu to przeciez tak nie moze byc... bo dla kazdego sie bedzie robic load...
    this.threeTex = new THREE.TextureLoader().load('textures/' + name + '.png');
    this.threeTex.wrapS = THREE.RepeatWrapping;
    this.threeTex.wrapT = THREE.RepeatWrapping;            
};

MyTexGfx.prototype = Object.create(MyTex);
MyTexGfx.prototype.constructor = MyTexGfx;

MyTexGfx.prototype.getTHREETexture = function(){
    return this.threeTex;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function MyTexStrip(name){
    MyTex.call(name,2);
  
//    //var newTexture = THREE.DataTexture();
//    //var newTexture = new THREE.DataTexture( data.pixels, data.width, data.height, THREE.RGBFormat );
    var pixels = [
        255,255,0,
        255,255,0,
        255,255,0,
        255,255,0,
        
        255,255,255,
        255,255,255,
        255,255,255,
        255,255,255,
        
        255,255,0,
        255,255,0,
        255,255,0,
        255,255,0,
        
        255,255,255,
        255,255,255,
        255,255,255,
        255,255,255,
    ];
    var md = new Uint8Array(pixels);
    //console.log(md);
    
    var noiseSize = 4;
    var size = noiseSize * noiseSize;
//    var data = new Uint8Array(3 * size);
//    for (var i = 0; i < size * 3; i++) {
//        data[ i ] = Math.random() * 255 | 0;
//    }
//    var data = new Uint8Array(size * 3);
//    //for( var i = 0 ; i < 3 ; ++i) data[i] = 123;
//    //var dt = new THREE.DataTexture(data, noiseSize, noiseSize, THREE.RGBFormat);
    this.threeTex = new THREE.DataTexture(md, noiseSize, noiseSize, THREE.RGBFormat);
    this.threeTex.wrapS = THREE.RepeatWrapping;
    this.threeTex.wrapT = THREE.RepeatWrapping;
    this.threeTex.repeat = new THREE.Vector2(1,1);
    this.threeTex.needsUpdate = true;

    

    
    //var newTexture = new THREE.DataTexture( new Uint8Array(pixels), 2, 2, THREE.RGBFormat );
    //var newTexture = this.textures[1].clone();// new THREE.DataTexture( pixels, 2, 2, THREE.RGBFormat );
    
    //console.log(this.textures);
    //console.log(newTexture.image);
    //newTexture.needsUpdate = true;
    //console.log(this.textures[this.Files[1]]);
    //var _nt = this.textures[this.Files[1]].clone();
    //console.log(_nt);
    //_nt.needsUpdate();
    //newWall.material.map = _nt;
    //newWall.material.map.needsUpdate = true;
    //newWall.material.needsUpdate = true;
    
    //selObjTextureChanged(this.Files[1]);
    
    
};

MyTexStrip.prototype = Object.create(MyTex);
MyTexStrip.prototype.constructor = MyTexStrip;

MyTexStrip.prototype.getTHREETexture = function(){
    return this.threeTex;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

THREE.Mesh.prototype._addMyParams = function(){
    //this.a1b2 = 8;
    //this.c3d4 = "asdf";
    this._myUVX = 1; //new THREE.Vector2(1,1);
    this._myUVY = 1;
    this._myTex = null;
};

THREE.Mesh.prototype._printMyParams = function(){
    console.log("THREE.Mesh : " + this._myUVX + " " + this._myUVY + " " + this._myTex);
};

THREE.Mesh.prototype._setMyUV = function(uvx,uvy){
    this._myUVX = uvx;
    this._myUVY = uvy;
    for (var i = 0; i < this.geometry.faceVertexUvs[0].length; ++i) {
        var _faceVertUV = this.geometry.faceVertexUvs[0][i];

        for (var j = 0; j < _faceVertUV.length; ++j) {
            var _vertUV = _faceVertUV[j];
            if (_vertUV.x !== 0) _vertUV.x = this._myUVX;
            if (_vertUV.y !== 0) _vertUV.y = this._myUVY;
       }
    }
    this.geometry.uvsNeedUpdate = true;
};

THREE.Mesh.prototype._setMyUVX = function(val){
    this._myUVX = val;
    for (var i = 0; i < this.geometry.faceVertexUvs[0].length; ++i) {
        var _faceVertUV = this.geometry.faceVertexUvs[0][i];

        for (var j = 0; j < _faceVertUV.length; ++j) {
            var _vertUV = _faceVertUV[j];
            if (_vertUV.x !== 0) _vertUV.x = this._myUVX;
       }
    }
    this.geometry.uvsNeedUpdate = true;
};

THREE.Mesh.prototype._setMyUVY = function(val){
    this._myUVY = val;
    for (var i = 0; i < this.geometry.faceVertexUvs[0].length; ++i) {
        var _faceVertUV = this.geometry.faceVertexUvs[0][i];

        for (var j = 0; j < _faceVertUV.length; ++j) {
            var _vertUV = _faceVertUV[j];
            if (_vertUV.y !== 0) _vertUV.y = this._myUVY;
       }
    }
    this.geometry.uvsNeedUpdate = true;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


