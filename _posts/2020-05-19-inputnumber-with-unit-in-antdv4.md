---
layout:     post
title:      "如何在v4中实现带单位的数字输入框"
subtitle:   "当Form组件使用不熟练选手突然切换到了Antd v4"
date:       2020-05-19 23:19:28
author:     "虎鲸"
header-img: "img/post-bg-html-select.jpg"
tags:
    - React
---

#### 需求描述
1. 输入为数字，显示单位
2. 标注哪些为必填项
3. 数字校验
***
#### 效果图
![图例](/img/in-post/inputnumber-unit/1.png)
***
#### 实践过程
1. 输入数字，使用`<InputNumber>`比使用`<Input>`更不容易出现奇奇怪怪的问题
2. 参照[v3中的写法](https://blog.csdn.net/qq_40593656/article/details/105077269)，如需在`<InputNumber>`后加入元素，需要拿标签包裹
3. 直接套用v3中的写法，会出现如下报错：
```
Warning: [antd: Form.Item] `children` is array of render props cannot have `name`.
```
(报错这玩意儿 总有前人会遇到的)  [传送门](https://gitter.im/ant-design/ant-design-english?at=5e5dd8b97fef7f2e89995311)
![图例](/img/in-post/inputnumber-unit/2.png)
真相只有一个！！ 看antd的[文档描述](https://ant.design/components/form-cn/#components-form-demo-complex-form-control)
输入组件需要直接包裹才能绑定表单，实现上述需求可以使用内嵌的`<Form.Item>`实现
***
#### 相关代码
```html
<Form {...layout} ref={this.formRef}>
    <Form.Item label="体温" required>
        <Form.Item 
            name="temp"
            rules={[{ required: true,  message: '请输入体温！' }]}
            noStyle
        >
            <InputNumber min={35} max={45} step={0.1} />
        </Form.Item>
        <span className="ant-form-text">°C</span>
    </Form.Item>
    <Form.Item label="心率">
        <Form.Item
            name="heartrat"
            noStyle
        >
            <InputNumber min={20} max={300} />
        </Form.Item>
        <span className="ant-form-text">bmp</span>
    </Form.Item>
    ...
</Form>
```

收工！