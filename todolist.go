package main

import (
	"encoding/json"
	//"fmt"
  "net/http"
)

type Task struct{
  Id int
  Name string
  Achieved bool
}

func main() {
  //Création de la liste de Task, vide par défault
  TodoList := []Task{}
  newTask := Task{Id: 1, Name: "Dormir", Achieved: false}
  TodoList = append(TodoList, newTask)
  //Chemin des fichiers du site
  fs := http.FileServer(http.Dir("templates/"))
  http.Handle("/static/", http.StripPrefix("/static/", fs))
  //Page d'accès au données de la todolist
  http.HandleFunc("/todolist", func(w http.ResponseWriter, r *http.Request) {
    json.NewEncoder(w).Encode(TodoList)
  })
  http.ListenAndServe(":8080", nil)
}
