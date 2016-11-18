task-collector
---

Develop
---

``` sh
$ npm i
$ npm start
```

APIs
---

```
# date will be today if omitted
GET /api/tasks
GET /api/tasks?date=2016-1-1
GET /api/tasks?user=someone&date=2016-1-1
GET /api/tasks?user=someone&date=lastDay

# one user can only post once per day
POST /api/tasks {user: 'someone', content: 'anything as a string'}
```
