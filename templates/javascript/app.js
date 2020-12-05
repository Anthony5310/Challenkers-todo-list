$(document).ready(function(){
  getList(null);

  //Mise a jour de la list toutes les minutes
  var call = setInterval(getList, 100000);

  //Ajout d'une tache
  $("#add-task-btn").click(function(){
    //Récupération du nom et de la deadline de la tache
    var taskTitle = $("#task-title").val();
    var time = $("#task-time").val();

    //Utilisation d'expressions réguliere pour valider la saisie utilisateur
    var patternTask = new RegExp('^[a-zA-Z0-9]{1,}.*$');
    var patternTime = new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');
    if(patternTask.test(taskTitle) && patternTime.test(time)){
      //Récupération des heures et minutes
      var hours = time.split(":")[0];
      var minutes = time.split(":")[1];
      //Envoi d'une requête http à todolist.go
      $.get("/addtask", {add: taskTitle, hr: hours, min: minutes});
      getList(null);//Mise à jour de la list
    }
  })

  //Affichage de la clé selon le mot clé spécifié
  $("#search-word").change(function(){
    getList($(this).val())
  });

  //Quitter le menu de modification de tâche
  $(".quit-menu").click(function(){
    $("#modify-menu").css("display", "none");
  })
});

//Fonction principale de récupération de la liste (json) et écriture dans le DOM
function getList(keyword){
  var server = "http://localhost:8080/";
  //On supprime l'affichage actuel et on affiche la liste à jour
  $(".task-list").empty();
  $.getJSON(server+"todolist", function(data){
    //Si aucune tâche n'est dans la to-do list
    if (!data){
      $(".task-list").append("<p>Aucune tâche en cours</p>");
    }
    else {
      $.each(data, function(i, item){
        if (keyword){
          //Si un mot clé est spécifié, le pattern permet de tester les tâches contenant le mot clé
          var patternItem = new RegExp('^.*'+keyword+'.*$');
        }else {
          //Sinon, tous les noms sont acceptés
          var patternItem = new RegExp('^.*$');
        }
        if (patternItem.test(item.Name)){ //Test du nom selon le pattern de la RegEx
          //Calcul et conversion du delta time
          var currentDate = new Date();
          var deadline = new Date(parseInt(item.Deadline)*1000);
          var dateDiff = deadline.getTime()-currentDate.getTime();
          tmp = Math.floor(dateDiff/1000/60);
          minDiff = tmp % 60;
          tmp = Math.floor(dateDiff/1000/60/60);
          hrDiff = tmp % 24;
          //Ecriture dans le DOM en fonction de l'état de la tâche
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
                timeStatus = '<div class="late">En retard</div>';
              }else {
                minDiff = ("0"+minDiff).slice(-2);//Format de l'affichage à 2 digits. Ex: 2 -> 02
                if (hrDiff < 1) {
                  timeValue = minDiff+" min";
                }else {
                  hrDiff = ("0"+hrDiff).slice(-2);
                  timeValue = hrDiff+'H'+minDiff;
                }
                timeStatus = '<div class="no-started">'+timeValue+'</div>';
              }
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
//Fonction envoyant des requêtes http au controller
//Marquer un tâche comme accomplie
$(document).on("click", ".task", function(){
  //Récupération du numéro de l'id de la tâche
  var task = $(this).attr("id");
  var id = task.split("-")[1];
  $.get("/achievetask", {id: id});
  getList(null);//Mise à jour de la list
})

//Supprimer une tâche
$(document).on("click", ".del-task", function(){
  var task = $(this).attr("id");
  var id = task.split("-")[1];
  $.get("/deltask", {id: id});
  getList(null);//Mise à jour de la list
})

//Modifier une tâche
$(document).on("click", ".modify-task", function(){
  //Affichage du menu de modification
  $("#modify-menu").css("display","block");
  $(".modify-content").empty();
  var taskId = $(this).attr("id");
  var content = '<p>Nouveau nom de la tâche</p><input type=text id="new-name">\
  <p>Nouvelle deadline</p><input type=time id="new-time"><button class="btn-modify" id="'+taskId+'">Modifier</button>';
  $(".modify-content").append(content);
})

//Envoyer la modification d'une tache
$(document).on("click", ".btn-modify", function(){
  var task = $(this).attr("id");
  var id = task.split("-")[1];
  //Récupération des valeurs dans les champs pour le nouveau nom et la nouvelle deadline
  var taskTitle = $("#new-name").val();
  var time = $("#new-time").val();
  //Vérification de la saisie utilisateur
  var patternTask = new RegExp('^[a-zA-Z0-9]{1,}.*$');
  var patternTime = new RegExp('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$');
  if(patternTask.test(taskTitle) && patternTime.test(time)){
    //Même principe que pour l'ajout d'une tâche
    var hours = time.split(":")[0];
    var minutes = time.split(":")[1];
    $.get("/modify", {id: id, name: taskTitle, hr: hours, min: minutes});
    getList(null);//Mise à jour de la list
    $("#modify-menu").css("display","none");
  }
});
