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
        , $checkbox_complete
        , $msg = $('.msg')
        , $msg_content = $msg.find('.msg-content')
        , $msg_confirm = $msg.find('.confirmed')
        , $alerter = $('.alerter')
        ;

        init();

    $form_add_task.on('submit',on_add_task_form_submit)
    $task_detail_mask.on('click',hide_task_detail)

    function listen_msg_event() {
        $msg_confirm.on('click',function () {
            hide_msg();
        })
    }

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
            var index;
        $('.task-item').on('dblclick',function () {
            index = $(this).data('index');
            show_task_detail(index)
            // console.log('1',1)
        })
        $task_detail_trigger.on('click',function () {
            var $this = $(this)
            var $item = $this.parent().parent();
            var index = $item.data('index');
            show_task_detail(index);
            // console.log('index',index);
        })
    }
    /*查看task详情,*/
    function show_task_detail(index) {
        /*生成详情模板*/
        render_task_detail(index);
        current_index = index;
        /*显示详情模板mask（默认隐藏*/
        $task_detail.show();
        $task_detail_mask.show();
    }
    /*，更新Task更新function的方法*/
    function update_task(index, data) {
        if(!index || !task_list[index])
            return ;

        task_list[index] = $.extend({}, task_list[index], data);
        // task_list[index] = data;
        refresh_task_list();
        // console.log('task_list[index',task_list[index]);
    }
    // 渲染指定详细信息
    function render_task_detail(index) {
        if(index === undefined || !task_list[index])
            return;
        var item = task_list[index];
        // console.log('item',item);
        var tpl =
        '<form>' +
            '<div class="content">' +
                    item.content +
           '</div>' +
               '<div>' +
                  '<input style="display: none;" type="text" name="content" value="' + item.content + '"></inpu>' +
              '</div>' +
           '<div>' +
           '<div class="desc">' +
           '<textarea name="desc" > '+ (item.desc || '') + '</textarea>' +
           '</div>' +
           '</div>' +
           '<div class="remind input-item">' +
            '<label>提醒时间</label>'+
           '<input class="datetime"  name="remind_date" type="text" value="'+ (item.remind_date || '') +'">' +
           '</div>' +
            '<div><button type="submit">更新</button></div>' +
       '</form>';
        /*替换旧模板*/
        $task_detail.html(null);
        /*选中其中from元素，之后会使用监听事件*/
        $task_detail.html(tpl);
        // $('.datatime').datetimepicker();
        $('.datetime').datetimepicker();
        $update_form = $task_detail.find('form');
        // console.log('$update_form', $update_form);
        /*选中显示Task内容元素*/
        $task_detail_content = $update_form.find('.content');
        $task_detail_content_input = $update_form.find('[name=content]');
        /*双击内容元素显示input，隐藏自己*/
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
            /*获取表单中各个input的值*/
            data.content = $(this).find('[name = content]').val();
            data.desc = $(this).find('[name = desc]').val();
            data.remind_date = $(this).find('[name = remind_date]').val();
            // console.log('data',data);
            /*写入数据到localStorge里面*/
            update_task(index, data);
        })
    }
    /*隐藏Task详情*/
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
        /*添加文本域的空字符串*/
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
        listen_msg_event();
        if(task_list.length)
            render_task_list();
        task_remind_check();
    }

    function task_remind_check() {
            // show_msg('fasfsf');
        var current_timestamp;
        var itl = setInterval(function () {
            for(var i = 0; i < task_list.length; i++){
                var item = get(i), task_timestamp;
                // console.log('item',item);
                if(!item || !item.remind_date || item.informed)
                    continue;
                current_timestamp = (new Date()).getTime();
                // console.log('current_timetamp',current_timestamp);
                task_timestamp = (new Date(item.remind_date)).getTime();
                // console.log('current_timetamp, task_timestamp',current_timestamp,task_timestamp);
                if(current_timestamp - task_timestamp >= 1){
                    update_task(i, {informed:true});
                    show_msg(item.content);
                }
            }
        },300);

    }

    function show_msg(msg) {
        if(!msg) return;
        $msg_content.html(msg);
        $alerter.get(0).play();
        $msg.show();
        // console.log('1',1);
    } function hide_msg() {
        $msg.hide();
        // console.log('1',1);
    }

    function render_task_list() {
        // console.log('1',1);
        var $task_list = $('.task-list');
        $task_list.html('');

        var complete_items = [];
        for(var i = 0;i < task_list.length; i++){
            var item = task_list[i];
            if(item && item.complete)
                // complete_items.push(item)
                complete_items[i] = item;
            else
            // 渲染多条的时候传入index i
               var $task = render_task_item(item, i);
            // $task_list.append($task);
            $task_list.prepend($task);
        }
        // console.log('complete_items',complete_items);
        for(var j =0; j < complete_items.length; j++){
            $task = render_task_item(complete_items[j], j);
            if(!$task) continue;
            $task.addClass('completed')
            $task_list.append($task);
        }

        $task_delete_trigger  = $('.action.delete')
        $task_detail_trigger = $('.action.detail')
        $checkbox_complete = $('.task-list .complete[type=checkbox]')
        listen_task_delete();
        listen_task_detail();
        listen_checkbox_complete();
    }
    
    function listen_checkbox_complete() {
        $checkbox_complete.on('click',function () {
            var $this = $(this);
            console.log('this',this);
           // var is_complete = $(this).is(':checked');
           // console.log('is_complete',is_complete)
           var index = $this.parent().parent().data('index');
           var item = get(index);
           if(item.complete){
                update_task(index,{complete: false});
                // $this.attr('checked',true);
           }else {
                update_task(index,{complete: true});
                // $this.attr('checked',false);
           }
           // console.log('item',item);
        })
    }
    
    function get(index) {
        return store.get('task_list')[index];
    }
    
    function render_task_item(data, index) {
        if(!data || !index) return;
        var list_item_tpl =
            ' <div class="task-item" data-index = "' + index + '">' +
            '<span><input class="complete" '+(data.complete ? 'checked':'')+' type="checkbox"></span>' +
            '<span class="task-content">'+ data.content +'</span>' +
                '<span class="floatR">' +
                    '<span class="action delete"> 删除 </span>' +
                    '<span class="action detail"> 详细 </span>' +
            '   </span>' +
            '</div>';
        return $(list_item_tpl)
    }
})();