// components/list/list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //加载更多的阈值
    lowerThreshold: {
      type: Number,
      value: 100
    },
    //加载更多是否加载中
    loading: {
      type: Boolean,
      value: false
    },
    //下拉刷新是否加载中
    refreshLoading: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        this.setData({
          showRefresh: newVal
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    //显示下拉刷新的标志位
    showRefresh: false,
    //用来做主动触发刷新的标志位
    forceRefresh: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 开始刷新，如果wxs设定了刷新延迟，则延迟刷新，原因见wxs里面
     */
    refreshStart(options) {
      if (options.setTimeout) {
        setTimeout(() => {
          this.refresh()
        }, options.setTimeout)
      } else {
        this.refresh()
      }
    },
    /**
     * 下拉到最大距离时震动提示
     */
    refreshMaxDown() {
      wx.vibrateShort()
    },
    /**
     * 取消了刷新
     */
    refreshCancel() {
      this.setData({
        showRefresh: false
      })
    },
    /**
     * 对外暴露出了一个刷新事件 
     */
    refresh() {
      // 刷新操作
      this.setData({
        showRefresh: true
      })
      this.triggerEvent('refresh')
    },
    /**
     * 在父页面调用，通过wxs事件监听，主动触发刷新
     */
    forceRefresh() {
      this.setData({
        forceRefresh: true
      })
      wx.nextTick(() => {
        this.setData({
          forceRefresh: false
        })
      })
    },
    /**
     * 加载更多
     */
    loadmore() {
      this.triggerEvent('loadmore')
    }
  }
})