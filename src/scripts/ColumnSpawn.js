let timer = 0,ranTime = 0;
let parent ;
let children = [];
export default class ColumnSpawn extends Laya.Script{
    constructor(){
        super();
         /** @prop {name:columnPre, tips:"提示文本", type:Prefab, default:null}*/
        this.columnPre = null;
    }
    onAwake(){
        parent = this.owner.getChildByName("columnParent");
        Laya.stage.on("GameAgain",this,this.gameAgain)
    }
    gameAgain(){
        timer = 0;
        ranTime = 0;
        let childrenArr = parent._children.concat();
        childrenArr.forEach((child,i) => {
            child.removeSelf();
        });
    }
    onUpdate(){
        if(Laya.stage.isGameOver || !Laya.stage.isStart)return;
        timer+=Laya.timer.delta;
        if(timer > ranTime){
            timer = 0;
            ranTime = this.getRandom(2000,3500)
            this.spawn();
        }
    }
    spawn(){
        if(Laya.stage.isGameOver)return;
        let column = Laya.Pool.getItemByCreateFun("Column",this.createFun,this);
        let columnTop = Laya.Pool.getItemByCreateFun("Column",this.createFun,this);
       
        column.isPassed = false;
        column.rotation = 0;

        let columnY = this.getRandom(300,660)
        column.pos(1920,columnY)
        let delta = this.getRandom(245,345);
        let topY = columnY - delta;
        columnTop.rotation = 180;
        columnTop.pos(2176,topY > 20 ? topY : 20)
        columnTop.isPassed = true;
        parent.addChild(column)
        parent.addChild(columnTop)

    }
    createFun(){
        let column = this.columnPre.create();
        return column;
    }
    getRandom(min,max){
        return Math.random()*(max-min)+min;
    }
}
