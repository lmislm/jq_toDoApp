/**
 * Created by Administrator on 2017/4/4.
 */
;(function () {
    'use strict';

    var $form_add_task = $('.add-task')
        // 注册
        , $task_delete_trigger
        , $task_detail
        , new_task = {}
        // , task_list = {}
        , task_list = []
        , $task_detail = $('.task-detail')
        , $task_detail_mask = $('.task-detail-mask')
        , $task_detail_trigger
        // 存储当前变量
        , current_index
        /*更新任务form*/
        , $update_form
        , $task_detail_content
        , $task_detail_content_input
        ;

        init();


    $form_add_task.on('submit',on_add_task_form_submit)
    $task_detail_mask.on('click',hide_task_detail)

    function on_add_task_form_submit(e) {
        var new_task = {}, $input;
        // 禁用默认行为
        e.preventDefault();
        // 获取新task的值
        $input = $(this).find('input[name=content]');
        new_task.content = $input.val();
        // 如果新Task值为空，否则继续执行
        if(!new_task.content) return;
        // console.log('new_task',new_task);
        // // 存入新Task
        if(add_task(new_task)){
            // render_task_list(); 有了更新之后就不需要了
            $input.val(null);
        }
        // console.log('new_task.content',new_task.content);
    }

    function listen_task_detail() {
        // console.log('$task_delete_trigger',$task_delete_trigger);
        $task_detail_trigger.on('click',function () {
            var $this = $(this)
            var $item = $this.parent().parent();
            var index = $item.data('index');
            show_task_detail(index);
            // console.log('index',index);
        })
    }
    /*查看task详情*/
    function show_task_detail(index) {
        render_task_detail(index);
        current_index = index;
        $task_detail.show();
        $task_detail_mask.show();
    }
    /*更新function的方法*/
    function update_task(index, data) {
        if(!index || !task_list[index])
            return ;
        // task_list[index] = $.merge({}, task_list[index], data);
        task_list[index] = data;
        refresh_task_list();
    }
    // 渲染指定详细信息
    function render_task_detail(index) {
        if(index === undefined || !task_list[index])
            return;
        var item = task_list[index];

        console.log('item',item);
        var tpl =
        '<form>' +
            '<div class="content">' +
                    item.content +
           '</div>' +
               '<div>' +
                  '<input style="display: none;" type="text" name="content" value="' + item.content + '"></inpu>' +
              '</div>'+
           '<div>' +
           '<div class="desc">' +
           '<textarea name="desc" > '+ item.desc + '</textarea>' +
           '</div>' +
           '</div>' +
           '<div class="remind">' +
           '<input name="remind_date" type="date">' +
           '</div>' +
            '<div><button type="submit">更新</button></div>' +
       '</form>';

        $task_detail.html(null);
        $task_detail.html(tpl);
        $update_form = $task_detail.find('form');
        // console.log('$update_form', $update_form);
        $task_detail_content = $update_form.find('.content');
        $task_detail_content_input = $update_form.find('[name=content]');

        $task_detail_content.on('dblclick', function () {
            // console.log('1',1);
            $task_detail_content_input.show();
            $task_detail_content.hide();
        })


        $update_form.on('submit',function (e) {
            /*禁止提交，防止快速更新的输出log*/
            e.preventDefault();
            // console.log('1',1);
            var data = {};
            data.content = $(this).find('[name = content]').val();
            data.desc = $(this).find('[name = desc]').val();
            data.remaind_date = $(this).find('[name = remind_date]').val();
            // console.log('data',data);
            /*写入数据到localStorge里面*/
            update_task(index, data);
        })
    }
    function hide_task_detail() {
        $task_detail.hide();
        $task_detail_mask.hide();
    }

    function listen_task_delete() {
        // 添加事件之后，要监听删除特定元素

        $task_delete_trigger.on('click',function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');
            var tmp = confirm('确定删除');
            tmp ? task_delete(index) : null;
            // console.log('$item_data(index)', $item.data('index'));
            // 之后需要更新文档流
        })
    }

     function add_task(new_task) {
        // console.log('task_list',task_list);
         task_list.push(new_task)
         // 更新localstoreage
         store.set('task_list',task_list);
         // store.clear();
         refresh_task_list();
         return true;
     }

     // 删除之后刷新loalStorage数据并渲染模板item
    function refresh_task_list() {
        store.set('task_list',task_list);
        render_task_list();
    }
    // 删除一条Task
     function task_delete(index) {
        // 如果没index，或不存在，则直接返回
         if(index === undefined || !task_list[index]) return;
         delete task_list[index];
         // 更新
         refresh_task_list();
     }

    function init() {
        task_list = store.get('task_list')  || [];
        if(task_list.length)
            render_task_list();
    }

    function render_task_list() {
        // console.log('1',1);
        var $task_list = $('.task-list');
        $task_list.html('');
        for(var i = 0;i < task_list.length; i++){
            // 渲染多条的时候传入index i
            var $task = render_task_item(task_list[i], i);
            $task_list.append($task);
        }
        $task_delete_trigger  = $('.action.delete')
        $task_detail_trigger = $('.action.detail')
        listen_task_delete();
        listen_task_detail();
    }
    function render_task_item(data, index) {
        if(!data || !index) return;
        var list_item_tpl =
            ' <div class="task-item" data-index = "' + index + '">' +
            '<span><input type="checkbox"></span>' +
            '<span class="task-content">'+ data.content +'</span>' +
                '<span class="floatR">' +
                    '<span class="action delete"> 删除 </span>' +
                    '<span class="action detail"> 详细 </span>' +
            '   </span>' +
            '</div>';
        return $(list_item_tpl)
    }
})();