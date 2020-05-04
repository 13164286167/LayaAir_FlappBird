export default class BirdCtrl extends Laya.Script{
    constructor(){
        super();
    }
    onAwake(){
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown)
        // 
    }
    mouseDown(){
        if(Laya.stage.isGameOver)return;
        this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:0,y:-10}
        this.owner.autoAnimation = "fly"
        this.owner.loop = false;
    }
    onUpdate(){
        if(!this.owner.isPlaying){
            this.owner.autoAnimation = "idle"
        }
    }
    onTriggerEnter(other){
        if(other.name === "topBox")return;
        this.owner.autoAnimation = "die";
        Laya.stage.event("GameOver")
        Laya.stage.isGameOver = true;
    }

}