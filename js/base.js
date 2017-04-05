/**
 * Created by Administrator on 2017/4/4.
 */
;(function () {
    'use strict';

    var $form_add_task = $('.add-task')
        , $delete_task
        , new_task = {}
        , task_list = {}
        ;

        init();

    $form_add_task.on('submit',on_add_task_form_submit)
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

    function listen_task_delete() {
        // 添加事件之后，要监听删除特定元素
        $delete_task.on('click',function () {
            var $this = $(this);
            var $item = $this.parent().parent();
            var index = $item.data('index');
            var tmp = confirm('确定删除');
            tmp ? delete_task(index) : null;
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
     function delete_task(index) {
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
        $delete_task  = $('.action.delete')
        listen_task_delete();

    }
    function render_task_item(data, index) {
        if(!data || !index) return;
        var list_item_tpl =
            ' <div class="task-item" data-index = "' + index + '">' +
            '<span><input type="checkbox"></span>' +
            '<span class="task-content">'+ data.content +'</span>' +
                '<span class="floatR">' +
                    '<span class="action delete"> 删除 </span>' +
                    '<span class="action"> 详细 </span>' +
            '   </span>' +
            '</div>';
        return $(list_item_tpl)
    }
})();