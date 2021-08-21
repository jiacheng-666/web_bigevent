$(function () {

    var layer = layui.layer
    var form = layui.form
    initArtCateList()



    //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                //模板引擎返回来的是一个字符串
                var htmlStr = template('tpl-table', res)
                // htmlStr里面放的是字符串标签
                $('tbody').html(htmlStr)
            }
        })
    }


    //为添加类别 按钮添加绑定事件
    var indexAdd = null
    $('#btnAddCate').on('click', function () {
        //弹出一个添加文章分类信息的层
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    //通过代理的形式,为动态创建的form-add表单添加 submit监听事件
    $('body').on('submit', '#form-add', function (e) {
        //阻止默认提交行为
        e.preventDefault()
        //发起POST请求,将form表单中的数据传进去
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败!')
                }
                //渲染列表数据
                initArtCateList()
                layer.msg('新增分类成功!')
                //设置弹出层自动关闭  根据索引,关闭弹出层
                layer.close(indexAdd)
            }
        })
    })


    //通过代理的形式,为动态创建的btn-edit添加 点击监听事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        //1.弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
        // console.log(id);
        //2.发起请求,获取对应的分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                //快速为form表单添加元素
                form.val('form-edit', res.data)
            }
        })

        //3. 修改文章分类
        //通过代理的形式,为动态创建的form-edit表单添加 submit监听事件
        $('body').on('submit', '#form-edit', function (e) {
            //阻止默认提交行为
            e.preventDefault()
            //发起POST请求,将form表单中的数据传进去
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类数据失败!')
                    }
                    //渲染列表数据
                    initArtCateList()
                    layer.msg('更新分类数据成功!')
                    //设置弹出层自动关闭  根据索引,关闭弹出层
                    layer.close(indexEdit)
                }
            })
        })
    })

    //通过代理的形式,为动态创建的btn-delete添加 点击监听事件
    $('tbody').on('click', '.btn-delete', function () {
        // console.log(11);
        var id = $(this).attr('data-id')
        //提示用户是否要删除
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: "GET",
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章数据失败')
                    }
                    //删除成功后重新渲染数据
                    initArtCateList()
                    layer.msg('删除文章数据成功')
                    //关闭弹出层
                    layer.close(index);
                }
            })
        });
    })
})