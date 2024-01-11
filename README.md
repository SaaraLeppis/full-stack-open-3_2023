#Full stack open

## _ undone tasks _

3.19 - 3.21 not done!!

Deployed to Render

Address is [https://myfirst-render-76ss.onrender.com](https://myfirst-render-76ss.onrender.com)

```shell
npm init
```

## package.json

to start node by

```shell
npm start
```

(instead of 'node index.js)

make script to _package.json_'s _scripts_

```json
"start": "node index.js",
```

## Express

```shell
npm install express
```

## Nodemon

When Nodemon used the restart from terminal not seeded after each change

```shell
npm install --save-dev nodemon
```

(Nodemon should be in "devDependencies" in _package.json_)

## Morgan

More about [morgan](https://github.com/expressjs/morgan)
Middleware for logging

### Notes

When using only Node (without Express) data will be changed to JSON with method **JSON.stringify**
When using Express change is made automatically and only
**.json** needed
