import Phaser from "phaser";

const speed = 500;

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

    this.circle.setInteractive().on("pointerup", () => {
      this.remove(this.value, this);
    });

    scene.add.text(this.x, this.y, this.value.toString());
  }

  async insert(
    value: number,
    tree: BST | null,
    startX: number = -1,
    startY: number = -1,
    depth: number = 0
  ): Promise<BST> {
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
      this.highlightNode(tree);
      await new Promise((resolve) => setTimeout(resolve, speed));
      this.unhighlightNode(tree);
      tree.left = await this.insert(
        value,
        tree.left,
        tree.x - Math.floor(150 / (depth || 1)),
        tree.y + 100,
        depth
      );
    } else {
      this.highlightNode(tree);
      await new Promise((resolve) => setTimeout(resolve, speed));
      this.unhighlightNode(tree);
      tree.right = await this.insert(
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
    await new Promise((resolve) => setTimeout(resolve, speed));
    this.unhighlightNode(root);

    await this.preOrderTraversal(root.left, maxDepth, currentDepth + 1, array);

    this.highlightNode(root);
    await new Promise((resolve) => setTimeout(resolve, speed));
    this.unhighlightNode(root);

    await this.preOrderTraversal(root.right, maxDepth, currentDepth + 1, array);
    this.highlightNode(root);
    await new Promise((resolve) => setTimeout(resolve, speed));
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
      await new Promise((resolve) => setTimeout(resolve, speed));
      this.unhighlightNode(root);
    }

    await this.postOrderTraversal(root.left, maxDepth, currentDepth + 1, array);

    if (currentDepth !== 0) {
      this.highlightNode(root);
      await new Promise((resolve) => setTimeout(resolve, speed));
      this.unhighlightNode(root);
    }

    await this.postOrderTraversal(
      root.right,
      maxDepth,
      currentDepth + 1,
      array
    );
    this.highlightNode(root);
    await new Promise((resolve) => setTimeout(resolve, speed));
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

    await this.inOrderTraversal(root.left, maxDepth, currentDepth + 1, array);

    this.highlightNode(root);
    await new Promise((resolve) => setTimeout(resolve, speed));
    this.unhighlightNode(root);

    array.push(root.value);
    await this.inOrderTraversal(root.right, maxDepth, currentDepth + 1, array);
    if (currentDepth !== 0) {
      this.highlightNode(root);
      await new Promise((resolve) => setTimeout(resolve, speed));
      this.unhighlightNode(root);
    }

    return array;
  }

  contains(value: number) {
    // Write your code here.
    return false;
  }

  remove(value: number, tree: BST | null): BST | null {
    // Write your code here.
    // Do not edit the return statement of this method.
    if (!tree) return tree;

    if (value < tree.value) {
      tree.left = this.remove(value, tree.left);
    } else if (value > tree.value) {
      tree.right = this.remove(value, tree.right);
    } else {
      // has no children, delete
      if (!tree.left && !tree.right) {
        return null;
      }

      if (tree.left && !tree.right) {
        tree.value = tree.left.value;
        tree.right = tree.left.right;
        tree.left = tree.left.left;
        return tree;
      }

      if (!tree.left && tree.right) {
        tree.value = tree.right.value;
        tree.left = tree.right.left;
        tree.right = tree.right.right;
        return tree;
      }

      if (tree.left && tree.right) {
        function smallestValue(tree: BST): number {
          return !tree.left ? tree.value : smallestValue(tree);
        }

        const smallest = smallestValue(tree.right);
        tree.value = smallest;
        tree.right = this.remove(smallest, tree.right);
        return tree;
      }
    }

    return this;
  }
}

export class Main extends Phaser.Scene {
  constructor() {
    super("MainScene");
  }

  async create() {
    // Create the initial tree using the BST class
    const tree = new BST(50, this, 300, 100);
    await tree.insert(20, tree);
    await tree.insert(10, tree);
    await tree.insert(30, tree);
    await tree.insert(40, tree);
    await tree.insert(55, tree);
    await tree.insert(70, tree);
    await tree.insert(54, tree);
    await tree.insert(53, tree);
    await tree.insert(35, tree);
    await tree.insert(60, tree);
    await tree.insert(80, tree);

    this.add
      .text(25, 25, "Insert Random")
      .setInteractive()
      .on("pointerup", () => {
        const number = Phaser.Math.Between(1, 100);
        tree.insert(number, tree);
      });
    this.add
      .text(225, 25, "Inorder Traversal")
      .setInteractive()
      .on("pointerup", async () => {
        const maxDepth = tree.maxDepth(tree);
        const result = await tree.inOrderTraversal(tree, maxDepth, 0, []);
        console.log(result);
      });
    this.add
      .text(425, 25, "Preorder Traversal")
      .setInteractive()
      .on("pointerup", async () => {
        const maxDepth = tree.maxDepth(tree);
        const result = await tree.preOrderTraversal(tree, maxDepth, 0, []);
        console.log(result);
      });

    this.add
      .text(625, 25, "Postorder Traversal")
      .setInteractive()
      .on("pointerup", async () => {
        const maxDepth = tree.maxDepth(tree);
        const result = await tree.postOrderTraversal(tree, maxDepth, 0, []);
        console.log(result);
      });
  }

  update() {}
}
