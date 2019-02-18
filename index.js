// 本地存取数据方法封装

!(function() {
  function View(model) {
    this.model = model
    this.window = $(window)
    this.doc = $(document)
    this.rootContainer = $('#fiction_container')

    this.topNav = $('#top_nav')
    this.bottomNav = $('.bottom_nav')
    this.fontContainer = $('.font-container')
    this.fontButton = $('.icon-ft')
  }
  View.prototype = {
    init: function() {
      this.bindEvents()
    },
    // 绑定事件
    bindEvents: function() {
      var _this = this

      // 触发 工具栏
      $('#action_mid').on('click', function() {
        _this.triggerTools()
      })

      // 滚动隐藏工具栏
      this.window.scroll(function() {
        _this.hideTools()
      })

      // 触发白天黑夜交换
      $('#day_icon').click(function() {})

      // 字体颜色
      this.fontButton.on('click', function() {
        _this.fontContainer.css('display') === 'none'
          ? _this.fontContainer.show()
          : _this.fontContainer.hide()
        _this.fontContainer.css('display') === 'none'
          ? _this.fontButton.addClass('current')
          : _this.fontButton.removeClass('current')
      })

      // 放大
      $('#large-font').click(function() {
        _this.setFontSize('++')
      })

      // 缩小
      $('#small-font').click(function() {
        _this.setFontSize('--')
      })
    },
    // 显示工具栏
    triggerTools: function(state) {
      this.topNav.css('display') === 'none'
        ? this.hideTools()
        : this.showTools()
    },
    hideTools() {
      this.topNav.show()
      this.bottomNav.show()
    },
    showTools() {
      this.topNav.hide()
      this.bottomNav.hide()
      this.fontContainer.hide()
      this.fontButton.removeClass('current')
    },
    initFontSize() {
      var initFontSize = parseInt(this.model.getFontSize('font-size')) || 16
      this.rootContainer.css('font-size', initFontSize)
    },
    setFontSize(state) {
      var initFontSize = parseInt(this.model.getFontSize('font-size')) || 16
      state === '++' ? (initFontSize += 1) : (initFontSize -= 1)
      state === '++'
        ? initFontSize > 20 && (initFontSize = 21)
        : initFontSize < 12 && (initFontSize = 11)
      this.rootContainer.css('font-size', initFontSize)
      this.model.setFontSize('font-size', initFontSize)
    }
  }

  function Model() {}
  Model.prototype = {
    prefix: 'html5_reader_',
    getFontSize: function(key, val) {
      return localStorage.getItem(this.prefix + key, val)
    },
    setFontSize: function(key, val) {
      return localStorage.setItem(this.prefix + key, val)
    }
  }

  function Controller() {
    var views = new View(new Model())
    views.init()
    views.initFontSize()
  }

  new Controller()
})()
