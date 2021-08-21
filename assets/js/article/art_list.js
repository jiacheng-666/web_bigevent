$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    //定义补零方法
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义一个查询的参数对象,将来请求数据的时候,需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值,默认请求第一页的数据
        pagesize: 2, //每页显示几条数据,默认每页显示2条
        cate_id: '', //文章分类的Id
        state: '' //文章的发布状态
    }

    inintTable()
    initCate()



    //获取文章列表数据的方法
    function inintTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // layer.msg('获取文章列表成功')
                // console.log(res);
                //使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // layer.msg('获取文章列表成功')
                //使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    //为筛选表单绑定 submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        //获取表单中选中先的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数对象 q 中的对应属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新的筛选条件,重新渲染表格的数据
        inintTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);

        //调用laypage.render方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器的ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            //分页发生切换的时候,触发jump回调函数
            //触发jump的方式:
            // 1.点击页码时    first为 undefined
            // 2.调用laypage.render()方法,就会触发jump  first为 true
            jump: function (obj, first) {
                //可以通过 first的值,来判断是通过那种方式,触发的jump回调
                //如果 first值为 true,方式2触发  否则方式1触发
                // console.log(obj.curr);
                // console.log(first);  //true
                // console.log(obj.limit); //得到每页显示的条数

                //把最新的页码值,赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                //把最新的条目数,赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit
                //根据最新的 q 获取对应的数据列表并渲染表格
                if (!first) { //通过点击页码值来触发 jump
                    inintTable()
                }
            }
        });
    }


    // 通过代理的形式，为删除按钮绑定点击事件：
    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮的个数
        var len = $('.btn-delete').length
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    //当数据删除完成后,需要判断当前这一页中,是否还有剩余的数据
                    //如果没有,则让页码 -1
                    //在重新调用 initTable()方法

                    if (len === 1) {
                        //如果len 的值为1 ,说明删除完后,页面就没有数据了
                        //页码值最小是 1  q.pagenum
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    layer.close(index)
                    inintTable()
                }
            })
        })
    })
})