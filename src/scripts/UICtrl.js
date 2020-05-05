export default class UICtrl extends Laya.Script{
    constructor(){
        super();
        /** @prop {name:blackBg, tips:"提示文本", type:Node, default:null}*/
        this.blackBg = null;
        this.scoreText = null;
        this._score = 0;
    }
    get score(){
        return this._score;
    }
    set score(newVal){
        newVal = parseInt(newVal);
        this._score = newVal;
        this.scoreText.text = "score: " + newVal;
        
    }
    onAwake(){
        this.scoreText = this.owner.getChildByName("score");
        this.blackBg.visible = false;
        Laya.stage.on("AddScore",this,function(){
            this.score ++;
        })
        Laya.stage.on("GameOver",this,this.gameOver)
        this.init();
    }
    init(){
        this.rankPannelInit();
        let btnAgain = this.btnAgain = this.blackBg.getChildByName("btn_again")
        Laya.stage.isStart = false;
        this.scoreText.alpha = 0;
        btnAgain.on(Laya.Event.CLICK,this,this.btnAgainClick)
        let startBtn = this.owner.getChildByName("btn_start");
        startBtn.on(Laya.Event.CLICK,this,this.startClick)
    }

    rankPannelInit(){
        let showRank = this.showRank = this.blackBg.getChildByName("btn_rank")
        let rankPannel = this.rankPannel = this.owner.getChildByName("rankPannel");
        this.endScore = this.blackBg.getChildByName("endScore")
        this.rankText = rankPannel.getChildByName("rankText")
        rankPannel.visible = false;
        showRank.on(Laya.Event.CLICK,this,this.rankCLick)
    }
    rankCLick(){
        this.rankPannel.visible = true;
        this.rankPannel.show(true,true);
        let rankInfo = Laya.LocalStorage.getItem("rankInfo");
        if(!rankInfo){
            rankInfo = [0,0,0];
        }else{
            rankInfo = JSON.parse(rankInfo)
        }
        rankInfo.push(this.score)
        rankInfo.forEach((rank,index) => {
            rankInfo[index] = parseInt(rank)
        });
        rankInfo.sort((a,b)=>{return b-a});
        if(rankInfo.length>100)rankInfo.length = 100;
        Laya.LocalStorage.setItem("rankInfo",JSON.stringify(rankInfo));
        this.rankText.text = `1 - ${rankInfo[0]}\n2 - ${rankInfo[1]}\n3 - ${rankInfo[2]}`
    }
    startClick(e){
        let btn = e.currentTarget;
        btn.visible = false;
        Laya.stage.isStart = true;
        Laya.stage.event("GameStart");
        this.owner.getChildByName("title").visible = false;
        this.scoreText.alpha =1;
    }
    btnAgainClick(e){
        if(this.blackBg.alpha !== 1)return;
        let btn = e.currentTarget;
        Laya.stage.event("GameAgain")
        this.score = 0;
        this.scoreText.visible = true;
        this.blackBg.visible = false;
    }
    gameOver(){
        this.scoreText.visible = false;
        this.blackBg.visible = true;
        this.blackBg.alpha = 0;
        this.endScore.text = "本局得分:"+this.score;
        Laya.Tween.to(this.blackBg,{alpha:1},500,Laya.Ease.linearIn,new Laya.Handler(this,function(){
        }),100,false,true)
    }
}
