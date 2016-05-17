function MyTexGfx(_name){
    MyTex.call(this,_name,1);
    this.threeTex = new THREE.TextureLoader().load('textures/' + this._name + '.png');
    this.threeTex.wrapS = THREE.RepeatWrapping;
    this.threeTex.wrapT = THREE.RepeatWrapping;            
};

MyTexGfx.prototype = Object.create(MyTex);
MyTexGfx.prototype.constructor = MyTexGfx;

MyTexGfx.prototype.getTHREETexture = function(){
    return this.threeTex;
};
