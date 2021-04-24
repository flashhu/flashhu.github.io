# CSS

> 《深入解析 CSS》

[常见的CSS图形绘制合集](https://www.zhangxinxu.com/wordpress/2019/01/pure-css-shapes/)



CSS 样式来源主要有三种：

* 通过 link 引用的外部 CSS 文件
* `<style>` 标记内的 CSS
* 元素的 style 属性内嵌的 CSS



CSS 优化：

> 选择符从右向左进行匹配

* 避免使用通配符，只对需要用到的元素进行选择
* 关注可以通过继承实现的属性，避免重复匹配重复定义
* 少用标签选择器。如果可以，用类选择器替代
* 少用嵌套，降低选择器深度



## 一、层叠

### 1. 文档流

[normal flow - W3C](https://www.w3.org/TR/CSS2/visuren.html#normal-flow)

[CSS现状和如何学习](https://www.w3cplus.com/css/learning-css.html)

* 文档流，又称普通流（normal flow），指的是**网页元素的默认布局行为**
* 在对应的块格式化上下文中，块级元素按照其在HTML源码中出现的顺序，在其容器盒子里从左上角开始，从上到下垂直地依次分配空间层叠（Stack），并且独占一行，边界紧贴父盒子边缘。两相邻元素间的距离由margin属性决定，在同一个块格式化上下文中的垂直边界将被重叠（Collapse margins）。除非创建一个新的块格式化上下文，否则块级元素的宽度不受浮动元素的影响。

* 在对应的行内格式化上下文中，行内元素从容器的顶端开始，一个接一个地水平排列，当到达容器边缘时会换行。



### 2. 脱离文档流的方式

> 文档流，相对于盒子模型
>
> 文本流，相对于文本段落而言

* `float`

  脱离文档流，但没脱离文本流，会出现文字

* `position: absolute`

  脱离文档流，且脱离文本流

* `position: fixed`

  脱离文档流，且脱离文本流



### 2. BFC 与 IFC

> 格式化上下文指**初始元素定义的环境**

> 网页的根元素也创建了一顶级 BFC

#### BFC

BFC，block formatting context，**块格式化上下文**

它会将内部内容与外部上下文隔开来，不会和外部的元素重叠或相互影响

BFC 的好处为 ① 可以包含浮动元素，② 防止外边距折叠，③ 防止文档流围绕浮动元素排列

<u>新建 BFC</u>：

(浮动，绝对定位，溢出，块级容器)

* `float` 设为非 `none` 的值，如 `left`，`right`
* `overflow` 设为非 `visible` 的值，如 `hidden`，`auto`，`scroll`
* `position: absolute` 或 `position:fixed`
* 块级容器，如 `display: inline-block`, `table-cell`，`table-caption`，`flex`，`inline-flex`，`grid`，`inline-grid`

通常使用 `overflow: auto` 创建；

使用浮动或者 `inline-block` 方式创建 BFC 的元素宽度会变成 `100%`，因此需要限制一下元素的宽度，防止因为过宽而换行；`table-cell` 则反之

#### IFC

IFC，inline formatting contexts，**行内格式化上下文**

![表格图例](../image/language/css-格式化上下文.png)



### 3. 层叠 z-index

![z-index示例](../image/language/css-z-index.png)



### 4. 优先级（权重）

[优先级 — MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Specificity)

> 主要说不同选择器类型的数值，及叠加后如何处理

> 补充（从层叠的规则来看）：
>
> 从**样式表的来源**看，优先级从高到低分别为开发人员定义的样式，用户定义的样式，浏览器自带的样式
>

**是什么**

浏览器会根据优先级来判断在元素上应用哪些样式。

集中体现在一个元素上包含多个声明的时候。

**怎么做的**

> `!important` > 行内 > (内联及外联) id > class > tag

* 选择器中：

  id 选择器优先级最高，类 / 伪类 / 属性选择器其次，标签（或称元素） / 伪元素选择器最末。

  通配选择符 [`*`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Universal_selectors)，关系选择符（[`+`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Adjacent_sibling_combinator), [`>`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Child_combinator), [`~`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/General_sibling_combinator), [''](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_combinator), [`||`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Column_combinator)）及否定伪类（[`:not()`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:not)）对优先级没有影响，但是<u>否定伪类中声明的选择器会影响优先级</u>。

  内联样式和外联样式优先级相等，与加载顺序有关

* 行内样式：

  会覆盖外部样式表的样式，具有最高优先级

* `!important`：

  与优先级无关，但会覆盖其他任何形式的声明，影响结果

  当两个样式都使用 `!important` 时，则比较权重大小

  应用于简写样式时，会作用于所有子属性

* 多个选择器叠加：

  通常我们会将每个元素/伪元素选择器的权重视为1，类/伪类/属性选择器视为10，id 选择器视为100，行内样式视为 1000 。计算得整体权重后，进行比较，权重更大的一方生效。

  当权重值相同时，如指向同一元素，使用后定义的样式（重写）；如指向不同的元素，则会生效最接近目标元素的样式（直接覆盖继承）  [codepen](https://codepen.io/flashhu/pen/wvgyOLG)

**注意点**

部分伪类选择器需要注意声明顺序，如链接相关的：（LoVe/HAte）`:link`，`:visited`，`:hover`，`:active` ，顺序颠倒后，可能会不按预期生效



**在实际使用过程中**：

* 尽量压低选择器的优先级
* 尽量少使用 id 选择器
* 尽量避免使用 `!important`



### 5. 伪类 / 伪元素

[伪类 — MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-classes)

[伪元素 — MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Pseudo-elements)

伪类指定元素的状态，常见的有`:link`，`:visited`, `:hover`，`:active`，`:focus`，`:first-child`，`:nth-child()`

伪元素用于修改元素的部分特定样式，常见的有：`::after`，`::before`，`::first-letter`



### 6. 外边距折叠

[The Rules of Margin Collapse](https://www.joshwcomeau.com/css/rules-of-margin-collapse/#more-than-two-margins-can-collapse)





![权重示例](../image/language/css-样式权重.png)



## 二、继承

> 继承属性会顺序传递给后代元素，直到它被层叠值覆盖

> inherit，继承父元素的属性值；
>
> initial，重置为属性的初始值

### 1. 能被继承的属性

> 不可被继承的属性，如 display，margin，border，padding ...

* 文本相关的属性：color、font、font-family、font-size、font-weight、font-variant、font-style、line-height、letter-spacing、text-align、text-indent、text-transform、white-space以及word-spacing
* 列表属性：list-style、list-style-type、list-style-position以及list-style-image

* 表格的边框属性 border-collapse 和 border-spacing 也能被继承



## 三、单位

> px，em，rem，vw，vh，vmin，vmax，%

[长度单位 — MDN](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/Values_and_units#%E9%95%BF%E5%BA%A6)

### 1. 绝对长度单位

常用的为 `px`，一像素



### 2. 相对长度单位

> 相对于字号 / 视口

* `em`

  对于字号，是相对于父元素的字号进行计算

  对于其他属性，是相对于自身的字体大小

* `rem`

  相对于根元素（`html` 或 `:root`）的字体大小

* `vw`

  视窗宽度的 1%

* `vh`

  视窗高度的 1%

* `vmin`

  视窗较小尺寸的 1%

* `vmax`

  视窗较大尺寸的 1%



**在实际使用过程中**：

* 在 `:root`（也可为 `html`） 中使用 `em` 设置字号

  有响应式需求的话，可借助媒体查询，或设置字号为 `calc(0.5em + 1vw)`，实现相对平滑的缩放

* 在其他元素中使用 `rem` 设置字号

* 使用 `px` 设置边框

* 使用 `em` 设置除字号外的其他属性

* 有缩放单个组件的需求时，外部再包裹一层，使用 `rem` 设置字号

  组件内元素均使用 `em` 设置，即继承外部字号大小以实现缩放



### 3. 百分比

相对于父元素的值计算

如设置字号，则表示取父元素字号的百分比大小

如设置边距/宽度，则表示取父元素宽度的百分比大小

如设置宽度，则表示取父元素宽度的百分比大小

但**设置高度时，父元素的高度必须明确设置**，百分比才会生效



### 4. 角度

[<angle\>  — MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/angle)

正数表示顺时针，负数表示逆时针

* `deg`：度，一圆 360 deg
* `grad`：百分度，一圆 400 grad
* `rad`：弧度，一圆 2 rad （π）
* `turn`：圈数，一圆 1 turn



## 四、盒模型

[盒模型 - MDN](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/The_box_model)

![块级盒子的组成](https://media.prod.mdn.mozit.cloud/attachments/2019/03/19/16558/29c6fe062e42a327fb549a081bc56632/box-model.png)

**是什么**

盒模型定义了每个盒子的组成部分：内容(content)、内边距(`padding`)、 边框(`border`)、外边距(`margin`)；

### 块级盒子和内联盒子的区别

> 最常见的两种，对应块级元素和行内元素

1. 换行

   每个块级盒子都会换行；内联盒子不会产生换行

2. 默认宽高

   块级盒子默认宽度会占据父容器水平方向上可用的最大宽度（即100%），默认高度取决于内容本身；

   内联盒子默认宽高由内容本身决定

3. 设置宽高

   块级盒子可以直接设置 `width`，`height`;

   内联盒子直接设置不起作用，需要设置 `display: block` 或 `display: inline-block` 变为块级盒子后，再设置宽高

   **注意**：`inline-block` 存在**空隙**问题，这是因为当处理行内元素排版时，浏览器会处理元素间的**空白符**（如空格，回车），解决办法主要有：

   * 牺牲可读性，将它们写在一行
   * 父元素中将字号置 0，在子元素上重置字号
   * 使用浮动或绝对定位，隐式将生效的 `display` 值变为 `block`，因此还需要解决由浮动带来的高度坍塌或绝对定位后再调整位置

4. 内外边距及边框

   块级盒子设置内外边距，边框大小后，水平垂直方向都被应用，且能将其他元素按预期推开；内联元素设置这些属性后，水平垂直方向都被应用，但是只有水平方向会按预期将元素推开

5. 包含的元素

   块级元素可以包含块级元素和行内元素；

   行内元素中最好只包含行内元素，如包含块级元素，父行内元素并不会包含子块级元素

[codepen](https://codepen.io/flashhu/pen/zYNRyrJ)

**外部显示类型和内部显示类型**

盒模型的外部显示类型，决定盒子是块级还是内联

盒模型的内部显示类型，决定盒子内部元素是如何布局的

### 标准盒模型和非标准（IE）盒模型的区别

> `mragin` 影响的是盒子外部空间，不计入盒子大小

在标准盒模型中，`width`，`height` 设置的是 `content`，加上 `padding`，`border` 后，表示盒子的大小

在非标准盒模型中，`with`，`height` 设置的是可见宽高，即除 `content` 外，还包含 `padding`，`border`

**怎么设置盒子模型标准**

设置 `box-sizing`，默认使用标准模型（`box-sizing: content-box`）

| 值          | 描述                                                         |
| :---------- | :----------------------------------------------------------- |
| content-box | 这是由 CSS2.1 规定的宽度高度行为。宽度和高度分别应用到元素的内容框。在宽度和高度之外绘制元素的内边距和边框。 |
| border-box  | 为元素设定的宽度和高度决定了元素的边框盒。就是说，为元素指定的任何内边距和边框都将在已设定的宽度和高度内进行绘制。通过从已设定的宽度和高度分别减去边框和内边距才能得到内容的宽度和高度。 |
| inherit     | 规定应从父元素继承 box-sizing 属性的值。                     |

**JS中如何取值**

1. `dom.style.width/height` 只能取到行内样式的宽和高，style标签中和link外链的样式取不到。
2. `dom.currentStyle.width/height` 取到的是最终渲染后的宽和高，只有IE支持此属性。
3. `window.getComputedStyle(dom).width/height` 同（2）但是多浏览器支持，IE9以上支持。
4. `dom.getBoundingClientRect().width/height` 也是得到渲染后的宽和高，大多浏览器支持。IE9以上支持，除此外还可以取到相对于视窗的上下左右的距离



## 五、定位

[position — MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)

[杀了个回马枪，还是说说position:sticky吧](https://www.zhangxinxu.com/wordpress/2018/12/css-position-sticky/)

 **`position`**属性用于指定一个元素在文档中的定位方式。[`top`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/top)，[`right`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/right)，[`bottom`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/bottom) 和 [`left`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/left) 属性则决定了该元素的最终位置。

按定位类型分类：

- **定位元素（positioned element）**是其[计算后](https://developer.mozilla.org/zh-CN/docs/Web/CSS/computed_value)位置属性为 `relative`, `absolute`, `fixed `或 `sticky` 的一个元素（换句话说，除`static`以外的任何东西）。
- **相对定位元素（relatively positioned element）**是[计算后](https://developer.mozilla.org/zh-CN/docs/Web/CSS/computed_value)位置属性为 `relative `的元素。
- **绝对定位元素（absolutely positioned element）**是[计算后](https://developer.mozilla.org/zh-CN/docs/Web/CSS/computed_value)位置属性为 `absolute` 或 `fixed` 的元素。
- **粘性定位元素（stickily positioned element）**是[计算后](https://developer.mozilla.org/zh-CN/docs/Web/CSS/computed_value)位置属性为 `sticky` 的元素。

可以取值：

* `static`

  元素使用正常的布局行为，即元素在文档常规流中当前的布局位置。此时 `top`, `right`, `bottom`, `left` 和 `z-index `属性无效。

* `relative`

  元素先放置在未添加定位时的位置，再在不改变页面布局的前提下调整元素位置；对 table-*-group, table-row, table-column, table-cell, table-caption 元素无效

* `absolute`

  元素会被移出正常文档流，并不为元素预留空间，通过指定元素相对于最近的非 static 定位祖先元素的偏移；可以设置外边距（margins），且不会与其他边距合并

* `fixed`

  元素会被移出正常文档流，并不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置；当元素祖先的 `transform`, `perspective` 或 `filter` 属性非 `none` 时，容器由视口改为该祖先

* `sticky`

  元素根据正常文档流进行定位，然后相对它的最近滚动祖先。一个sticky元素会“固定”在离它最近的一个拥有“滚动机制”的祖先上（当该祖先的`overflow` 是 `hidden`, `scroll`, `auto`, 或 `overlay`时），即便这个祖先不是最近的真实可滚动祖先。

  

## 六、布局

### 1. 等高列

如果你不用支持 IE9 及其以下的浏览器，建议使用 Flexbox 而不是表格布局。

* 使用表格布局
  * 容器设 `display:table`
  * 为容器指定宽度，如 100%
  * 两列设为 `display:table-cell`，按比例分配宽度
  * 使用 `border-spacing` 设置间隔
  * 在容器外再包裹一层 `div`，设置负外边距，使得两端对齐
* flexbox
  * 容器设置 `display:flex`
  * 直接使用外边距设置间隔

[codepen](https://codepen.io/flashhu/pen/mdrxyPW)



### 2. 垂直居中

> padding / line-height
>
> flex / table
>
> position

* 自然高度的容器：相等的上下内边距 **`padding`**
* 指定高度的容器或无法使用边距： `display: table-cell` 配合 `vertical-align: middle`
* 不需要支持 IE9 ：**`display:flex` **配合 `align-item：center`
* 只有一行文本：设置**`line-height`**为`height`值
* 已知容器和内容的高度：`position:absolute` 配合 `top: calc(50% - height)` 或者 `top: 50%`，`margin: - height / 2`
* 只知容器高度：`position: absolute` 配合 `transform: translate(0,-100%)`

[codepen](https://codepen.io/flashhu/pen/RwoOGmE)



### 3. 水平居中

* 行内元素：`text-align: center`
* 块级元素：`margin: 0 auto`
* 不需要支持 IE9 ：**`display:flex` **配合 `justify-content: center`
* 借助 `position` 和垂直居中相近



### 4. flex

> 一维布局

[flex — MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)

[Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

[写给自己看的display: flex布局教程](https://www.zhangxinxu.com/wordpress/2018/10/display-flex-css3-css/)

[写给自己看的display: grid布局教程](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/)

**是什么**

弹性布局，可以使盒模型拥有最大的灵活性

行内元素可使用 `display: inline-flex`

块级元素可使用 `display: flex`

设为 Flex 布局以后，子元素的`float`、`clear` 和 `vertical-align` 属性将失效

**怎么做的**

设置 `display: flex` 的元素称为 flex 容器，它的子元素（顶层，儿子是，孙子不是）称为 flex 项目

容器默认有两根轴：主轴及交叉轴，并区分开始和结束位置。

默认情况下主轴为水平方向，从左到右；交叉轴为垂直方向，从上到下。

从主轴顺时针方向旋转 90 度即为交叉轴方向

1. flex 容器上的属性有

   * flex-direction

     定义主轴方向，默认为 `row`。还能设置为 `row-reverse`， `column`，`column-reverse`

   * flex-wrap

     定义是否换行，默认为 `nowrap`。还能设置为 `wrap`（首行在上），`wrap-reverse`（首行在下）

   * flex-flow

     是 direction，wrap 的简写形式，默认为 `row nowrap`

   * justify-content

     定义子项目在主轴上的对齐方式，默认为 `flex-start`。还能设置为 `flex-end`，`center`，`space-between`（子项之间间隔相同），`space-around`（子项两侧间隔相同），`space-evenly`（子项和边界及相邻子项的间隔相隔）

   * align-items

     定义子项目在交叉轴上的对齐方式，默认为 `stretch`（等高）。还能设置为 `flex-start`，`flex-end`，`center`，`baseline`（首行文字基线对齐）

   * align-content

     定义在交叉轴方向上行与行之间的对齐方式，默认为 `stretch`（每行等比例拉伸）。还能设置为 `flex-start`，`flex-end`，`center`，`space-around`，`space-between`，`space-evenly`

2. flex 项目上的属性有

   * order

     定义子项的排列顺序，默认为0，数值越小，排列越靠前

   * align-self

     定义单个子项在交叉轴上的对齐方式，默认为 `auto`（继承父元素），还可以设为  `flex-start`，`flex-end`，`center`，`baseline`， `stretch`

   * flex-grow

     定义子项的放大比例，默认为 0（不放大），数值越大，从剩余空间中分配到的越大

   * flex-shrink

     定义子项的缩小比例，默认为 1（空间不足则缩小），如为 0 表示不缩小，不支持负值

   * flex-basis

     定义子项在主轴上占据的空间，默认为 `auto`（项目原有大小）

   * flex

     是 grow，shrink，basis 的简写形式，默认为 `0 1 auto`。包含两个快捷值， `auto` 表示 `1 1 auto`，`none` 表示 `0 0 auto`



### 5. grid

> 二维布局

[grid — MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/grid)

[CSS Grid 网格布局教程](http://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html)

**是什么**

> grid和inline-grid区别在于，inline-grid容器为inline特性，因此可以和图片文字一行显示；grid容器保持块状特性，宽度默认100%，不和内联元素一行显示

Grid 布局将容器分为行和列，产生单元格

行内元素可使用 `display: inline-grid`

块级元素可使用 `display: grid`

设为网格布局以后，容器子元素的`float`、`display: inline-block`、`display: table-cell`、`vertical-align`和`column-*`等设置都将失效

**怎么做的**

设置 `display: grid` 的元素称为容器，它的子元素（顶层，儿子是，孙子不是）称为项目

容器里面的水平区域称为"行"，垂直区域称为"列"

行和列的交叉区域，称为"单元格"

划分网格的线，称为"网格线"。水平网格线划分出行，垂直网格线划分出列

1. grid 容器上的属性有：

   * grid-template-columns

   * grid-template-rows

     定义每列列宽 / 行高，支持绝对单位，百分比。

     可借助 `repeat` 缩略，如 `grid-template-rows: repeat(3, 33.33%)`，`repeat` 中可借助 `auto-fill` ，不指定行/列数，实现自动填充

     可借助 `fr`，使用比例关系，如 `grid-template-columns: 1fr 1fr;`，可以和 `repeat` 结合使用

     可借助 `minmax` 表示一个长度范围，使用 `auto`由浏览器决定长度

     使用方括号可指定网格线的名称，支持拥有多个名字 `[fifth-line row-5]` 

   * row-gap

   * column-gap

   * gap

     设置行 / 列间距。

     `grid-gap` 为 row，column 的简写，如只有一个值，则 column 等于 row 的间距

   * grid-template-areas

     指定单元格，当名称一致时，表示合并单元格

     区域的命名会影响到网格线。每个区域的起始网格线，会自动命名为`区域名-start`，终止网格线自动命名为`区域名-end`。

   * [grid-auto-flow](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#grid-auto-flow)

   * [justify-items](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#justify-items)

   * [align-items](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#align-items)

   * [place-items](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#place-items)

   * [justify-content](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#justify-content)

   * [align-content](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#align-content)

   * [place-content](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#place-content)

   * [grid-auto-columns](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#grid-auto-columns-rows)

   * [grid-auto-rows](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#grid-auto-columns-rows)

   * [grid](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#grid-grid)

2. grid 项目上的属性有：

   - [grid-column-start](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#grid-column-row-se)
   - [grid-column-end](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#grid-column-row-se)
   - [grid-row-start](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#grid-column-row-se)
   - [grid-row-end](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#grid-column-row-se)
   - [grid-column](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#grid-column-row)
   - [grid-row](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#grid-column-row)
   - [grid-area](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#grid-area)
   - [justify-self](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#justify-self)
   - [align-self](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#align-self)
   - [place-self](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/#place-self)



## 七、动画

### 1. transform（转换）

[transform-function](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-function)

> 只针对盒模型

旋转（rotate），缩放（scale），倾斜（skew）或平移（translate）给定元素

可以应用多个变换函数，从左到右相乘，从右到左应用

| 值                                                           | 描述                                                         | 测试                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| none                                                         | 定义不进行转换。                                             | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_rotate&p=22) |
| matrix(*n*,*n*,*n*,*n*,*n*,*n*)                              | 定义 2D 转换，使用六个值的矩阵。                             | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_matrix) |
| matrix3d(*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*,*n*) | 定义 3D 转换，使用 16 个值的 4x4 矩阵。                      |                                                              |
| **translate(*x*,*y*)**                                       | 定义 2D 转换。y 不写则默认为 0                               | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_translate) |
| translate3d(*x*,*y*,*z*)                                     | 定义 3D 转换。                                               |                                                              |
| **translateX(*x*)**                                          | 定义转换，只是用 X 轴的值。                                  | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_translatex) |
| **translateY(*y*)**                                          | 定义转换，只是用 Y 轴的值。                                  | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_translatey) |
| translateZ(*z*)                                              | 定义 3D 转换，只是用 Z 轴的值。                              |                                                              |
| **scale(*x*,*y*)**                                           | 定义 2D 缩放转换。y 不写默认和 x 一样                        | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_scale) |
| scale3d(*x*,*y*,*z*)                                         | 定义 3D 缩放转换。                                           |                                                              |
| **scaleX(*x*)**                                              | 通过设置 X 轴的值来定义缩放转换。                            | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_scalex) |
| **scaleY(*y*)**                                              | 通过设置 Y 轴的值来定义缩放转换。                            | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_scaley) |
| scaleZ(*z*)                                                  | 通过设置 Z 轴的值来定义 3D 缩放转换。                        |                                                              |
| **rotate(*angle*)**                                          | 定义 2D 旋转，在参数中规定角度。正值顺时针，负值逆时针。单位`deg` | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_rotate) |
| rotate3d(*x*,*y*,*z*,*angle*)                                | 定义 3D 旋转。                                               |                                                              |
| rotateX(*angle*)                                             | 定义沿着 X 轴的 3D 旋转。                                    | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_rotatex) |
| rotateY(*angle*)                                             | 定义沿着 Y 轴的 3D 旋转。                                    | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_rotatey) |
| rotateZ(*angle*)                                             | 定义沿着 Z 轴的 3D 旋转。                                    | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_rotatez) |
| **skew(*x-angle*,*y-angle*)**                                | 定义沿着 X 和 Y 轴的 2D 倾斜转换。如新的点会处于旧的点相比坐标轴方向的特定角度位置 | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_skew) |
| skewX(*angle*)                                               | 定义沿着 X 轴的 2D 倾斜转换。                                | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_skewx) |
| skewY(*angle*)                                               | 定义沿着 Y 轴的 2D 倾斜转换。                                | [测试](https://www.w3school.com.cn/tiy/c.asp?f=css_transform_skewy) |
| perspective(*n*)                                             | 为 3D 转换元素定义透视视图。                                 |                                                              |



### 2. transition（过渡）

[transition — MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition)

用于定义切换状态时的过渡效果

是 [`transition-property`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition-property)，[`transition-duration`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition-duration)，[`transition-timing-function`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition-timing-function) 和 [`transition-delay`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transition-delay) 的一个[简写属性](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties)。

* 两个值，表示 property name | duration
* 三个值，可能为 margin-right 4s 1s，也可能为 margin-right 4s ease-in-out
* 支持逗号分隔，设置多个 `transition: margin-right 4s, color 1s;`
* 或使用 `transition: all 0.5s ease-out;`

| 值                                                           | 描述                                |
| :----------------------------------------------------------- | :---------------------------------- |
| [transition-property](https://www.w3school.com.cn/cssref/pr_transition-property.asp) | 规定设置过渡效果的 CSS 属性的名称。 |
| [transition-duration](https://www.w3school.com.cn/cssref/pr_transition-duration.asp) | 规定完成过渡效果需要多少秒或毫秒。  |
| [transition-timing-function](https://www.w3school.com.cn/cssref/pr_transition-timing-function.asp) | 规定速度效果的速度曲线。            |
| [transition-delay](https://www.w3school.com.cn/cssref/pr_transition-delay.asp) | 定义过渡效果何时开始。              |



### 3. animation

[animation — MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation)

指定一组或多组动画，每组间用逗号相隔

[`animation-name`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-name)，[`animation-duration`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-duration), [`animation-timing-function`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-timing-function)，[`animation-delay`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-delay)，[`animation-iteration-count`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-iteration-count)，[`animation-direction`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-direction)，[`animation-fill-mode`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-fill-mode) 和 [`animation-play-state`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/animation-play-state) 属性的一个简写属性形式

和 `@keyframes` 一起使用

| 值                                                           | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| *[animation-name](https://www.w3school.com.cn/cssref/pr_animation-name.asp)* | 规定需要绑定到选择器的 keyframe 名称。。                     |
| *[animation-duration](https://www.w3school.com.cn/cssref/pr_animation-duration.asp)* | 规定完成动画所花费的时间，以秒或毫秒计。                     |
| *[animation-timing-function](https://www.w3school.com.cn/cssref/pr_animation-timing-function.asp)* | 规定动画的速度曲线。                                         |
| *[animation-delay](https://www.w3school.com.cn/cssref/pr_animation-delay.asp)* | 规定在动画开始之前的延迟。                                   |
| *[animation-iteration-count](https://www.w3school.com.cn/cssref/pr_animation-iteration-count.asp)* | 规定动画应该播放的次数。infinite 无限循环，非0 数字表示次数  |
| *[animation-direction](https://www.w3school.com.cn/cssref/pr_animation-direction.asp)* | 规定是否应该轮流反向播放动画。normal，reverse，alternate，alternate-reverse |



## 八、性能

[How to Improve CSS Performance](https://calibreapp.com/blog/css-performance)

* CSS-IN-JS 有利于避免 CSS 阻塞 HTML 解析
* 使用 `link` 替代  `@import` ，`@import` 会需要额外再发起请求下载文件，串行请求，渲染速度变慢；`link` 可以并行下载
* 使用 `transform: scale(x, y)` 替代 `height`, `width`；使用 `transform: translate(x, y) ` 替代 `top`，`left` 等。不会触发重排，开销更小
* 使用 [`contain`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/contain) 将部分元素独立于文档流
* CSS 压缩  / 使用精灵图
* 少用通配符，少用元素选择器结尾
* 减少 CSS 嵌套



## 九、扩展

### 1. 原生 JS 设置 class

[js中设置元素class，添加元素class的方法](https://www.jianshu.com/p/12a013c5b4fb)

