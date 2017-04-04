/**
 * Created by Administrator on 2017/4/4.
 */
;(function () {
    'use strict';

    var $form_add_task = $('.add-task')
        , new_task = {}
        ;

    $form_add_task.on('submit',function (e) {
        // 禁用默认行为
        e.preventDefault();
        // 获取新task的值
        new_task.content = $(this).find('input[name=content]').val();
       console.log('new_task',new_task);

    })

})();