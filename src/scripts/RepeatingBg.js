let width;
export default class RepeatingBg extends Laya.Script{
    constructor(){
        super();
    }
    onAwake(){
        width = this.owner.width;
    }
    onUpdate(){
        if(this.owner.x <= -width ){
            this.owner.x += width*2;
        }
    }
}
