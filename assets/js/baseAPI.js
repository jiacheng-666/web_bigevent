//注意每次调用 $.get()或者$.post()或者$.ajax()的时候,
// 会调用ajaxPrefilter 这个函数
//在这个函数中,可以拿到ajax提供的配置对象
$.ajaxPrefilter(function(options){
    //在发起真正的ajax 请求之前,统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net'+options.url
    // console.log(options.url);
})