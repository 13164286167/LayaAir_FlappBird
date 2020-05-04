let gold = 0;
export default class PassColumn extends Laya.Script{
    constructor(){
        super();
    }
    onUpdate(){
        if(this.owner.x < -255){
            this.owner.removeSelf();
            Laya.Pool.recover("Column",this.owner)
            console.log("recover")
        }
        if(this.owner.x <= 75 && !this.owner.isPassed){
            this.owner.isPassed = true;
            console.log( ++gold)
        }
    }
}
