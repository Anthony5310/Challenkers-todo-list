package main

import (
	"encoding/json"
  "html/template"
	"strconv"
  "net/http"
	"time"
  //"fmt"
)

type Task struct{
  Id int
  Name string
  Achieved bool
	Started bool
	Deadline int64
}

func getIndex(id int, list []Task) int {
  for i, s:= range list {
    if (s.Id == id){
      return i
    }
  }
  return -1;
}

func removeIndex(index int, list []Task) []Task{
  if len(list) > 1 {
    return append(list[:index], list[index+1:]...)
  }else {
    return nil
  }
}

func main() {
  currentId := 0
  //Création de la liste de Task, vide par défault
  TodoList := []Task{}
	TodoList = nil;

  //Chemin des fichiers du site
  fs := http.FileServer(http.Dir("templates/"))
  http.Handle("/static/", http.StripPrefix("/static/", fs))
  //Page d'accès au données de la todolist
  http.HandleFunc("/todolist", func(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(TodoList)
  })
  //Page principale
  tmpl := template.Must(template.ParseFiles("templates/index.html"))
  http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    tmpl.Execute(w, nil)
  })

  //Ajouter une tache
  http.HandleFunc("/addtask", func(w http.ResponseWriter, r *http.Request) {
    query := r.URL.Query()
    addTask := query.Get("add")
		hrUrl := query.Get("hr")
		minUrl := query.Get("min")
		hr,_ := strconv.Atoi(hrUrl)
		min,_ := strconv.Atoi(minUrl)
		t := time.Now()
		deadline := time.Date(t.Year(), t.Month(), t.Day(), hr, min, 0, t.Nanosecond(), t.Location()).Unix();
		if len(addTask)>0{
      newTask := Task{Id: currentId, Name: addTask, Achieved: false, Started: false, Deadline: deadline}
      currentId = currentId + 1
      TodoList = append(TodoList, newTask)
    }
    json.NewEncoder(w).Encode(TodoList)
  })

  //Accomplir une tache
  http.HandleFunc("/achievetask", func(w http.ResponseWriter, r *http.Request) {
    query := r.URL.Query()
    achieveTask:= query.Get("id")
    idTask, errDone := strconv.Atoi(achieveTask)
    if errDone == nil{
      idTask = getIndex(idTask, TodoList)
      if idTask != -1 {
        if (TodoList[idTask].Achieved == true && TodoList[idTask].Started == false){
          TodoList[idTask].Achieved = false
        } else if (TodoList[idTask].Achieved == false && TodoList[idTask].Started == false){
					TodoList[idTask].Started = true
				}else if (TodoList[idTask].Achieved == true && TodoList[idTask].Started == true){
					TodoList[idTask].Achieved = false
					TodoList[idTask].Started = false
				}else {
          TodoList[idTask].Achieved = true
        }
      }
    }
    json.NewEncoder(w).Encode(TodoList)
  })

  //Supprimer une tache
  http.HandleFunc("/deltask", func(w http.ResponseWriter, r *http.Request) {
    query := r.URL.Query()
    delTask:= query.Get("id")
    idTask, errDone := strconv.Atoi(delTask)
    if errDone == nil{
      index := getIndex(idTask, TodoList);
      if index != -1 {
        TodoList = removeIndex(index, TodoList);
      }
    }
    json.NewEncoder(w).Encode(TodoList)
  })

	//Modifier une tache
  http.HandleFunc("/modify", func(w http.ResponseWriter, r *http.Request) {
    query := r.URL.Query()
		idUrl:= query.Get("id")
		idTask,_ := strconv.Atoi(idUrl)
    newName:= query.Get("name")
		hrUrl := query.Get("hr")
		minUrl := query.Get("min")
		hr,_ := strconv.Atoi(hrUrl)
		min,_ := strconv.Atoi(minUrl)
		t := time.Now()
		deadline := time.Date(t.Year(), t.Month(), t.Day(), hr, min, 0, t.Nanosecond(), t.Location()).Unix();
		if (len(newName) > 0){
			index := getIndex(idTask, TodoList);
			TodoList[index].Name = newName
			TodoList[index].Deadline = deadline
		}
		json.NewEncoder(w).Encode(TodoList)
  })
  http.ListenAndServe(":8080", nil)
}
