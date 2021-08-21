$(function () {
    var layer = layui.layer
    var form = layui.form

    initCate()
    // 初始化富文本编辑器
    initEditor()

    //定义获取文章分类的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                //模板引擎返回来的是一个字符串
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                //调用模板引擎渲染下拉菜单
                var htmlStr = template('tpl-cate', res)
                // htmlStr里面放的是字符串标签
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单区域的UI结构
                //一定要记得调用 form.render()方法
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    //未选择封面的按钮,绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    //监听coverFile 的change事件,获取用户选择的文件列表
    $("#coverFile").on('change', function (e) {
        //获取到文件的列表数组
        var files = e.target.files
        //判断用户是否选择了文件
        if (files.length === 0) return

        //根据文件,创建对应的URL地址  把文件转化为url
        var newImageURL = URL.createObjectURL(files[0])
        //为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImageURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    //定义文章的发布状态
    var art_state = '已发布'


    //为 存为草稿 按钮,绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    //为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        //1.阻止表单默认提交行为
        e.preventDefault()
        //2.基于form表单,快速创建一个FormData对象
        //$(this)[0]获取form表单并把它转化为DOM元素
        var fd = new FormData($(this)[0])
        //3.将文章的发布状态存入fd中
        fd.append('state', art_state)

        //4.将封面裁剪过后的图片,输入为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                // 5.将文件对象追加到fd中
                fd.append('cover_img', blob)

                //6.发起 ajax数据请求
                publishArticle(fd)
            })
    })

    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意:如果向服务器提交的是FormData格式的数据
            //必须添加一下2个数据项
            contentType: false,
            processData: false,
            success: function (res) {
                if(res.status !== 0 ) {
                    return layer.msg('发布文章失败!')
                }
                layer.msg('发布文章成功!')
                //发布文章成功后,跳转到文章列表页面
                location.href='/article/art_list.html'

            }
        })
    }
})