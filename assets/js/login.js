$(function () {
    //点击 "去注册账号的"链接
    $("#link_reg").on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    //点击 "去登录的"链接
    $("#link_login").on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //冲 layui中获取 需要用到的对象
    var form = layui.form
    var layer = layui.layer
    //通过 form.verify()函数自定义校验规则
    form.verify({
        //自定义一个 pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框的内容
            //还需要拿到密码框的内容
            //然后进行等于判断
            //如果判断失败,return 出去
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return "两次密码不一致!"
            }
        }
    })


    // 监听 注册  表单的提交事件
    $('#form_reg').on('submit', function (e) {
        //1.阻止默认提交行为
        e.preventDefault()
        //2.发起ajax的POST请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser',
            data,
            function (res) {
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message);
                }
                // console.log(res.message);
                layer.msg(res.message + '请登录');
                //默认人的点击行为
                $('#link_login').click()
            })
    })

    //监听 登录 表单的 提交事件 
    $('#form_login').on('submit', function (e) {
        //阻止默认提交行为
        e.preventDefault()
        // e.stopPropagation();
        // 发起POST请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                //如果不等 0 ==失败
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                }
                layer.msg('登录成功')
                //将登录成功得到的token 字符串 保存到localStorage中
                localStorage.setItem('token',res.token)
                // console.log(res.token);
                //登录成功后跳转到后台主页
                location.href = '/index.html'
            }
        })

    })
})