#!/usr/bin/env node
'use strict'
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
/* eslint-disable no-console */
const yargs_1 = __importDefault(require('yargs'))
const server_1 = require('./server')
const helpers_1 = require('yargs/helpers')
const locreq_1 = __importDefault(require('locreq'))
const locreq = (0, locreq_1.default)(__dirname)
const crypto_1 = __importDefault(require('crypto'))
/**
 * @fileoverview Main CLI that is run via the webcm command.
 */
//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------
/**
 * Get the error message of a given value.
 */
function getErrorMessage(error) {
  // Lazy loading because this is used only if an error happened.
  const util = require('util')
  // Foolproof -- third-party module might throw non-object.
  if (typeof error !== 'object' || error === null) {
    return String(error)
  }
  // Use templates if `error.messageTemplate` is present.
  if (typeof error.messageTemplate === 'string') {
    try {
      const template = require(`../messages/${error.messageTemplate}.js`)
      return template(error.messageData || {})
    } catch {
      // Ignore template error then fallback to use `error.stack`.
    }
  }
  // Use the stacktrace if it's an error object.
  if (typeof error.stack === 'string') {
    return error.stack
  }
  // Otherwise, dump the object.
  return util.format('%o', error)
}
/**
 * Catch and report unexpected error.
 */
function onFatalError(error) {
  process.exitCode = 2
  const message = getErrorMessage(error)
  console.error(`
  Oops! Something went wrong! :(
  Webcm: ${locreq('package.json').version}
  ${message}`)
}
//------------------------------------------------------------------------------
// Execution
//------------------------------------------------------------------------------
;(async function main() {
  process.on('uncaughtException', onFatalError)
  process.on('unhandledRejection', onFatalError)
  const options = {
    config: {
      alias: 'c',
      type: 'string',
      describe: 'path to your Managed Components config',
    },
    components: {
      alias: 'mc',
      type: 'string',
      default: './components',
      describe: 'path to Managed Components folder',
    },
  }
  ;(0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .options(options)
    .command(
      '$0 [customComponentPath] [target]',
      'proxy a demo website and load the specified component on it',
      yargs => {
        return yargs
          .positional('customComponentPath', {
            type: 'string',
            description: 'the path to the entrypoint of your component',
          })
          .positional('target', {
            type: 'string',
            describe: 'the http url to direct the proxy to',
          })
      },
      argv => {
        const customSettings = Object.fromEntries(
          Object.entries(argv)
            .filter(([key]) => key.startsWith('settings_'))
            .map(([key, value]) => [
              key.replace(/^settings_/, ''),
              String(value),
            ])
        )
        if (Object.keys(customSettings).length && !argv.customComponentPath) {
          console.log(
            `Error: custom settings (${Object.keys(customSettings).join(
              ', '
            )}) passed, but no custom component specified. To use a custom component, specify the 'customComponentPath' positional argument\n\n`
          )
          yargs_1.default.showHelp()
          return
        }
        require('ts-node').register({
          files: true,
          transpileOnly: true,
          dir: __dirname,
        })
        ;(0, server_1.startServerFromConfig)({
          configPath: argv.config,
          componentsFolderPath: argv.components,
          customComponentPath: argv.customComponentPath,
          customComponentSettings: customSettings,
          url: argv.target,
        })
      }
    )
    .parse()
})().catch(onFatalError)
