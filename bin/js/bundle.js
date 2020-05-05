(function () {
    'use strict';

    class AutoMove extends Laya.Script{
        constructor(){
            super();
        }
        onAwake(){
            this.setLinearVelocity(-4,0);
            Laya.stage.on("GameOver",this,function(){
                this.setLinearVelocity(0,0);
            });
            Laya.stage.on("GameAgain",this,function(){
                this.setLinearVelocity(-4,0);
            });
        }
        onUpdate(){
            if(Laya.stage.isGameOver){
                this.setLinearVelocity(0,0);
            }
        }
        setLinearVelocity(x=0,y=0){
            this.owner.getComponent(Laya.RigidBody).linearVelocity = {x,y};
        }
    }

    let width;
    class RepeatingBg extends Laya.Script{
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

    class BirdCtrl extends Laya.Script{
        constructor(){
            super();
        }
        onAwake(){
            Laya.stage.on(Laya.Event.MOUSE_DOWN,this,this.mouseDown);
            // 
            this.owner.getComponent(Laya.RigidBody).type = "static";
            Laya.stage.on("GameAgain",this,this.gameAgain);
            Laya.stage.on("GameStart",this,this.gameStart);
        }
        gameStart(){
            this.owner.getComponent(Laya.RigidBody).type = "dynamic";
            this.mouseDown();
        }
        gameAgain(){
            Laya.stage.isGameOver = false;
            this.owner.autoAnimation = "idle";
            this.owner.pos(300,402);
            this.owner.rotation = 0;
            this.mouseDown();
        }
        mouseDown(){
            if(Laya.stage.isGameOver || !Laya.stage.isStart)return;
            this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:0,y:-10};
            this.owner.autoAnimation = "fly";
            this.owner.loop = false;
            Laya.SoundManager.playSound("audio/fly.mp3");
        }
        onUpdate(){
            if(!this.owner.isPlaying){
                this.owner.autoAnimation = "idle";
            }
        }
        onTriggerEnter(other){
            if(other.owner.name === "topBox" || Laya.stage.isGameOver)return;
            this.owner.autoAnimation = "die";
            Laya.SoundManager.playSound("audio/hit.mp3");
            Laya.stage.isGameOver = true;
            Laya.stage.event("GameOver");
        }

    }

    let timer = 0,ranTime = 0;
    let parent ;
    let children = [];
    class ColumnSpawn extends Laya.Script{
        constructor(){
            super();
             /** @prop {name:columnPre, tips:"提示文本", type:Prefab, default:null}*/
            this.columnPre = null;
        }
        onAwake(){
            parent = this.owner.getChildByName("columnParent");
            Laya.stage.on("GameAgain",this,this.gameAgain);
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
                ranTime = this.getRandom(2000,3500);
                this.spawn();
            }
        }
        spawn(){
            if(Laya.stage.isGameOver)return;
            let column = Laya.Pool.getItemByCreateFun("Column",this.createFun,this);
            let columnTop = Laya.Pool.getItemByCreateFun("Column",this.createFun,this);
           
            column.isPassed = false;
            column.rotation = 0;

            let columnY = this.getRandom(300,660);
            column.pos(1920,columnY);
            let delta = this.getRandom(245,345);
            let topY = columnY - delta;
            columnTop.rotation = 180;
            columnTop.pos(2176,topY > 20 ? topY : 20);
            columnTop.isPassed = true;
            parent.addChild(column);
            parent.addChild(columnTop);

        }
        createFun(){
            let column = this.columnPre.create();
            return column;
        }
        getRandom(min,max){
            return Math.random()*(max-min)+min;
        }
    }

    class UICtrl extends Laya.Script{
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
            });
            Laya.stage.on("GameOver",this,this.gameOver);
            this.init();
        }
        init(){
            this.rankPannelInit();
            let btnAgain = this.btnAgain = this.blackBg.getChildByName("btn_again");
            Laya.stage.isStart = false;
            this.scoreText.alpha = 0;
            btnAgain.on(Laya.Event.CLICK,this,this.btnAgainClick);
            let startBtn = this.owner.getChildByName("btn_start");
            startBtn.on(Laya.Event.CLICK,this,this.startClick);
        }

        rankPannelInit(){
            let showRank = this.showRank = this.blackBg.getChildByName("btn_rank");
            let rankPannel = this.rankPannel = this.owner.getChildByName("rankPannel");
            this.endScore = this.blackBg.getChildByName("endScore");
            this.rankText = rankPannel.getChildByName("rankText");
            rankPannel.visible = false;
            showRank.on(Laya.Event.CLICK,this,this.rankCLick);
        }
        rankCLick(){
            this.rankPannel.visible = true;
            this.rankPannel.show(true,true);
            let rankInfo = Laya.LocalStorage.getItem("rankInfo");
            if(!rankInfo){
                rankInfo = [0,0,0];
            }else{
                rankInfo = JSON.parse(rankInfo);
            }
            rankInfo.push(this.score);
            rankInfo.forEach((rank,index) => {
                rankInfo[index] = parseInt(rank);
            });
            rankInfo.sort((a,b)=>{return b-a});
            if(rankInfo.length>100)rankInfo.length = 100;
            Laya.LocalStorage.setItem("rankInfo",JSON.stringify(rankInfo));
            this.rankText.text = `1 - ${rankInfo[0]}\n2 - ${rankInfo[1]}\n3 - ${rankInfo[2]}`;
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
            Laya.stage.event("GameAgain");
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
            }),100,false,true);
        }
    }

    class PassColumn extends Laya.Script{
        constructor(){
            super();
        }
        
        
        onUpdate(){
            if(this.owner.x < -255){
                this.owner.removeSelf();
                Laya.Pool.recover("Column",this.owner);
            }
            if(this.owner.x <= 206 && !this.owner.isPassed){
                this.owner.isPassed = true;
                Laya.SoundManager.playSound("audio/gold.mp3");
                Laya.stage.event("AddScore");
            }
        }
    }

    /**This class is automatically generated by LayaAirIDE, please do not make any modifications. */

    class GameConfig {
        static init() {
            //注册Script或者Runtime引用
            let reg = Laya.ClassUtils.regClass;
    		reg("scripts/AutoMove.js",AutoMove);
    		reg("scripts/RepeatingBg.js",RepeatingBg);
    		reg("scripts/BirdCtrl.js",BirdCtrl);
    		reg("scripts/ColumnSpawn.js",ColumnSpawn);
    		reg("scripts/UICtrl.js",UICtrl);
    		reg("scripts/PassColumn.js",PassColumn);
        }
    }
    GameConfig.width = 1920;
    GameConfig.height = 1080;
    GameConfig.scaleMode ="showall";
    GameConfig.screenMode = "horizontal";
    GameConfig.alignV = "middle";
    GameConfig.alignH = "center";
    GameConfig.startScene = "Main.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;

    GameConfig.init();

    class Main {
    	constructor() {
    		//根据IDE设置初始化引擎		
    		if (window["Laya3D"]) Laya3D.init(GameConfig.width, GameConfig.height);
    		else Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
    		Laya["Physics"] && Laya["Physics"].enable();
    		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
    		Laya.stage.scaleMode = GameConfig.scaleMode;
    		Laya.stage.screenMode = GameConfig.screenMode;
    		Laya.stage.alignV = GameConfig.alignV;
    		Laya.stage.alignH = GameConfig.alignH;
    		//兼容微信不支持加载scene后缀场景
    		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

    		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
    		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
    		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
    		if (GameConfig.stat) Laya.Stat.show();
    		Laya.alertGlobalError(true);

    		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
    		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
    	}

    	onVersionLoaded() {
    		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
    		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
    	}

    	onConfigLoaded() {
    		//加载IDE指定的场景
    		GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    	}
    }
    //激活启动类
    new Main();

}());
