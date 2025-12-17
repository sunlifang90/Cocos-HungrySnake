import { _decorator, Component, Node, Prefab } from 'cc';
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
    
    start() {

    }

    update(deltaTime: number) {
        
    }
}


