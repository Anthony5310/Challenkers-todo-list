$(document).ready(function(){
  getList(null);

  $("#add-task-btn").click(function(){
    var taskTitle = $("#task-title").val();
    var time = $("#task-time").val();

    var patternTask = new RegExp('^[a-zA-Z0-9]{1,}.*$');
    var patternTime = new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');
    if(patternTask.test(taskTitle) && patternTime.test(time)){
      var hours = time.split(":")[0];
      var minutes = time.split(":")[1];
      console.log(hours+" "+minutes);
      $.get("/addtask", {add: taskTitle, hr: hours, min: minutes});
      getList(null);
    }
  })

  $("#search-word").change(function(){
    getList($(this).val())
  });

  $(".quit-menu").click(function(){
    $("#modify-menu").css("display", "none");
  })
});

function getList(keyword){
  var server = "http://localhost:8080/"
  $(".task-list").empty();
  $.getJSON(server+"todolist", function(data){
    if (!data){
      $(".task-list").append("<p>Aucune tâche en cours</p>");
    }
    else {
      $.each(data, function(i, item){
        if (keyword){
          var patternItem = new RegExp('^.*'+keyword+'.*$');
        }else {
          var patternItem = new RegExp('^.*$');
        }
        if (patternItem.test(item.Name)){
          var currentDate = new Date();
          var deadline = new Date(parseInt(item.Deadline)*1000);
          var dateDiff = deadline.getTime()-currentDate.getTime();
          tmp = Math.floor(dateDiff/1000/60);
          minDiff = tmp % 60;
          tmp = Math.floor(dateDiff/1000/60/60);
          hrDiff = tmp % 24;
          var newTask;
          newTask = '<div class="item-task">';
          if (item.Achieved == true){
            newTask +='<div class="task achieved" id="task-'+item.Id+'">\
                <div class="task-complite"></div>\
                <p>'+item.Name+'</p></div>\
                <div class="finished">Terminé</div>';
          }else{
            var timeStatus;
            var timeValue;
            if (item.Started == false){
              if (hrDiff < 0){
                timeValue = "En retard";
              }else if (hrDiff < 1) {
                timeValue = minDiff+"min";
              }else {
                timeValue = hrDiff+'H'+minDiff;
              }
              timeStatus = '<div class="no-started">'+timeValue+'</div>';
            }else {
              timeStatus = '<div class="started">En cours</div>';
            }

            if (timeStatus)
            newTask += '<div class="task" id="task-'+item.Id+'">\
                <div class="task-not-complite"></div>\
                <p>'+item.Name+'</p></div>'+timeStatus;
          }
          newTask += '<div class="options"><div class="modify-task" id="task-'+item.Id+'"></div>\
          <div class="del-task" id="task-'+item.Id+'"></div>\
          </div></div>'
          $(".task-list").append(newTask);
        }
      })
    }
  });
}

$(document).on("click", ".task", function(){
  var task = $(this).attr("id");
  var id = task.split("-")[1];
  $.get("/achievetask", {id: id});
  getList(null);
})

$(document).on("click", ".del-task", function(){
  var task = $(this).attr("id");
  var id = task.split("-")[1];
  $.get("/deltask", {id: id});
  getList(null);
})

$(document).on("click", ".modify-task", function(){
  $("#modify-menu").css("display","block");
  $(".modify-content").empty();
  var taskId = $(this).attr("id");
  var content = '<p>Nouveau nom de la tâche</p><input type=text id="new-name">\
  <p>Nouvelle deadline</p><input type=time id="new-time"><button class="btn-modify" id="'+taskId+'">Modifier</button>';
  $(".modify-content").append(content);
})

$(document).on("click", ".btn-modify", function(){
  //alert($(this).attr("id"));
  var task = $(this).attr("id");
  var id = task.split("-")[1];
  var taskTitle = $("#new-name").val();
  var time = $("#new-time").val();
  var patternTask = new RegExp('^[a-zA-Z0-9]{1,}.*$');
  var patternTime = new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');
  if(patternTask.test(taskTitle) && patternTime.test(time)){
    var hours = time.split(":")[0];
    var minutes = time.split(":")[1];
    console.log(hours+" "+minutes);
    $.get("/modify", {id: id, name: taskTitle, hr: hours, min: minutes});
    getList(null);
    $("#modify-menu").css("display","none");
  }
});
