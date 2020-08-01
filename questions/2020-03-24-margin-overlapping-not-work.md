「margin」重叠问题，网上的相关文章很多，本文不详述。
传送门：[css margin的相关属性，问题及应用](https://www.zhangxinxu.com/wordpress/2009/08/css-margin%e7%9a%84%e7%9b%b8%e5%85%b3%e5%b1%9e%e6%80%a7%ef%bc%8c%e9%97%ae%e9%a2%98%e5%8f%8a%e5%ba%94%e7%94%a8/#two2)

### 情况描述
![选区图例](https://img-blog.csdnimg.cn/20200324165120419.png#pic_center)
![选区图例](https://img-blog.csdnimg.cn/20200324165318994.png#pic_center)
？这俩的·margin·怎么都保留了  陷入沉思

### 原因分析
```css
footer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

```
查看代码之后，发现因为设置了弹性布局
`footer`容器被设置为弹性盒子，并且设置子项的文档流方向是纵向的，所以导致出现了截图中的情况
![变化过程图例](https://img-blog.csdnimg.cn/20200324174006432.PNG?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzQ0NTM3NDE0,size_16,color_FFFFFF,t_70#pic_center)
可以作为阻止`margin`重叠的一种解决办法 :-）