# scroll-view的下拉刷新扩展组件
> 不敢说最好，但是感觉也应该是性能和体验靠前的下拉刷新扩展了，老规矩，代码片段放最后了~
## 原理
其实原理很简单，和普通H5以及市面上有的下拉刷新没有特别大的区别，都是基于`touch`手势检测事件来实现下拉刷新的。`touchstart`的时候记录当前触摸点，`touchmove`的时候开始计算移动方向和移动距离, `touchend`的时候计算是否要进行下拉刷新操作。如图所示：

## 实现方法
调研了一些实现方法，目前大部分都是通过js计算，然后setData来改变元素的`transform`值实现下拉刷新。考虑到性能问题，此处使用了`wxs`的响应式能力来实现整个计算逻辑，不用通过逻辑层和视图层通信，直接在视图层进行渲染。具体文档请参考[wxs响应事件](https://developers.weixin.qq.com/miniprogram/dev/framework/view/interactive-animation.html)。  

> 这里在`list`组件(由`scroll-view`组成)下抽出了一个`scroll.wxs`作为响应事件的事件处理函数集合，源码基本上就在`scroll.wxs`和`list`组件。  

`scroll.wxs`定义了如下变量和函数：
```
var moveStartPosition = 0     //开始位置
var moveDistance = 0          //移动距离

var moveRefreshDistance = 60  //达到刷新的阈值
var moveMaxDistance = 100     //最大可滑动距离
var isRefreshMaxDown = false  //是否达到了最大距离， 用来判断是否要震动提示

var loading = false           //是否正在loading

... ...

module.exports = {
  touchStart: touchStart, //手指开始触摸事件
  touchMove: touchMove, //手指移动事件
  touchEnd: touchEnd, //手指离开屏幕事件
  loadingTypeChange: loadingTypeChange, //请求状态变化监听，监听刷新请求开始和请求完成
  triggerRefresh: triggerRefresh //主动触发刷新操作，比如点击页面上一个按钮，重新刷新list，这就需要用到这个方法
}
```

- `touchStart`和`touchMove`就不用说了，代码注释都很明白，普通的监听移动和处理逻辑。  

- `touchEnd`主要是判断移动距离是否达到了阈值，然后根据结果，调用监听实例的`callMethod`方法触发`refreshStart`或者`refreshCancel`方法，这两个方法都是写到`list`组件里面的，用来触发刷新方法或者取消刷新。  

- `loadingTypeChange`方法主要是监听刷新是否完成，以此来触发动画效果。  

- `triggerRefresh`通过监听主动触发的变量来处理。如果需要主动触发刷新，则调用`list`组件内部的`forceRefresh`方法，具体使用示例在`index/index/js`的`onLoad`函数有: `this.selectComponent('.list').forceRefresh()`

- `scroll.wxs`里面还有一个未导出的方法，叫`drawTransitionY`，这个方法主要是因为`ios12`对于`transition`动画效果支持的不好，所以自己写了个Y轴方向的动画（`linear`线性的），大佬们可以自己往上添加各种`ease-in-out`效果。  

里面具体的实现可以查看代码注释哦~

## 使用
好了，前面讲了实现的原理和方法，那么在代码里面，应该怎么直接使用呢？如下代码所示：
```
<!-- 使用示例 -->
<list class="list" refresh-loading="{{refreshLoading}}" loading="{{loading}}" bindrefresh="initList" bindloadmore="loadmore">
  <!-- your code -->
</list>
```

- `refresh-loading`属性用来通过外部loading态来控制刷新动画的开始结束，因为每当变化`refresh-loading`的值时，会将变化同步到组件内的`showRefresh`属性，`wxs`通过监听`showRefresh`来处理动画逻辑。  

- `loading`属性是上拉加载更多的时候触发的loading态展示，跟刷新无关

- `bindrefresh`是刷新触发时绑定的函数，下拉刷新动画成功开始后触发这个函数

- `bindloadmore`透传`scroll-view`的加载更多方法

> 当然，源码里面也包含了一个`list-item`组件，这个跟本文没太大关系，是用来做瀑布流长列表内容太多时的内存不足问题解决方案的，具体请看[解决小程序渲染复杂长列表，内存不足问题](https://juejin.im/post/5de8cc166fb9a0160a312404)

## 干货
最后，上代码片段， [小程序代码片段](https://developers.weixin.qq.com/s/POCnzymR7ndV)  

[github地址](https://developers.weixin.qq.com/s/POCnzymR7ndV)