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
