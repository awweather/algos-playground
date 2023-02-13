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
  async preOrderTraversal(
    root: BST | null,
    maxDepth: number,
    currentDepth: number,
    array: number[]
  ) {
    if (!root) return array;

    array.push(root.value);
    this.highlightNode(root);
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.unhighlightNode(root);

    await this.preOrderTraversal(root.left, maxDepth, currentDepth + 1, array);

    this.highlightNode(root);
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.unhighlightNode(root);

    await this.preOrderTraversal(root.right, maxDepth, currentDepth + 1, array);
    this.highlightNode(root);
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.unhighlightNode(root);

    return array;
  }
  async postOrderTraversal(
    root: BST | null,
    maxDepth: number,
    currentDepth: number,
    array: number[]
  ) {
    if (!root) return array;

    if (currentDepth !== 0) {
      this.highlightNode(root);
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.unhighlightNode(root);
    }

    await this.postOrderTraversal(root.left, maxDepth, currentDepth + 1, array);

    if (currentDepth !== 0) {
      this.highlightNode(root);
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.unhighlightNode(root);
    }

    await this.postOrderTraversal(
      root.right,
      maxDepth,
      currentDepth + 1,
      array
    );
    this.highlightNode(root);
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.unhighlightNode(root);

    array.push(root.value);
    return array;
  }
  highlightNode(node: BST) {
    node.circle.setFillStyle(0x00ff00);
  }

  unhighlightNode(node: BST) {
    node.circle.setFillStyle(0xff0000);
  }
  async inOrderTraversal(
    root: BST | null,
    maxDepth: number,
    currentDepth: number,
    array: number[]
  ): Promise<number[]> {
    if (!root) return array;

    if (currentDepth !== 0) {
      this.highlightNode(root);
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.unhighlightNode(root);
    }

    await this.inOrderTraversal(root.left, maxDepth, currentDepth + 1, array);

    this.highlightNode(root);
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.unhighlightNode(root);

    array.push(root.value);
    await this.inOrderTraversal(root.right, maxDepth, currentDepth + 1, array);
    if (currentDepth !== 0) {
      this.highlightNode(root);
      await new Promise((resolve) => setTimeout(resolve, 500));
      this.unhighlightNode(root);
    }

    return array;
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

  async create() {
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
    // const result = await tree.inOrderTraversal(tree, maxDepth, 0, []);

    // const result = await tree.postOrderTraversal(tree, maxDepth, 0, []);

    const result = await tree.preOrderTraversal(tree, maxDepth, 0, []);
    console.log(result);

    // Create the graphical representation of the tree

    // this.createGraphicsForTree(tree, 0, 25, 300, 300);
  }

  update() {}
}
