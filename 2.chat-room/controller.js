const fs = require('fs');
const path = require('path');

// add url-route in /controllers:

function addMapping(router, mapping) {
  let p;
  for (var url in mapping) {
    if (url.startsWith('GET ')) {
      p = url.substring(4);
      router.get(p, mapping[url]);
      console.log(`register URL mapping: GET ${p}`);
    } else if (url.startsWith('POST ')) {
      p = url.substring(5);
      router.post(p, mapping[url]);
      console.log(`register URL mapping: POST ${p}`);
    } else if (url.startsWith('PUT ')) {
      p = url.substring(4);
      router.put(p, mapping[url]);
      console.log(`register URL mapping: PUT ${p}`);
    } else if (url.startsWith('DELETE ')) {
      p = url.substring(7);
      router.del(p, mapping[url]);
      console.log(`register URL mapping: DELETE ${p}`);
    } else {
      console.log(`invalid URL: ${url}`);
    }
  }
}

function addControllers(router, dir) {
  fs.readdirSync(path.join(__dirname, dir)).filter((f) => {
      return f.endsWith('.js');
    }).forEach((f) => {
      console.log(`process controller: ${f}...`);
      let mapping = require(path.join(__dirname, dir, f));
      addMapping(router, mapping);
    });
  }

  module.exports = function(dir) {
    let
      controllers_dir = dir || 'controllers',
      router = require('koa-router')();
    addControllers(router, controllers_dir);
    return router.routes();
  };
