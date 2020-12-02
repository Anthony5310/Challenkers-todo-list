package main

import (
  "html/template"
  "net/http"
)

var tpl *template.Template

func init(){
  tpl = template.Must(template.ParseGlob("templates/*.html"))
}

func main(){
  http.HandleFunc("/", home)
  http.ListenAndServe(":8080", nil)
}

func home(w http.ResponseWriter, r *http.Request){
  tpl.ExecuteTemplate(w, "index.html", nil);
}
