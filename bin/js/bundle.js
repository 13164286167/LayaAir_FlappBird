(function () {
    'use strict';

    class AutoMove extends Laya.Script{
        constructor(){
            super();
        }
        onAwake(){
            this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:-3,y:0};
            Laya.stage.on("GameOver",this,function(){
                this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:0,y:0};
            });
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
        }
        mouseDown(){
            if(Laya.stage.isGameOver)return;
            this.owner.getComponent(Laya.RigidBody).linearVelocity = {x:0,y:-10};
            this.owner.autoAnimation = "fly";
            this.owner.loop = false;
        }
        onUpdate(){
            if(!this.owner.isPlaying){
                this.owner.autoAnimation = "idle";
            }
        }
        onTriggerEnter(other){
            if(other.name === "topBox")return;
            this.owner.autoAnimation = "die";
            Laya.stage.event("GameOver");
            Laya.stage.isGameOver = true;
        }

    }

    let timer = 0,ranTime = 0;
    let parent ;
    class ColumnSpawn extends Laya.Script{
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
                ranTime = this.getRandom(3000,4500);
                this.spawn();
            }
        }
        spawn(){
            let column = this.columnPre.create();
            let columnTop = this.columnPre.create();
            let columnY = this.getRandom(300,660);
            column.pos(1920,columnY);
            parent.addChild(column);
            let delta = this.getRandom(245,348);
            let topY = columnY - delta;
            columnTop.rotation = 180;
            columnTop.pos(2176,topY);
            parent.addChild(columnTop);
            columnTop.isPassed = true;
        }
        getRandom(min,max){
            return Math.random()*(max-min)+min;
        }
    }

    let gold = 0;
    class PassColumn extends Laya.Script{
        constructor(){
            super();
        }
        onUpdate(){
            if(this.owner.x <= 75 && !this.owner.isPassed){
                this.owner.isPassed = true;
                console.log( ++gold);
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
    		reg("scripts/PassColumn.js",PassColumn);
        }
    }
    GameConfig.width = 1920;
    GameConfig.height = 1080;
    GameConfig.scaleMode ="fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "game.scene";
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
