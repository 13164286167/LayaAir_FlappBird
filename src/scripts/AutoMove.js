export default class AutoMove extends Laya.Script{
    constructor(){
        super();
    }
    onAwake(){
        this.setLinearVelocity(-4,0)
        Laya.stage.on("GameOver",this,function(){
            this.setLinearVelocity(0,0)
        })
        Laya.stage.on("GameAgain",this,function(){
            this.setLinearVelocity(-4,0)
        })
    }
    onUpdate(){
        if(Laya.stage.isGameOver){
            this.setLinearVelocity(0,0)
        }
    }
    setLinearVelocity(x=0,y=0){
        this.owner.getComponent(Laya.RigidBody).linearVelocity = {x,y}
    }
}