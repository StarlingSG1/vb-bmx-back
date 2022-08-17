# snoopchat-backend

### API CALL | ERROR

##### SAMPLE :

```
api.get("url", (req, res)=> {
    try {
        ...
        res.status(CODE).json({data: {data_name: data}})
    } catch (error) {
        ...
        res.status(CODE).json(error: {message: error_msg, status: error_status})
    }
})
```

### GITHUB

#### Les Branches

Pour les branches, utilisez la nommanclature suivante: `feature-<le-nom>`.

#### Les Commits

Pour une meilleure cohérence des commits, le format suivant sera appliqué:

##### format: `[type] commentaire`

##### Les types:

```
[func] mon commentaire pour l’ajout d’une fonctionnalité
[edit] pour la modification d’une fonctionnalité
[del] pour la suppression d’une fonctionnalité ou fichier
[fix] pour la correction d’un bug
[refa] pour du refactor de code
[misc] quand aucun des tags précédant ne correspond à la tâche
```

#### Les Pull Request

Pour réaliser une pull request, donnez un titre cohérent avec la feature et détaillez le but de votre pull request dans le paragraphe. Mettez en reviewer Dantin Durand et tout autre personne en lien avec cette feature.

## STARTING

### .ENV

Don't forget to do the `.env` and `.babelsrc` file

### BDD

- 1 `cd docker`
- 2 `sudo docker-compose up`
- 3 `npx prisma migrate dev`

### LAUNCH

If you're using npm : `npm i`
yarn : `yarn`

##### after :

npm: `nodemon`
yarn: `yarn`

### ARCHITECTURE

- contain:

`/backend/prisma :~` -> migrations, prisma.schema

`/backend/src :~` -> helpers, middlewares, routes, main.ts, server.ts

`/backend/src/helpers :~` -> buisiness logic

`/backend/src/helpers :~` -> all middlewares

`/backend/src/helpers :~` -> all routing system

`/backend/src/main.ts :~` -> middlewares init

## All routes are in the postman file at `/postman/...`
