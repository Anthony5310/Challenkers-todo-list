# Challenkers-todo-list
Réalisation d'une todo-list

Initialisation du serveur http en Golang:
  go run todolist.go

Fonctionnalités:
  Possibilité de créer une tâche en renseignant son intitulé ainsi que sa deadline.
  Une fois créée, une tâche peut être:
    - Supprimée
    - Modifiée. Possibilité de changer son intitulé et sa deadline
  L'interaction avec une tâche se fait via des clics:
    - Premier clic, la tâche est en cours
    - Deuxième clic, la tâche est terminée
    - Troisième clic, la tâche redevient une tâche à faire
    etc...
  Lorsque la deadline est dépassée, la tâche est signalée comme "En retard".
  Possibilité de rechercher une tâche dans la barre de recherche.

Implémentation:
  En ce qui concerne l'implémentation, le programme todolist.go stocke la liste de tâches et écoute sur l'adresse localhost:8080. Elle récupère les requêtes http générées en jQuery afin de réaliser les différentes actions. A chaque action, le serveur traite l'information, met à jour la liste et encode la liste sous un format json accessible à l'adresse http://localhost:8080/todolist qui sera ensuite récupérée via une requête AJAX afin de mettre à jour la view.
