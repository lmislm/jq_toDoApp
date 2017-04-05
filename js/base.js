/**
 * Created by Administrator on 2017/4/4.
 */
;(function () {
    'use strict';

    var $form_add_task = $('.add-task')
        , new_task = {}
        , task_list = {}
        ;

        init();

    $form_add_task.on('submit',function (e) {
        var new_task = {};
        // 禁用默认行为
        e.preventDefault();
        // 获取新task的值
        new_task.content = $(this).find('input[name=content]').val();
        // 如果新Task值为空，否则继续执行
        if(!new_task.content) return;
        // console.log('new_task',new_task);
        // // 存入新Task
        if(add_task(new_task)){
            render_task_list();
        }
        console.log('new_task.content',new_task.content);
    })
     function add_task(new_task) {
        console.log('task_list',task_list);
         task_list.push(new_task)
         // 更新localstoreage
         store.set('task_list',task_list);
         // store.clear();
         return true;
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
            var $task = render_task_tpl(task_list[i]);
            $task_list.append($task);
        }
    }
    function render_task_tpl(data) {
        var list_item_tpl =
            ' <div class="task-item">' +
            '<span><input type="checkbox"></span>' +
            '<span class="task-content">'+ data.content +'</span>' +
            '<span>delete</span>' +
            '<span>detail</span>' +
            '</div>';
        return $(list_item_tpl)
    }
})();