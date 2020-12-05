$(document).ready(function(){
  getList();

  $("#add-task-btn").click(function(){
    var taskTitle = $("#task-title").val();
    var patternTask = new RegExp('^[a-zA-Z0-9]{1,}.*$')
    if(patternTask.test(taskTitle)){
      $.get("/addtask", {add: taskTitle});
      getList();
    }
  })
});

function getList(){
  var server = "http://localhost:8080/"
  $.getJSON(server+"todolist", function(data){
    $(".task-list").empty();
    $.each(data, function(i, item){
      var newTask;
      console.log(item.Achieved+"\n");
      if (item.Achieved == true){
        newTask = '<div class="item-task">\
          <div class="task achieved" id="task-'+item.Id+'">\
            <div class="task-complite"></div>\
            <p>'+item.Name+'</p></div>\
          <div class="del-task" id="task-'+item.Id+'"></div></div>';
      }else{
        newTask = '<div class="item-task">\
          <div class="task" id="task-'+item.Id+'">\
            <div class="task-not-complite"></div>\
            <p>'+item.Name+'</p></div>\
          <div class="del-task" id="task-'+item.Id+'"></div></div>';
      }

      $(".task-list").append(newTask);
    })
  });
}

$(document).on("click", ".task", function(){
  var task = $(this).attr("id");
  var id = task.split("-")[1];
  $.get("/achievetask", {id: id});
  getList();
})

$(document).on("click", ".del-task", function(){
  var task = $(this).attr("id");
  var id = task.split("-")[1];
  $.get("/deltask", {id: id});
  getList();
})
