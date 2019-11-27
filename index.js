'use strict';

const Chalk = require('chalk');
const COL = require('columnify');

module.exports = {
  pkg: require('./package.json'),
  register: async function (server, options) {
    let data = [];
    let opt = Object.assign({
      method: true,
      path: true,
      auth: false,
      tags: true,
      description: true,
      handler: false
    }, options);
    let routes = server.table();
    
    routes.forEach((f) => {
      let route = {};
      if (opt.method) {
        route.method = Chalk.green(f.method.toUpperCase());
      }
      if (opt.path) {
        if (f.params.length === 0) {
          route.path = f.path;
        } else {
          route.path = f.path.replace(/({.*?})/g, Chalk.gray('$1'))
        }
      }
      if (opt.auth 
          && typeof(f.settings.auth) !== 'undefined') {
        route.auth = f.settings.auth.strategies;
      }
      if (opt.tags) {
        route.tags = Chalk.blueBright(f.settings.tags);
      }
      if (opt.description) {
        route.description = Chalk.yellow(f.settings.description);
      }
      if (opt.handler) {
        route.handler = f.settings.handler.name
      }
      data.push(route);
    });
   
    // TEMPORARY COVERAGE WAIVER
    //
    // This line is tested in that we check that the console output
    // created appears in sorted fashion even though the routes
    // are not added in sorted fashion. 
    //
    // Tests should be written against the exposed interface 
    // and behavior, not digging into internal implementations. 
    //
    // Still looking for a better way to test that is not so brittle
    // and, hopefully, that the coverage engine picks up on.
    //
    //$lab:coverage:off$
    data.sort((l, r) => { return (l.path > r.path) ? 1 : -1; });
    //$lab:coverage:on$
   
    console.log(Chalk.underline.cyan(`\n\nhttp://${server.info.host}:${server.info.port}`));
    console.log(Chalk.gray(`--------------------------------------------------------------------------------`));
    console.log(COL(data));
  }
};