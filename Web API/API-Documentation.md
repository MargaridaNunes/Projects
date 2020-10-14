#  CIBORG (Chelas Internet BOaRd Games) API documentation.

The base part of the URI path for the bundles API is `/ciborg/api`

The following sections describe each API endpoint.

## Create User

```http
POST /users
```

- Request:
  - Headers:
      - Content-Type: application/json
  - Body example:
    ```json
      {
        "username" : "userName",
        "password" : "userPassword",
        "groups" : []
      }
    ```

- Response:
  - Success:
    - Status code: 201
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "status": "user Created"
				}
      ```
  - Errors:
    - Status code: 400
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "error": "Invalid Parameter : paramName"
        }
      ```

  
---

## Login

```http
POST /login
```

- Request:
  - Headers:
      - Content-Type: application/json
  - Body example:
    ```json
      {
        "username" : "userName"
      }
    ```

- Response:
  - Success:
    - Status code: 201
    - Headers:
      - Content-Type: application/json
    - Body : none
  - Errors:
    - Status code: 401
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "error": "Unauthorized"
        }
      ```

  
---

## Logout

```http
PUT /auth/logout
```

- Request:
  - Headers:
      - Content-Type: application/json
  - Body : none

- Response:
  - Success:
    - Status code: 201
    - Headers:
      - Content-Type: application/json
    - Body : none
    - Errors:
    - Status code: 401
    - Content-Type: application/json
    - Body example:
      ```json
        {
          "error": "Unauthorized"
        }
      ```

  
---

## Obtain popular games

```http 
GET /games
```
- Request:
  - Body: none
- Response:
  - Success:
    - Status code: 200
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json 
      {
          "games": [
            {
              "id": "game1id",
              "name": "game1name",
              "image_url": "game1url.com", 
              "max_playtime": 120,
              "description": "game1description"
            },
              ...
          ]
        }
        ```

---


## Obtain a specific game
```http
GET /games/:name
```
- Request:
  - Body: none
  - Path Parameters :
    - name: Game name
- Response:
  - Success:
    - Status code: 200
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
           "games" : [
          {
              "id": "game1id",
              "name": "game1name",
              "image_url": "game1url.com", 
              "max_playtime": 120,
              "description": "game1description"
         },
            ...
         ]
        }
        ```
  - Errors:
      - Status code: 404
      - Headers:
        - Content-Type: application/json
      - Body example:
        ```json
          {
            "error": "Resource not found"
          }
        ```

---

## Manage groups of favorite games 

### Create group 

```http
POST /auth/groups
```

- Request:
  - Headers:
      - Content-Type: application/json
  - Body example:
    ```json
      {
        "name": "group1",
        "description": "description of group 1",
        "games" : []
      }
    ```

- Response:
  - Success:
    - Status code: 201
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "status" : "Group created",
          "id" : "id"
        }
      ```
  - Errors:
    - Status code: 400
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "error": "Invalid Parameter : paramName"
        }
      ```

  
---

### Edit group 

```http
PUT /auth/groups/:id
```

- Request:
  - Headers:
      - Content-Type: application/json
  - Path Parameters :
    - id : group id
  - Body example:
    ```json
      { 
        "name": "newGroupName",
        "description": "new description",
        "games" : [
          {
              "id": "game1id",
              "name": "game1name",
              "image_url": "game1url.com", 
              "max_playtime": 120,
              "description": "game1description"
         },
            ...
         ]

      }
    ```

- Response:
  - Success:
    - Status code: 200
    - Headers:
        - Content-Type: application/json
    - Body example:
      ```json
        {
          "status" : "Group edited"
        }
      ```

  - Errors:
    - Status code: 400
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "error": "Invalid Parameter : paramName"
        }
      ```
    - Status code: 404
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "error": "Resource not found"
        }
      ```
  
---

### Get all groups 
```http 

GET /auth/groups
```
- Request:
  - Body: none
- Response:
  - Success:
    - Status code: 200
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json 
      {
          "groups": [
            {
              "id" : "groupId",
              "name": "groupName",
              "description": "group description",
              "games" : ["game1id", "game2id", ... ]
            },
            ...
          ]
        }
        ```


---

### Get group detail
```http 

GET /auth/groups/:id
```
- Request:
  - Body: none
  - Path Parameters :
    - id: group id
- Response:
  - Success:
    - Status code: 200
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json 
      {
          "group" : 
            {
              "id" : "groupId",
              "name": "groupName",
              "description": "group description",
              "games" : [
                {
                  "id" : "game1id",
                  "name" : "game1",
                  "max_playtime": 120,
                  "image_url" : "game1url.com",
                  "description" : "game1 description"
                },
                ...
              ]
            },
        }
        ```
  - Error :     
    - Status code: 404
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "error": "Resource not found"
        }
      ```

---

### Add game to group

```http
PUT /auth/groups/:id/games
```

- Request:
  - Headers:
      - Content-Type: application/json
  - Path Parameters :
    - id: group id
  - Body : 
    ```json
    {
      "name": "groupName",
      "description": "group description",
      "games" : ["game1id", "game2id", ... ]
    }
    ```
- Response:
  - Success:
    - Status code: 201
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "status" : "Game Added"
        }
      ```
  - Errors:
    - Status code: 404
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "error": "Resource not found"
        }
      ```
  
---

### Delete a game from group

```http
DELETE /auth/groups/:id/games/:idGame
```

- Request:
  - Path parameters:
    - id: Group id
    - idGame : Game id
  - Headers:
      - Content-Type: application/json
  - Body: none

- Response:
  - Success:
    - Status code: 200
    - Headers:
      - Content-Type: application/json
    - Body example:
 
    ```json
      {
        "status" : "Game Deleted"
      }
    ```

  - Errors:
    - Status code: 404
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "error": "Resource not found"
        }
      ```
  
---

### Get games in group within time
```http 

GET /auth/groups/:id/games?minimum_time=120&maximum_time=140
```
- Request:
  - Path Parameters :
    - id: group id
- Response:
  - Success:
    - Status code: 200
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json 
      {
          "games" : [
                {
                  "id" : "game1id",
                  "name" : "game1",
                  "max_playtime": 120,
                  "image_url" : "game1url.com",
                  "description" : "game1 description"
                },
                {
                  "id" : "game2id",
                  "name" : "game2",
                  "max_playtime": 130,
                  "image_url" : "game2url.com",
                  "description" : "game2 description"
                },
                {
                  "id" : "game3id",
                  "name" : "game3",
                  "max_playtime": 140,
                  "image_url" : "game3url.com",
                  "description" : "game3 description"
                },
                ...
              ]
        }
        ```
  - Error :
    - Status code: 400
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "error": "Invalid Parameter : paramName"
        }
      ```
           
    - Status code: 404
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "error": "Resource not found"
        }
      ```

### Delete group 

```http
DELETE /i5Oqu5VZgP/groups/:id
```

- Request:
  - Headers:
      - Content-Type: application/json
  - Body: none
  - Path Parameters :
    - id: Game id

- Response:
  - Success:
    - Status code: 200
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "status" : "Group deleted"
        }
      ```
  - Errors:
    - Status code: 404
    - Headers:
      - Content-Type: application/json
    - Body example:
      ```json
        {
          "error": "Resource not found"
        }
      ```
      
## Common Error Handling

This section describes the error handling that is done in every endpoint that produces these errors. This is presented in a separate section to avoid repeating these descriptions wherever it applies.

- Status code: 500
- Headers:
    - Content-Type: application/json
- Body example:
  ```json
    {
      "error": "Internal Error"
    }
  ```

- Status code: 503
- Headers:
    - Content-Type: application/json
- Body example:
  ```json
    {
      "error": "Service Unavailable"
    }
  ```

