// 本地存取数据方法封装

var Util = (function () {
  var prefix = 'html5_reader_'
  var StorageGetter = function (key, val) {
    return localStorage.getItem(prefix + key, val)
  }
  var StorageSetter = function (key, val) {
    return localStorage.setItem(prefix + key, val)
  }
  //把base64数据解码转译
  var getJSON = function (url, callback) {
    return $.jsonp({
      url: url,
      cache: true,
      callback: 'duokan_fiction_chapter',
      success: function (result) {
        var data = $.base64.decode(result);
        var json = decodeURIComponent(escape(data));
        callback(json);
      }
    })
  }
  return {
    getJSON: getJSON,
    StorageGetter: StorageGetter,
    StorageSetter: StorageSetter
  }
})()

var Dom = {
  top_nav: $('#top_nav'),
  bottom_nav: $('.bottom_nav'),
  font_container: $('.font-container'),
  font_button: $('.icon-ft'),
  day_icon: $('#day_icon'),
  night_icon: $('#night_icon')

}
var Win = $(window);
var Doc = $(document);
var readerModel;
var readerUI;
var RootContainer = $('#fiction_container')
var initFontSize = Util.StorageGetter('font-size', initFontSize)
initFontSize = parseInt(initFontSize)
if (!initFontSize) {
  initFontSize = 16
}
RootContainer.css('font-size', initFontSize)

function main() {
  // 整个项目的入口函数
readerModel = ReaderModel();
readerUI = ReaderBaseFrame(RootContainer)
  readerModel.init(function(data){
    readerUI(data);
  });
  EventHanlder()
}

function ReaderModel() {
  //实现和阅读相关的数据交互方法
  var chapter_id;
  var chapterTotal;
  var init = function(UIcallback){
    getFictionInfo(function(){
      getCurChapterContent(chapter_id,function(data){
        UIcallback && UIcallback(data);
      })
    })
  }
  var getFictionInfo = function(callback){
    $.get('../data/chapter.json',function(data){
      //获得章节信息之后的回调
      chapter_id = data.chapters[1].chapter_id;
      chapterTotal = data.chapters.length;
      callback && callback();
    },'json');
  }
  var getCurChapterContent = function (chapter_id, callback) {
    //获取章节内容
    $.get('../data/data/data' + chapter_id + '.json', function (data) {
      if (data.result === 0) {
        var url = data.jsonp;
        Util.getJSON(url, function (data) {
          callback && callback(data);
        })
      }
    }, 'json')
  }
  var prevChapter = function (UIcallback) {
    chapter_id = parseInt(chapter_id, 10)
    if (chapter_id === 0) {
      return;
    }
    chapter_id -= 1
    getCurChapterContent(chapter_id, UIcallback)
  }
  var nextChapter = function (UIcallback){
    chapter_id = parseInt(chapter_id, 10)
    if(chapter_id===chapterTotal){
      return;
    }
    chapter_id += 1
    getCurChapterContent(chapter_id, UIcallback)
  }
  return {
    init: init,
    prevChapter: prevChapter,
    nextChapter: nextChapter,
  }
}
function ReaderBaseFrame(container) {
  //渲染基础的UI结构
  function parseChapterData(jsonData){
    var jsonObj = JSON.parse(jsonData)
    var html = '<h4>'+ jsonObj.t+'</h4>' ;
    for(var i=0;i<jsonObj.p.length;i++){
      html += '<p>'+jsonObj.p[i]+'</p>';
    }
    return html;
  }
  return function(data){
    container.html(parseChapterData(data));
  }
}

function EventHanlder() {
  //交互时间绑定
  $('#action_mid').on('click', function() {
    if (Dom.top_nav.css('display') === 'none') {
      Dom.top_nav.show()
      Dom.bottom_nav.show()
    } else {
      Dom.top_nav.hide()
      Dom.bottom_nav.hide()
      Dom.font_container.hide()
      Dom.font_button.removeClass('current')
    }
  })
  Win.scroll(function() {
    Dom.top_nav.hide()
    Dom.bottom_nav.hide()
    Dom.font_container.hide()
    Dom.font_button.removeClass('current')
  })
  $('#day_icon').click(function() {
    // 触发白天黑夜交换
  })

  Dom.font_button.click(function() {
    if (Dom.font_container.css('display') === 'none') {
      Dom.font_container.show()
      Dom.font_button.addClass('current')
    } else {
      Dom.font_container.hide()
      Dom.font_button.removeClass('current')
    }
  })

  $('#large-font').click(function() {
    if (initFontSize > 20) {
      return
    }
    initFontSize += 1
    RootContainer.css('font-size', initFontSize)
    
    Util.StorageSetter('font-size', initFontSize)
    
  })

  $('#small-font').click(function() {
    if (initFontSize < 12) {
      return
    }
    initFontSize -= 1
    RootContainer.css('font-size', initFontSize)
    Util.StorageSetter('font-size', initFontSize)
  })
   //日夜模式切换
  $('#day_icon').click(function(){
      if(Dom.night_icon.css('display')==='none'){
          Dom.day_icon.hide();
          Dom.night_icon.show();
        $('body').css('background', '#aaa');
      }
  })

  $('#night_icon').click(function(){
      if (Dom.night_icon.css('display') !== 'none'){
          Dom.day_icon.show();
          Dom.night_icon.hide();
        $('body').css('background', '#fff');
      } 
  })
  //背景模式切换
  function setBgColor(id,color) {
    $('.bk-container').on('click', id, function (ev) {
      $('body').css('background', color);
    })}
  setBgColor('#bk_current_a','#fff');
  setBgColor('#bk_current_b', '#e9dfc7');
  setBgColor('#bk_current_c', '#e9dfc7');
  setBgColor('#bk_current_d', '#D4DFE6');
  setBgColor('#bk_current_e', '#aaa');
  //上下长翻页
  $('#prev_button').click(function(){
    readerModel.prevChapter(function(data){
      readerUI(data);
    });
  })
  $('#next_button').click(function(){
    readerModel.nextChapter(function(data){
      readerUI(data);
    })
  })
}
main()
