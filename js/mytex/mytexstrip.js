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


