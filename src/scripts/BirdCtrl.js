export default class BirdCtrl extends Laya.Script{
    constructor(){
        super();
    }
    onAwake(){
        Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown)
        // 
        this.owner.getComponent(Laya.RigidBody).type = "static"
        Laya.stage.on("GameAgain",this,this.gameAgain)
        Laya.stage.on("GameStart",this,this.gameStart)
    }
    gameStart(){
        this.owner.getComponent(Laya.RigidBody).type = "dynamic";
        this.mouseDown();
    }
    gameAgain(){
        Laya.stage.isGameOver = false;
        this.owner.autoAnimation = "idle"
        this.owner.pos(300,402)
        this.owner.rotation = 0;
        this.mouseDown();
    }
    mouseDown(){
        if(Laya.stage.isGameOver || !Laya.stage.isStart)return;
        this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:0,y:-10}
        this.owner.autoAnimation = "fly"
        this.owner.loop = false;
        Laya.SoundManager.playSound("audio/fly.mp3")
    }
    onUpdate(){
        if(!this.owner.isPlaying){
            this.owner.autoAnimation = "idle"
        }
    }
    onTriggerEnter(other){
        if(other.owner.name === "topBox" || Laya.stage.isGameOver)return;
        this.owner.autoAnimation = "die";
        Laya.SoundManager.playSound("audio/hit.mp3")
        Laya.stage.isGameOver = true;
        Laya.stage.event("GameOver")
    }

}