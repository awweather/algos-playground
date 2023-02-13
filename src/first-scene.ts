import Phaser from "phaser";

export class BST {
  value: number;
  left: BST | null;
  right: BST | null;
  x: number;
  y: number;
  circle: Phaser.GameObjects.Arc;
  scene: Phaser.Scene;

  constructor(value: number, scene: Phaser.Scene, x: number, y: number) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.x = x;
    this.y = y;
    this.scene = scene;

    this.circle = scene.add.circle(this.x, this.y, 20, 0xff0000);
    scene.add.text(this.x, this.y, this.value.toString());
  }

  insert(
    value: number,
    tree: BST | null,
    startX: number = -1,
    startY: number = -1,
    depth: number = 0
  ): BST {
    // Write your code here.
    // Do not edit the return statement of this method.

    if (!tree) {
      if (value < this.value)
        return new BST(
          value,
          this.scene,
          startX > 0 ? startX : this.x - 100,
          startY > 0 ? startY : this.y + 100
        );
      else
        return new BST(
          value,
          this.scene,
          startX > 0 ? startX : this.x + 100,
          startY > 0 ? startY : this.y + 100
        );
    }

    depth++;

    if (value < tree.value) {
      tree.left = this.insert(
        value,
        tree.left,
        tree.x - Math.floor(150 / (depth || 1)),
        tree.y + 100,
        depth
      );
    } else {
      tree.right = this.insert(
        value,
        tree.right,
        tree.x + Math.floor(150 / (depth || 1)),
        tree.y + 100,
        depth
      );
    }

    return tree;
  }
  maxDepth(tree: BST | null): number {
    if (!tree) {
      return 0;
    }

    return Math.max(this.maxDepth(tree.left), this.maxDepth(tree.right)) + 1;
  }
  preOrderTraversal() {}
  postOrderTraversal() {}
  highlightNode(node: BST) {
    node.circle.setFillStyle(0x00ff00);
  }

  unhighlightNode(node: BST) {
    node.circle.setFillStyle(0xff0000);
  }
  async inOrderTraversal(
    root: BST | null,
    maxDepth: number,
    currentDepth: number
  ) {
    if (!root) return;

    this.highlightNode(root);
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.unhighlightNode(root);

    await this.inOrderTraversal(root.left, maxDepth, currentDepth + 1);

    this.highlightNode(root);
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.unhighlightNode(root);

    await this.inOrderTraversal(root.right, maxDepth, currentDepth + 1);
    this.highlightNode(root);
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.unhighlightNode(root);
  }

  contains(value: number) {
    // Write your code here.
    return false;
  }

  remove(value: number): BST {
    // Write your code here.
    // Do not edit the return statement of this method.
    return this;
  }
}

/**
 * FirstGameScene is an example Phaser Scene
 * @class
 * @constructor
 * @public
 */
export class FirstGameScene extends Phaser.Scene {
  constructor() {
    super("FirstGameScene");
    console.log("FirstGameScene.constructor()");
  }

  preload() {
    console.log("FirstGameScene.preload");
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    // Create the initial tree using the BST class
    const tree = new BST(50, this, 300, 100);
    tree.insert(20, tree);
    tree.insert(10, tree);
    tree.insert(30, tree);
    tree.insert(40, tree);
    tree.insert(55, tree);
    tree.insert(70, tree);
    tree.insert(54, tree);
    tree.insert(53, tree);
    tree.insert(35, tree);
    tree.insert(60, tree);
    tree.insert(80, tree);

    const maxDepth = tree.maxDepth(tree);
    tree.inOrderTraversal(tree, maxDepth, 0);
    // Create the graphical representation of the tree

    // this.createGraphicsForTree(tree, 0, 25, 300, 300);
  }

  createGraphicsForTree(
    node: BST | null,
    depth: number,
    nodeDistance: number,
    startX: number,
    startY: number
  ): void {
    if (!node) {
      return;
    }

    this.add.circle(startX, startY, 20, 0xff0000);
    this.add.text(startX, startY, node.value.toString());

    depth++;

    this.createGraphicsForTree(
      node.left,
      depth,
      nodeDistance,
      startX - 50,
      startY + 50
    );
    this.createGraphicsForTree(
      node.right,
      depth + 1,
      nodeDistance,
      startX + 50,
      startY + 50
    );
  }

  // updateGraphicsForTree(tree: BST, graphics: any) {
  //   // Clear existing graphics
  //   graphics.clear();

  //   // Recursively draw nodes for the tree
  //   function drawNode(node: BST, x: number, y: number) {
  //     if (!node) return;

  //     // Draw a circle for the node
  //     graphics.fillCircle(x, y, nodeRadius);

  //     // Draw lines to children nodes
  //     if (node.left) {
  //       graphics.lineStyle(lineThickness, lineColor);
  //       graphics.moveTo(x, y);
  //       graphics.lineTo(x - nodeDistance, y + nodeDistance);
  //       drawNode(node.left, x - nodeDistance, y + nodeDistance);
  //     }
  //     if (node.right) {
  //       graphics.lineStyle(lineThickness, lineColor);
  //       graphics.moveTo(x, y);
  //       graphics.lineTo(x + nodeDistance, y + nodeDistance);
  //       drawNode(node.right, x + nodeDistance, y + nodeDistance);
  //     }
  //   }

  //   drawNode(tree, treeX, treeY);
  // }
  highlightNode(
    tree: BST | null,
    value: number,
    graphics: Phaser.GameObjects.Graphics
  ) {
    if (!tree) {
      return;
    }

    if (tree.value === value) {
      graphics.fillStyle(0xff0000, 1);
    } else {
      graphics.fillStyle(0x000000, 1);
    }

    graphics.fillCircle(tree.x, tree.y, 10);
    // graphics.fillText(tree.value.toString(), tree.x, tree.y);

    this.highlightNode(tree.left, value, graphics);
    this.highlightNode(tree.right, value, graphics);
  }
  update() {}
}
