package main

import (
    "html/template"
    "net/http"
    "strconv"
    "fmt"
)

type task struct {
    Title string
    Id int
    Done  bool
}

type todoList struct {
    PageTitle string
    List     []task
}

func main() {
    currentId := 3
    fs := http.FileServer(http.Dir("templates/"))
    http.Handle("/static/", http.StripPrefix("/static/", fs))
    data := todoList{
        List: []task{
            {Title: "Premiere tache", Id: 0, Done: false},
            {Title: "Deuxième tache à effectuer impérativement", Id: 1, Done: false},
            {Title: "Dernière tache", Id: 2, Done: false},
        },
    }


      tmpl := template.Must(template.ParseFiles("templates/index.html"))
      http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        query := r.URL.Query()
        doneTask:= query.Get("done")
        addTask:= query.Get("add")
        idTask, errDone := strconv.Atoi(doneTask)
        if errDone == nil{
          data.List[idTask].Done = true
        }
        if len(addTask)>0{
          fmt.Printf(addTask)
          newTask := task{Title: addTask, Id: currentId, Done:false}
          currentId = currentId + 1
          data.List = append(data.List, newTask)
        }
        tmpl.Execute(w, data)
      })

      http.ListenAndServe(":8080", nil)
}
