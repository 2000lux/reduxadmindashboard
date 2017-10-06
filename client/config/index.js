const path = require('path')
const debug = require('debug')('app:config')

/** Environments */
if(process.env.NODE_ENV === 'production') {

  server_host = 'controlfws.tinkalawinka.com'
  server_port = 80
  compiler_public_path = '/'

} else {

  server_host = 'localhost'
  server_port = 3002
  compiler_public_path = 'http://' + server_host + ':' + server_port + '/dist/'
}

compiler_public_path = '/'

debug('ENV:' + process.env.NODE_ENV)
debug('HOST: ' + server_host)

debug('Creating default configuration.')
// ========================================================
// Default Configuration
// ========================================================
const config = {
  env : 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base  : path.resolve(__dirname, '..'),
  dir_client : './src',
  dir_static : './src/Layout/static',
  dir_dist   : '../public',
  dir_test   : './tests',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host : server_host,
  server_port : server_port,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_babel : {
    cacheDirectory : true,
    plugins        : ['transform-runtime'],
    presets        : ['es2015', 'react', 'stage-0']
  },
  compiler_hash_type       : 'hash',
  compiler_fail_on_warning : false,
  compiler_quiet           : false,
  compiler_public_path     : compiler_public_path,
  compiler_stats           : {
    chunks : false,
    chunkModules : false,
    colors : true
  },
  compiler_vendors : [
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'redux'
  ],
}

// ------------------------------------
// Validate Vendor Dependencies
// ------------------------------------
const pkg = require('../package.json')

config.compiler_vendors = config.compiler_vendors
  .filter((dep) => {
    if (pkg.dependencies[dep]) return true

    debug(
      `Package "${dep}" was not found as an npm dependency in package.json; ` +
      `it won't be included in the webpack vendor bundle.
       Consider removing it from \`compiler_vendors\` in ~/config/index.js`
    )
  })

module.exports = config
