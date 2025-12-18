import { _decorator, Color, Component, math, Node, Sprite, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Food')
export class Food extends Component {
    
    start() {
        this.node.getComponent(Sprite).color = this.initColor();
        this.node.setPosition(this.initPosition());
    }

    update(deltaTime: number) {
        
    }

    private initColor() {
        // 可以在这里添加初始化颜色的逻辑
        let r = math.randomRangeInt(0, 256);
        let g = math.randomRangeInt(0, 256);
        let b = math.randomRangeInt(0, 256);
        return new Color(r, g, b);
    }

    /**
     * 初始化位置
     */
    private initPosition() {
        // 获取父节点的UITransform组件及长宽
        const uiTransform = this.node.getParent().getComponent(UITransform);
        const width = uiTransform.contentSize.width;
        const height = uiTransform.contentSize.height;

        // 生成随机位置
        const x = math.randomRangeInt((-width/2+100), (width/2 - 100));
        const y = math.randomRangeInt((-height/2+100), (height/2 - 100));
        return new Vec3(x, y, 0);
    }
}


