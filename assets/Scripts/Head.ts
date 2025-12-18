import { _decorator, Component, instantiate, math, Node, Prefab, UITransform, v2, Vec2, Vec3 } from 'cc';
import { Joystick } from './Joystick';
const { ccclass, property } = _decorator;

@ccclass('Head')
export class Head extends Component {
    
    // 预制件引用
    @property(Prefab)
    private bodyPrefab: Prefab = null;//蛇身
    @property(Prefab)
    private foodPrefab: Prefab = null;//食物

    @property([Node])
    private bodyList: Node[] = [];//身体节点列表

    @property
    private bodyNum: number = 2;//初始身体数量

    @property
    private bodyDistance: number = 50;//身体间距离
    @property
    private speed: number = 100;//移动速度

    @property({ type: Node, displayName: '摇杆' })
    private joystick: Node = null;//摇杆

    private moveDir: Vec3 = new Vec3(0, 0, 0);//移动方向
    
    protected onLoad(): void {


    }

    start() {
        //初始化蛇头
        this.initHead();

        // 创建初始身体
        for (let i = 0; i < this.bodyNum; i++) {
            this.createBody();
        }

        this.schedule(function() {
            this.moveBody();
        }, 0.3);
        this.creaeteFood();
    }

    update(deltaTime: number) {
        let pos = this.node.position.clone();
        //console.log("蛇头老位置:", pos);

        // 根据摇杆方向控制蛇头移动
        const joystickDir = this.joystick.getComponent(Joystick).dir;
        if (joystickDir.length() === 0) {

        } else {
            this.moveDir = joystickDir;
            this.node.angle = this.joystick.getComponent(Joystick).calculateAngle() -90;
        }
        const moveDistance = this.speed * deltaTime;
        const moveVector = this.moveDir.clone().normalize().multiplyScalar(moveDistance);
        this.node.position = this.node.position.add(moveVector);
    }

    private moveBody() {
        // 更新身体位置
        for (let i = this.bodyList.length - 1; i > 0; i--) {
            // 获取当前身体节点
            const currntPos = this.bodyList[i].position.clone();
            const prevPos = this.bodyList[i - 1].position.clone();

            this.bodyList[i].position = prevPos;
        }
    }

    /**
     * 初始化出生位置
     */
    private initHead() {
        // 将蛇头加入身体列表
        this.bodyList.push(this.node);

        // 获取父节点的UITransform组件及长宽
        const uiTransform = this.node.getParent().getComponent(UITransform);
        const width = uiTransform.contentSize.width;
        const height = uiTransform.contentSize.height;

        // 生成随机位置
        const x = math.randomRangeInt((-width/2+200), (width/2 - 200));
        const y = math.randomRangeInt((-height/2+200), (height/2 - 200));

        // 初始化出生位置
        this.node.setPosition(new Vec3(x, y, 0));

        // 初始化蛇头角度
        const angle = v2(1,0).signAngle(new Vec2(this.node.position.x, this.node.position.y))*180/Math.PI;
        this.node.angle = angle-90;

        // 初始化移动方向
        this.moveDir = this.node.position.clone().normalize();
    }

    private createBody() {
        const bodyNode = instantiate(this.bodyPrefab);

        // 获取前一个身体节点的位置
        const prevBodyNode = this.bodyList[this.bodyList.length - 1];
        const prevPosition = prevBodyNode.getPosition();
        // 设置新身体节点的位置
        bodyNode.setPosition(prevPosition.clone().subtract(prevPosition.clone().normalize().multiplyScalar(this.bodyDistance)));
        this.node.getParent().addChild(bodyNode);
        this.bodyList.push(bodyNode);
    }

    private creaeteFood() {
        const foodNode =  instantiate(this.foodPrefab);
        this.node.getParent().addChild(foodNode);
    }
}


