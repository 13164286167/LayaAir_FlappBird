let timer = 0,ranTime = 0;
let parent ;
export default class ColumnSpawn extends Laya.Script{
    constructor(){
        super();
         /** @prop {name:columnPre, tips:"提示文本", type:Prefab, default:null}*/
        this.columnPre = null;
    }
    onAwake(){
        parent = this.owner.getChildByName("columnParent");
    }
    onUpdate(){
        if(Laya.stage.isGameOver)return;
        timer+=Laya.timer.delta;
        if(timer > ranTime){
            timer = 0;
            ranTime = this.getRandom(3000,4500)
            this.spawn();
        }
    }
    spawn(){
        let column = this.columnPre.create();
        let columnTop = this.columnPre.create();
        let columnY = this.getRandom(300,660)
        column.pos(1920,columnY)
        parent.addChild(column);
        let delta = this.getRandom(245,348);
        let topY = columnY - delta;
        columnTop.rotation = 180;
        columnTop.pos(2176,topY)
        parent.addChild(columnTop);
        columnTop.isPassed = true;
    }
    getRandom(min,max){
        return Math.random()*(max-min)+min;
    }
}
