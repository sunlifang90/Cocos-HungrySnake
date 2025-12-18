import { _decorator, Collider2D, Component, Contact2DType, director, instantiate, math, Node, Prefab, UITransform, v2, Vec2, Vec3 } from 'cc';
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

        // 获取碰撞器并启用碰撞检测
        const headCollider = this.node.getComponent(Collider2D);
        headCollider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
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

        let vec:Vec3 = null;
        let prevBodyNode:Node = null;
        if (this.bodyList.length === 1) {
            // 设置第一个身体节点的位置(以原点、蛇头向量为基准)
            prevBodyNode = this.bodyList[0];
            const headPosition = this.node.getPosition();
            vec = headPosition.clone().normalize();
        } else {
            // 设置第二个之后身体节点的位置(以前一个身体节点位置、前前一个身体节点位置为基准)
            // 获取前前一个身体节点的位置
            const prevOneBodyNode = this.bodyList[this.bodyList.length - 2];
            const prevOnePosition = prevOneBodyNode.getPosition();
            // 获取前一个身体节点的位置
            prevBodyNode = this.bodyList[this.bodyList.length - 1];
            const prevPosition = prevBodyNode.getPosition();
            //计算方向向量
            vec = prevOnePosition.clone().subtract(prevPosition.clone()).normalize();
        }
        // 获取前一个身体节点的位置
        const prevPosition = prevBodyNode.getPosition();
        // 设置新身体节点的位置
        bodyNode.setPosition(prevPosition.clone().add(vec.multiplyScalar(this.bodyDistance)));
        this.node.getParent().addChild(bodyNode);
        this.bodyList.push(bodyNode);
        this.changeIndex();
    }

    private creaeteFood() {
        const foodNode =  instantiate(this.foodPrefab);
        this.node.getParent().addChild(foodNode);
    }

    private changeIndex() {
        // 调整节点层级，使蛇头显示在最前面
        
        let index = this.node.getSiblingIndex();
        let lastIndex = this.bodyList[this.bodyList.length - 1].getSiblingIndex();

        let temp = this.bodyList[this.bodyList.length - 1];
        temp.setSiblingIndex(index);
        this.node.setSiblingIndex(lastIndex);
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.group === 2) {
            console.log('吃到食物');
            // 销毁食物节点
            otherCollider.node.destroy();
            // 创建新的身体节点
            this.createBody();
            // 生成新的食物
            this.creaeteFood();
        } else if (otherCollider.group === 4) {
            director.pause();
        }
    }
}


