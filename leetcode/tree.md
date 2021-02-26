> 未按做题顺序整理

## 一、四种遍历

### [前序遍历](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/)

迭代法，模拟递归，使用顺序栈：根，左，右

①根节点入栈

②栈不为空，取出栈顶结点，该节点的右子树，左子树入栈，注意此处顺序

```javascript
/**
 * 递归版
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    const res = []
    const preorder = (root) => {
        if(!root) return
        res.push(root.val)
        root.left && preorder(root.left)
        root.right && preorder(root.right)
    }
    preorder(root)
    return res
};

/**
 * 递归版简化
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    return root ? [root.val].concat(preorderTraversal(root.left), preorderTraversal(root.right)) : []
};

/**
 * 迭代版
 * @param {TreeNode} root
 * @return {number[]}
 */
var preorderTraversal = function(root) {
    if(!root) return []
    const res = []
    const stack = [root]
    while(stack.length) {
        const node = stack.pop()
        res.push(node.val)
        node.right && stack.push(node.right)
        node.left && stack.push(node.left)
    }
    return res
};
```

### [中序遍历](https://leetcode-cn.com/problems/binary-tree-inorder-traversal/)

①左子树入栈，最左侧最晚

②返回上层时，当前结点出栈，如有右节点，则需重复①操作

```javascript
/**
 * 迭代版
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function(root) {
    if(!root) return []
    const res = []
    const stack = []
    let curr = root
    while(stack.length || curr) {
        while(curr) {
            stack.push(curr)
            curr = curr.left
        }
        const node = stack.pop()
        res.push(node.val)
        if(node.right) {
            curr = node.right
        }
    }
    return res
};
```

### [后序遍历](https://leetcode-cn.com/problems/binary-tree-postorder-traversal/submissions/)

1. 栈+数组（一个处理，一个存结果）

   ①栈存入根节点

   ②栈不为空时，栈顶元素出栈，从头部移入数组，同时左子树，右子树依次入栈，注意此处顺序

   ③将数组元素依次输出

```javascript
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var postorderTraversal = function(root) {
    if(!root) return []
    const res = []
    const stack = [root]
    while(stack.length) {
        const node = stack.pop()
        res.unshift(node.val)
        node.left && stack.push(node.left)
        node.right && stack.push(node.right)
    }
    return res
};
```

[相关题解](https://leetcode-cn.com/problems/binary-tree-preorder-traversal/solution/leetcodesuan-fa-xiu-lian-dong-hua-yan-shi-xbian-2/)

### [层序遍历](https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-lcof/)

使用队列

① 将根节点先放入队列

② 队列非空，取出队首元素，并将其左右子树放入队列

```javascript
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var levelOrder = function(root) {
    if(!root) return []
    const res = []
    const q = [root]
    while(q.length) {
        const current = q.shift()
        res.push(current.val)
        current.left && q.push(current.left)
        current.right && q.push(current.right)
    }
    return res
};
```



##  二、从上到下打印系列

题：已知形如`[3,9,20,null,null,15,7]`二叉树，表示层次结构

### 要求1：[层序遍历](https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-lcof/)

返回结果： `[3,9,20,15,7]`

层序遍历 => 使用队列

时间复杂度，空间复杂度均为 O(n)

① 将根节点先放入队列

② 队列非空，取出队首元素，并将其左右子树放入队列

```javascript
/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var levelOrder = function(root) {
    if(!root) return []
    const res = []
    const q = [root]
    while(q.length) {
        const current = q.shift()
        res.push(current.val)
        current.left && q.push(current.left)
        current.right && q.push(current.right)
    }
    return res
};
```

### 要求2：[层次遍历](https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-ii-lcof/)

返回结果：

```
[
  [3],
  [9,20],
  [15,7]
]
```

和前一题相比，需要单层单独一数组

在原有循环基础上，开始当次循环时，先存此时的队列长度，该长度即对应当前层级的节点数量

时间复杂度，空间复杂度均为 O(n)

```javascript
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if(!root) return []
    const queue = [root]
    const res = []
    let index = 0
    while(queue.length) {
        res[index] = []
        let len = queue.length
        while(len --) {
            const current = queue.shift()
            res[index].push(current.val)
            current.left && queue.push(current.left)
            current.right && queue.push(current.right)
        }
        index ++
    }
    return res
};
```

### 要求3：[交替方向层次遍历](https://leetcode-cn.com/problems/cong-shang-dao-xia-da-yin-er-cha-shu-iii-lcof/)

返回结果：

```
[
  [3],
  [20,9],
  [15,7]
]
```

在前一题的基础上，加入对层级奇偶性的判断，决定是否翻转数组

时间复杂度，空间复杂度均为 O(n)

```javascript
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    if(!root) return []
    const queue = [root]
    const res = []
    let index = 0
    while(queue.length) {
        res[index] = []
        let len = queue.length
        while(len --) {
            const current = queue.shift()
            res[index].push(current.val)
            current.left && queue.push(current.left)
            current.right && queue.push(current.right)
        }
        if(index % 2) res[index] = res[index].reverse()
        index ++
    }
    return res
};
```



## 三、第k大(小)的元素

### [二叉搜索树的第k大节点](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-di-kda-jie-dian-lcof/)

利用二叉搜索树特性，套用中序遍历解法，改变顺序为 右，中，左，第k位即为结果

```javascript
/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthLargest = function(root, k) {
    const stack = []
    let curr = root
    let num = 0
    while(stack.length || curr) {
        while(curr) {
            stack.push(curr)
            curr = curr.right
        }
        const node = stack.pop()
        num ++
        if(num === k) return node.val
        if(node.left) {
            curr = node.left
    }
};

```

### [二叉搜索树中第K小的元素](https://leetcode-cn.com/problems/kth-smallest-element-in-a-bst/)

> 牛客中，返回整个节点
>
> 力扣中，返回节点值

利用二叉搜索树特性，中序遍历序列的第k位即第k小元素

```javascript
/**
 * 相比上种，缩减部分变量
 * @param {TreeNode} root
 * @param {number} k
 * @return {number}
 */
var kthSmallest = function(root, k) {
    const stack = []
    while (true) {
        while (root) {
            stack.push(root)
            root = root.left
        }
        root = stack.pop()
        k--
        if (k === 0) return root.val
        root = root.right
    }
};
```



## 四、二叉树的下一个结点

**题目**

给定一个二叉树和其中的一个结点，请找出中序遍历顺序的下一个结点并且返回。注意，树中的结点不仅包含左右子结点，同时包含指向父结点的指针。

**思路**

一开始没 get 到意思，关键函数只有一个参数 `pNode` 传入，数据结构如下所示：

```
/*function TreeLinkNode(x){
    this.val = x;
    this.left = null;
    this.right = null;
    this.next = null;
}*/
```

<u>结合原书描述和官方题解表述的意思，此处的 `next` 指向父节点，非下一节点指向</u>

* 暴力

  > 时间复杂度 O(n) ，空间复杂度 O(n)
  >
  > 分析废物必备写法

  * 得出此时的中序遍历序列
  * 取传入节点的后一位

* 分类处理

  > 分类容易分漏
  >
  > 相比暴力，降低了空间复杂度到 O(1)

  [官方题解](https://blog.nowcoder.net/n/737a842c39d6473db2a10d4f1de7610c)中的分类方式为看图分析找不同，再归类

  私以为，此种办法小白比较容易遗漏，接着卡住，听取蛙声一片

  **万能分类讨论法**（梦回高中数学题）：

  > 咱从规则出发分类
  >
  > 分到头了再对上图里的点验证一下有没有遗漏
  >
  > 结果相似的看看是不是分类分繁了，可整理为：

  1. 中序遍历 => 左 中 右 => 从当前结点看，其属于中，故只讨论右子树的情况

  2. 有右子树

     > 中序遍历 => 左 中 右
     >
     > 最先想到有左子树的情况，下一个为右子树的最左节点（**中**（<u>左</u>中右））
     >
     > 没左子树的话，根据遍历规则，下一个为右子树的根节点 （**中**（- <u>中</u>右））

     1. 右子树有左子树 => 结果：右子树最左节点（A, B, C, D）
     2. 右子树无左子树 => 结果：右子树自身节点（E, F, G）

  3. 无右子树

     > 中序遍历 => 左 中 右
     >
     > 此时这部分小范围已经结束遍历了，结合遍历规则可得
     >
     > 接下来得根据它相对其父节点的位置再分析，即：
     >
     > ​	如为父的左子树，下一个就是父节点（**中** -）<u>中</u>
     >
     > ​	如为父的右子树，下一个就是第一个有未访问过右子树的父节点（（**中** -）...） <u>中</u>
     >
     > **注意此块得循环判断，即某部分可能是某层的右子树，再上一层可能是左子树**

     	1. 当前结点为其父节点的左子树 => 结果：父节点 （I, L, N）

       2. 当前结点为其父节点的右子树 => 结果：第一个有未访问过右子树的父节点（H, J, K, M）

  ![img](https://uploadfiles.nowcoder.com/files/20171225/773262_1514198075109_20151104234034251)

  4. 最末尾元素 => 结果：`null`

  （示例图片源自牛客该题中的评论区）

  综上所述，总共为 5 种，分别为 ....

```javascript
// 暴力
function GetNext(pNode)
{
  if(!pNode) return null;
  const stack = [];
  const res = [];
  let curr = pNode;
  // 取到根节点
  while(curr.next) {
    curr = curr.next;
  }
  // 中序遍历
  while(stack.length || curr) {
    while(curr) {
      stack.push(curr);
      curr = curr.left;
    }
    const node = stack.pop();
    // 题目中未声明数据不重复，故存整个节点
    res.push(node);
    if(node.right) {
      curr = node.right;
    }
  }
  // 遍历找下一值
  return res[res.indexOf(pNode) + 1];
}
```

```javascript
// 分类 - 简化写法，两类再合并
function GetNext(pNode)
{
  if(!pNode) return null;
  if(pNode.right){
    // 1. 有右子树, 右子树有/无左子树
    // 结果：右子树最左节点（无左子树时，自身即为最左）
    pNode = pNode.right;
    while(pNode.left){
      pNode = pNode.left;
    }
    return pNode;
  }
  while(pNode.next){
    // 2. 无右子树，当前结点为其父节点的右/左子树
    // 结果：找第一个“当前节点”为左子树的父节点
    let pRoot = pNode.next;
    if(pNode === pRoot.left){
      return pRoot;
    }
    pNode = pNode.next;
  }
  // 3. 中序遍历最末节点
  return null;
}
```



## 五、路径总和

### 题1：[判断是否存在](https://leetcode-cn.com/problems/path-sum/)

> 判断该树中是否存在根节点到叶子节点的路径

限定条件，从根到叶子节点

非递归写法，可依靠队列或栈，遍历树

[题解](https://leetcode-cn.com/problems/path-sum/solution/lu-jing-zong-he-de-si-chong-jie-fa-dfs-hui-su-bfs-/)

```javascript
/**
 * 递归版 
 * @param {TreeNode} root
 * @param {number} sum
 * @return {boolean}
 */
var hasPathSum = function(root, sum) {
    if(!root) return false
    if(!root.left && !root.right) return sum === root.val
    return hasPathSum(root.left, sum - root.val) || hasPathSum(root.right, sum - root.val)
};
```

### 题2：[找到所有路径](https://leetcode-cn.com/problems/path-sum-ii/)

JavaScript 中传入数组做参数，函数内拿到的是数组的引用，不是深拷贝。

在遍历的过程中，动态地维护了当前路径与总和的信息。

[题解](https://leetcode-cn.com/problems/path-sum-ii/solution/shuang-jie-fa-hui-su-fa-fei-di-gui-xie-fa-javascri/)

```javascript
/**
 * 递归版
 * @param {TreeNode} root
 * @param {number} sum
 * @return {number[][]}
 */
var pathSum = function(root, sum) {
    if(!root) return []
    const res = []
    getPath(root, sum, res, [])
    return res
};

const getPath = (node, sum, res, path) => {
    if(!node) return
    path = [...path, node.val]
    if(!node.left && !node.right && sum === node.val) {
        res.push(path)
        return 
    }
    node.left && getPath(node.left, sum - node.val, res, path)
    node.right && getPath(node.right, sum - node.val, res, path) 
}

/**
 * 非递归：前序 + 栈
 * @param {TreeNode} root
 * @param {number} sum
 * @return {number[][]}
 */
var pathSum = function(root, sum) {
    if(!root) return []
    const stack = [[root, sum, [root.val]]]
    const res = []
    while(stack.length) {
        const [curr, val, path] = stack.pop()
        if(!curr.left && !curr.right && val === curr.val) {
            res.push(path)
        }
        curr.left && stack.push([curr.left, val - curr.val, [...path, curr.left.val]])
        curr.right && stack.push([curr.right, val - curr.val, [...path, curr.right.val]])
    }
    return res
};
```



## 六、树的深度

### [二叉树](https://leetcode-cn.com/problems/er-cha-shu-de-shen-du-lcof/)

非递归写法，类似层序遍历（队列），层的数量即树的深度

```javascript
/**
 * 递归版
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    if(!root) return 0
    const left = maxDepth(root.left)
    const right = maxDepth(root.right)
    return left > right ? left + 1: right + 1
};

/**
 * 递归版——一行写法
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    return root ? Math.max(maxDepth(root.left), maxDepth(root.right)) + 1 : 0
};

/**
 * 非递归写法
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    if(!root) return 0
    const queue = [root]
    let level = 0
    while(queue.length) {
        level ++
        let len = queue.length
        while(len --) {
            const node = queue.shift()
            node.left && queue.push(node.left)
            node.right && queue.push(node.right)
        }
    }
    return level
};
```

### [平衡二叉树](https://leetcode-cn.com/problems/ping-heng-er-cha-shu-lcof/)

```javascript
/**
 * 自顶而下递归的核心子问题：
 * 1. 计算当前节点左右子树的高度？判断每个节点的左子树和右子树的高度差不超过1
 * 2. 如果超过1，则返回false
 * 3. 如果小于等于1，返回左右子树是不是平衡的
 * 递归的终止条件是节点为null返回true
 */
var isBalanced = function(root) {
  if (!root) return true
  const leftHeight = getTreeHeight(root.left)
  const rightHeight = getTreeHeight(root.right)
  if (Math.abs(leftHeight - rightHeight) > 1 ) {
    return false
  }
  return isBalanced(root.left) && isBalanced(root.right)
};

const getTreeHeight = (root) => {
  if (!root) return 0
  return Math.max(getTreeHeight(root.left), getTreeHeight(root.right)) + 1
}
```



## 七、树的子结构

从根节点判断B不是A的子结构，还要继续判断B是不是A左子树的子结构和右子树的子结构

 [题解](https://leetcode-cn.com/problems/shu-de-zi-jie-gou-lcof/solution/di-gui-fang-shi-jie-jue-by-sdwwld/)

```javascript
/**
 * 递归版
 * @param {TreeNode} A
 * @param {TreeNode} B
 * @return {boolean}
 */
var isSubStructure = function(A, B) {
    if(!A || !B) return false
    const isSub = (parent, child) => {
        if(!child) return true
        if(!parent || parent.val !== child.val) return false
        return isSub(parent.left, child.left) && isSub(parent.right, child.right)
    }
    return isSub(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B)
};
```

## 八、序列化/反序列化

### 题1：[二叉搜索树](https://leetcode-cn.com/problems/serialize-and-deserialize-bst/)

依据二叉搜索树的特性，可在序列化时做前序遍历，反序列化时将前序遍历结果排序，即可得到中序遍历结果

题目即可转变为知前序，中序遍历结果，构建二叉树

```javascript
/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function(root) {
    if(!root) return ''
    const res = []
    const preorder = (node) => {
        res.push(node.val)
        node.left && preorder(node.left)
        node.right && preorder(node.right)
    }
    preorder(root)
    return res.join(' ')
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
    if(!data) return null
    const preorder = data.split(' ').map(item => parseInt(item))
    const inorder = [...preorder].sort((a, b)=> a - b)
    const build = (start, end) => {
        if(start > end || !preorder.length) return null
        const root = new TreeNode(preorder.shift())
        let mid = start
        for(;mid <= end;mid ++) {
            if(inorder[mid] === root.val) break
        }
        root.left = build(start, mid - 1)
        root.right = build(mid + 1, end)
        return root
    }
    return build(0, inorder.length)
};
```

### 题2：[二叉树](https://leetcode-cn.com/problems/serialize-and-deserialize-binary-tree/)

序列化：层序遍历，如为空，则用特殊符号占位

反序列化：利用队列，自顶向下构建

[题解](https://leetcode-cn.com/problems/xu-lie-hua-er-cha-shu-lcof/solution/ceng-xu-bian-li-si-lu-jiang-jie-javascriptshi-xian/)

```javascript
// 层序 + 队列

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function(root) {
    if (!root) return ''
    let res = ''
    let node = root
    const queue = [node]
    while (queue.length) {
        const curr = queue.shift()
        if (curr) {
            res += `${curr.val},`
            queue.push(curr.left)
            queue.push(curr.right)
        } else {
            res += "#,"
        }
    }
    return res.substr(0, res.length - 1)
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
    if (data.length <= 2)  return null
    const nodes = data.split(",")
    const root = new TreeNode(parseInt(nodes.shift()))
    const queue = [root]
    while (queue.length) {
        const node = queue.shift()
        const leftVal = nodes.shift()
        if (leftVal !== "#") {
            node.left = new TreeNode(leftVal)
            queue.push(node.left)
        }
        const rightVal = nodes.shift()
        if (rightVal !== "#") {
            node.right = new TreeNode(rightVal)
            queue.push(node.right)
        }
    }
    return root
};
```

```javascript
// 骚操作

/**
 * Encodes a tree to a single string.
 *
 * @param {TreeNode} root
 * @return {string}
 */
var serialize = function(root) {
    return JSON.stringify(root)
};

/**
 * Decodes your encoded data to tree.
 *
 * @param {string} data
 * @return {TreeNode}
 */
var deserialize = function(data) {
    return JSON.parse(data)
};
```



## 九、最近公共祖先

### 题1：[二叉搜索树](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-zui-jin-gong-gong-zu-xian-lcof/)

> 主要结合二叉搜索树的特性

1. 两次遍历：时间/空间复杂度 O(n)

   ①从根节点遍历，找到 p 并记录经过的节点

   ②从根节点遍历，找到 q 并记录经过的节点

   ③取两次路径的最后一相同节点

2. 一次遍历(两次遍历优化版)：时间复杂度 O(n)，空间复杂度 O(1)

   从根节点遍历，

   ①比 p , q 都大，移向左子树

   ②比 p , q 都小，移向右子树

   ③否则，当前节点即为分叉点

```javascript
/**
 * 递归版
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    if(root.val > p.val && root.val > q.val) {
        return lowestCommonAncestor(root.left, p, q)
    }
    if(root.val < p.val && root.val < q.val) {
        return lowestCommonAncestor(root.right, p, q)
    }
    return root
};

/**
 * 迭代版
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    while(root) {
        if(root.val > p.val && root.val > q.val) {
            root = root.left
        }else if(root.val < p.val && root.val < q.val) {
            root = root.right
        }else {
            break
        }
    }
    return root
};
```

### 题2：[二叉树](https://leetcode-cn.com/problems/lowest-common-ancestor-of-a-binary-tree/)

两种情况，p，q分别在左右子树，或 p，q在相同子树中

1. 递归

   ①递归边界：为空时返回空，为 p 或 q 时，直接返回本身

   ② 如左右均有值，则p，q分别在左右子树，当前结点即最近公共祖先

   ③ 如一边有值，则返回有值的一边

```javascript
/**
 * 递归版
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    if(!root || root === p || root === q) return root
    const left = lowestCommonAncestor(root.left, p, q)
    const right = lowestCommonAncestor(root.right, p, q)
    if(left && right) return root
    return left ? left: right
};
```



## 十、转换为二叉搜索树

### 题1：[有序数组转换...](https://leetcode-cn.com/problems/convert-sorted-array-to-binary-search-tree/)

> 将一个按照升序排列的有序数组，转换为一棵高度平衡二叉搜索树

1. 每次取中间元素作为 root，即可保证高度平衡
2. 左，右两部分，继续递归

```javascript
/**
 * 递归
 * @param {number[]} nums
 * @return {TreeNode}
 */
var sortedArrayToBST = function(nums) {
    const build = (nums, start, end) => {
        if(start > end) return null
        const mid = Math.floor((end + start)/2)
        const root = new TreeNode(nums[mid])
        root.left = build(nums, start, mid - 1)
        root.right = build(nums, mid + 1, end)
        return root
    }
    return build(nums, 0, nums.length - 1)
};
```

### 题2：[有序链表转换...](https://leetcode-cn.com/problems/convert-sorted-list-to-binary-search-tree/)

> 给定一个单链表，其中的元素按升序排序，将其转换为高度平衡的二叉搜索树。

法一：思路同题1，找中间元素，再递归

其中找中间元素，可通过①链表转数组，②快慢指针的方式定位

法二：将输入看为中序遍历序列

先得到链表总长，依据中序遍历的特性，构造二叉树

[题解](https://leetcode-cn.com/problems/convert-sorted-list-to-binary-search-tree/solution/shou-hua-tu-jie-san-chong-jie-fa-jie-zhu-shu-zu-ku/)

```javascript
/**
 * 链表转数组
 * @param {ListNode} head
 * @return {TreeNode}
 */
var sortedListToBST = function(head) {
    const value = []
    while(head) {
        value.push(head.val)
        head = head.next
    }
    const build = (start, end) => {
        if(start > end) return null
        const mid = Math.floor((start + end)/2)
        const root = new TreeNode(value[mid])
        root.left = build(start, mid - 1)
        root.right = build(mid + 1, end)
        return root
    }
    return build(0, value.length - 1)
};

/**
 * 快慢指针
 * @param {ListNode} head
 * @return {TreeNode}
 */
var sortedListToBST = function(head) {
    if(head === null) return null
    let slow = head
    let fast = head
    let prevSlow
    while(fast && fast.next) {
        prevSlow = slow
        slow = slow.next
        fast = fast.next.next
    }
    const root = new TreeNode(slow.val)
    if(prevSlow) {
        prevSlow.next = null
        root.left = sortedListToBST(head) // 一定在判断内
    }
    root.right = sortedListToBST(slow.next)
    return root
};


```



## 十一、知两种遍历序列构造二叉树

### [前序+中序](https://leetcode-cn.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)

root：前序遍历序列的首位，做移出处理（后续可不再传开头，结尾的位置信息）

mIndex: 中序遍历序列中 root 的位置

```javascript
/**
 * @param {number[]} preorder
 * @param {number[]} inorder
 * @return {TreeNode}
 */
var buildTree = function(preorder, inorder) {
    const build = (start, end) => {
        if(start > end || !preorder.length) return null
        const root = new TreeNode(preorder.shift())
        let index = start
        for(;index <= end;index ++) {
            if(inorder[index] === root.val) break
        }
        root.left = build(start, index - 1)
        root.right = build(index + 1, end)
        return root
    }
    return build(0, inorder.length)
};
```

### [中序+后序](https://leetcode-cn.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)

root：后序遍历序列的末位

mIndex: 中序遍历序列中 root 的位置

整体思路同上

```javascript
/**
 * @param {number[]} inorder
 * @param {number[]} postorder
 * @return {TreeNode}
 */
var buildTree = function(inorder, postorder) {
    const build = (start, end) => {
        if(start > end || !postorder.length) return null
        const root = new TreeNode(postorder.pop())
        let index = start
        for(;index < end;index ++) {
            if(inorder[index] === root.val) break
        }
        // 注意此时的递归顺序，因为后序为 左，右，中
        root.right = build(index + 1, end)
        root.left = build(start, index - 1)
        return root
    }
    return build(0, inorder.length - 1)
};
```



## 十二、验证二叉搜索树的遍历序列

### 题1：[二叉搜索树的后序遍历序列](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-hou-xu-bian-li-xu-lie-lcof/)

**递归**

利用后序遍历特性，最后一位即为根

利用二叉搜索树特性，区分左右子树

写的时候出现的误区：第一位不一定为最小值，即左子树中最左节点，不一定为完整二叉树

**单调栈**

[参考失火的夏天](https://leetcode-cn.com/problems/er-cha-sou-suo-shu-de-hou-xu-bian-li-xu-lie-lcof/comments/241924)   tql

利用后序遍历特性，逆向遍历，root，right，left

利用二叉搜索树特性，存矮去高

使得在处理节点时，保存的值恒为某部分的根节点值（从右到左移动）

因此当遍历到值大于当前保存的根节点值时，表示未满足二叉搜索树特性

```javascript
/**
 * 递归
 * @param {number[]} postorder
 * @return {boolean}
 */
var verifyPostorder = function(postorder) {
    const len = postorder.length;
    if(!len) return true; // 牛客网中此情况用例预期结果为 false
    let index = -1; // 右子树的开始位置
    for(let i = 0;i < len;i ++) {
        if(postorder[i] >= postorder[len -1] && index === -1) {
            index = i;
        } else if (index !== -1 && postorder[i] < postorder[len - 1]) {
            return false;
        }
    }
    return verifyPostorder(postorder.slice(0, index)) && verifyPostorder(postorder.slice(index, len - 1));
};
```

```javascript
/**
 * 单调栈
 * @param {number[]} postorder
 * @return {boolean}
 */
var verifyPostorder = function(postorder) {
    if(!postorder.length) return true; // 牛客网中此情况用例预期结果为 false
    const stack = [];
    let currRoot = Infinity;
    for(let i = postorder.length - 1;i >= 0;i --) {
        if(postorder[i] > currRoot) return false;
        while(stack.length && postorder[i] < stack[stack.length - 1]) {
            currRoot = stack.pop();
        }
        stack.push(postorder[i]);
    }
    return true;
};
```

