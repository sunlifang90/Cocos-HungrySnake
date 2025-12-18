import { _decorator, Component, instantiate, math, Node, Prefab, UITransform, Vec3 } from 'cc';
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
    
    protected onLoad(): void {


    }

    start() {
        // 将蛇头加入身体列表
        this.bodyList.push(this.node);
        // 初始化出生位置
        this.node.setPosition(this.initBirthPosition());
        // 创建初始身体
        for (let i = 0; i < this.bodyNum; i++) {
            this.createBody();
        }

        this.creaeteFood();
    }

    update(deltaTime: number) {
        
    }

    /**
     * 初始化出生位置
     */
    private initBirthPosition() {
        // 获取父节点的UITransform组件及长宽
        const uiTransform = this.node.getParent().getComponent(UITransform);
        const width = uiTransform.contentSize.width;
        const height = uiTransform.contentSize.height;

        // 生成随机位置
        const x = math.randomRangeInt((-width/2+100), (width/2 - 100));
        const y = math.randomRangeInt((-height/2+100), (height/2 - 100));
        return new Vec3(x, y, 0);
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


