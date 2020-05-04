export default class AutoMove extends Laya.Script{
    constructor(){
        super();
    }
    onAwake(){
        this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:-3,y:0}
        Laya.stage.on("GameOver",this,function(){
            this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:0,y:0}
        })
    }
    onUpdate(){
        if(Laya.stage.isGameOver){
            this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:0,y:0}
        }
    }
}