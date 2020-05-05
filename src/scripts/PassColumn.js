export default class PassColumn extends Laya.Script{
    constructor(){
        super();
    }
    
    
    onUpdate(){
        if(this.owner.x < -255){
            this.owner.removeSelf();
            Laya.Pool.recover("Column",this.owner)
        }
        if(this.owner.x <= 206 && !this.owner.isPassed){
            this.owner.isPassed = true;
            Laya.SoundManager.playSound("audio/gold.mp3")
            Laya.stage.event("AddScore")
        }
    }
}
