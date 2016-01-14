/*eslint-env node */
/* eslint quotes: [2, "single"], no-console: 0 */

var path = require('path');
var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var serve = require('koa-static');
var render = require('koa-ejs');
var router = require('koa-router')();

var app = koa();
var items = [];

render(app, {
  root: path.join(__dirname, 'templates'),
  viewExt: 'html',
  cache: false,
  debug: true
});

router
  .get('/', function *() {
    yield this.render('app', { items: JSON.stringify(items), env: process.env.NODE_ENV });
  })
  .put('/api/state', function *() {
    items = this.request.body;
    this.status = 204;
  });

app
  .use(bodyParser())
  .use(serve(path.join(__dirname, 'dist')))
  .use(router.routes())
  .use(router.allowedMethods());

console.log('Listening on 3000');
app.listen(3000);
