# 排序

<img src="../image/algorithm/排序算法对比图.png" alt="排序比较图" style="zoom:70%;" />

* 快排：每趟排序将作为枢纽的元素放到最终位置。枢纽前的所有元素均小于它，枢纽后的元素均大于它
* 堆排 / 冒泡 / 选择：每趟排序可以将最大或最小的元素放到最终位置



### 1. 简单选择排序

* 第 n 次遍历向后找最小（大）的元素
* 找到后，与第 n 个互换位置
* 每次可确定一元素的最终位置
* 时间复杂度 O(n^2)

```javascript
function selectionSort(nums) {
    for(let i = 0;i < nums.length;i ++) {
        let min = i;
        for(let j = i;j < nums.length;j ++) {
            if(nums[j] < nums[min]) {
                min = j;
            }
        }
        [nums[i], nums[min]] = [nums[min], nums[i]];
    }
    return nums;
}

let nums = [1, 6, 4, 2, 8, 7, 3];
console.log(selectionSort(nums));
```

### 2. 冒泡排序

> 这个算法让我想起了小时候在操场排队跑步，老师总是说：“高的站前面，低的站后面”。我们一开始并不一定会站到准确的位置上，接着老师又说：“你比前面的高，和前面的换换，还高，再和前面换换”，就这样找到了自己的位置。

* 比较相邻元素

* 如从小到大排列，则每轮会将最大的元素放到末尾；

  下一轮可到达末尾的位置前移一位

* 时间复杂度 O(n^2)

```javascript
function bubbleSort(nums) {
    for(let i = 0;i < nums.length - 1;i ++) {
        for(let j = 0;j < nums.length - i - 1;j ++) {
            if(nums[j] > nums[j + 1]) {
                [nums[j], nums[j + 1]] = [nums[j + 1], nums[j]];
            }
        }
    }
    return nums;
}

let nums = [5, 9, 1, 9, 5, 3, 7, 6, 1];
console.log(bubbleSort(nums));
```

### 3. 插入排序

> 减治法

* 将数据插入有序元素中
* 将前 i - 1 位视为有序段
* 第 i 位插入有序段，从后往前查找插入位置，同时将数据后移

```javascript
function insertSort(nums) {
    for(let i = 1;i < nums.length;i ++) {
        for(let j = i;j >= 0;j --) {
            if(nums[j] < nums[j - 1]) {
                [nums[j], nums[j - 1]] = [nums[j - 1], nums[j]];
            }
        }
    }
    return nums;
}

let nums = [5, 9, 1, 9, 5, 3, 7, 6, 1];
console.log(insertSort(nums));
```

### 4. 归并排序

> 合并排序，利用分治法
>
> 根据元素位置进行划分，主要工作在于合并子问题的解

* 将待排序元素一分为二
* 对子序列递归排序
* 合并两个有序序列
* 时间复杂度 O(nlogn)

### 5. 快速排序

> 利用分治法
>
> 根据元素的值进行划分，主要工作在于划分

* 每趟可确定一元素的最终位置
* 中轴选择方法：随机元素（随机快速排序）；左中右元素的中位数（三平均划分法）
* 不稳定，运行时间取决于选定的基准值
* 平均时间复杂度 O(nlogn)，最坏情况下 O(n^2)

```javascript
function qsort(nums, left, right) {
    if(left > right) return;
    // 1. 划分
    let i = left, j = right;
    const key = nums[left];
    while (i < j) {
        while (i < j && nums[j] >= key) {
            j--;
        }
        nums[i] = nums[j];
        while(i < j && nums[i] < key) {
            i ++;
        }
        nums[j] = nums[i];
    }
    nums[i] = key;
    // 3. 继续快排
    qsort(nums, left, i - 1);
    qsort(nums, i + 1, right);
}

let nums = [5, 9, 1, 9, 5, 3, 7, 6, 1];
qsort(nums, 0, nums.length - 1);
console.log(nums);
```





