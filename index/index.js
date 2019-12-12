const app = getApp()

Page({
  data: {
    list: [],
    loading: false, //上拉加载更多的loading
    refreshLoading: false //下拉刷新页面的loading
  },
  onLoad: function () {
    this.initList()

    //用来试验主动触发
    // setTimeout(() => {
    //   this.selectComponent('.list').forceRefresh()
    // }, 4000)
  },
  initList: function () {
    this.setData({
      refreshLoading: true,
    })
    setTimeout(() => {
      this.setData({
        list: [],
        refreshLoading: false,
      })
      this.loadmore()
    }, 1000)
  },
  loadmore: function () {
    //过长的list需要做二维数组，因为setData一次只能设置1024kb的数据量，如果过大的时候，就会报错
    //二维数组每次只设置其中一维，所以没有这个问题
    let nowList = `list[${this.data.list.length}]`
    let demoList = this.getList(10)
    this.setData({
      [nowList]: demoList
    })
  },
  /**
   * 每次吸入num条数据
   */
  getList(num) {
    let list = []
    for (let i = 0; i < num; i++) {
      list.push({
        height: this.getRadomHeight()
      })
    }
    return list
  },
  /**
   * 生成随机(100, 400)高度
   */
  getRadomHeight() {
    return parseInt(Math.random() * 300 + 100)
  }
})
