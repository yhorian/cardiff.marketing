'use strict'
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        var desc = Object.getOwnPropertyDescriptor(m, k)
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k]
            },
          }
        }
        Object.defineProperty(o, k2, desc)
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k
        o[k2] = m[k]
      })
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v })
      }
    : function (o, v) {
        o['default'] = v
      })
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod
    var result = {}
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k)
    __setModuleDefault(result, mod)
    return result
  }
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod }
  }
Object.defineProperty(exports, '__esModule', { value: true })
exports.startServerFromConfig = void 0
const express_1 = __importDefault(require('express'))
const http_proxy_middleware_1 = require('http-proxy-middleware')
const path = __importStar(require('path'))
const client_1 = require('./client')
const manager_1 = require('./manager')
const config_1 = require('./config')
const constants_1 = require('./constants')
const static_server_1 = require('./static-server')
const locreq_1 = __importDefault(require('locreq'))
const locreq = (0, locreq_1.default)(__dirname)
const DEFAULT_TARGET = 'http://localhost:8000'
if (process.env.NODE_ENV === 'production') {
  process.on('unhandledRejection', reason => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
  })
}
async function startServerFromConfig({
  configPath,
  componentsFolderPath,
  url,
  ...args
}) {
  const config = (0, config_1.getConfig)(configPath)
  let componentsPath = ''
  if (componentsFolderPath) {
    componentsPath = path.resolve(componentsFolderPath)
  } else {
    console.log('Components folder path not provided')
  }
  const { hostname, port, trackPath, components } = config
  if ('customComponentPath' in args && args.customComponentPath) {
    console.log(
      `⚠️  Custom component ${args.customComponentPath} will run with all permissions enabled, use webcm.config.ts to change what permissions it gets`
    )
    components.push({
      path: path.resolve(args.customComponentPath),
      permissions: Object.values(constants_1.PERMISSIONS),
      settings: args.customComponentSettings || {},
    })
  }
  if (url) {
    if (!(url.startsWith('http://') || url.startsWith('https://'))) {
      url = 'http://' + url
    }
    config.target = url
  } else if (!config.target) {
    const server = new static_server_1.StaticServer(8000)
    server.start()
    console.log('Started a demo static server at localhost:8000')
    config.target = DEFAULT_TARGET
  }
  const manager = new manager_1.ManagerGeneric({
    components,
    trackPath,
    componentsFolderPath: componentsPath,
  })
  await manager.init()
  const getDefaultPayload = () => ({
    pageVars: [],
    fetch: [],
    execute: [],
    return: undefined,
  })
  const handleClientCreated = (req, _, clientGeneric) => {
    const cookieName = 'webcm_clientcreated'
    const eventName = 'clientcreated'
    let clientAlreadyCreated = clientGeneric.cookies.get(cookieName) || ''
    if (!manager.listeners[eventName]) return
    for (const componentName of Object.keys(manager.listeners[eventName])) {
      if (clientAlreadyCreated.split(',')?.includes(componentName)) continue
      const event = new manager_1.MCEvent(eventName, req)
      event.client = new client_1.Client(componentName, clientGeneric)
      clientAlreadyCreated = Array.from(
        new Set([...clientAlreadyCreated.split(','), componentName])
      ).join(',')
      clientGeneric.set(cookieName, clientAlreadyCreated)
      manager.listeners[eventName][componentName]?.forEach(fn => fn(event))
    }
  }
  const handleEvent = async (eventType, req, res) => {
    res.payload = getDefaultPayload()
    const clientGeneric = new client_1.ClientGeneric(req, res, manager, config)
    handleClientCreated(req, res, clientGeneric)
    if (manager.listeners[eventType]) {
      // slightly alter ecommerce payload
      if (eventType === 'ecommerce') {
        req.body.payload.ecommerce = { ...req.body.payload.data }
        delete req.body.payload.data
      }
      const event = new manager_1.MCEvent(eventType, req)
      for (const componentName of Object.keys(manager.listeners[eventType])) {
        event.client = new client_1.Client(componentName, clientGeneric)
        await Promise.all(
          manager.listeners[eventType][componentName].map(fn => fn(event))
        )
      }
      res.payload.execute.push(manager.getInjectedScript(clientGeneric))
    }
    return res.end(JSON.stringify(res.payload))
  }
  const handleClientEvent = async (req, res) => {
    res.payload = getDefaultPayload()
    const event = new manager_1.MCEvent(req.body.payload.event, req)
    const clientGeneric = new client_1.ClientGeneric(req, res, manager, config)
    const clientComponentNames = Object.entries(
      clientGeneric.webcmPrefs.listeners
    )
      .filter(([, events]) => events.includes(req.body.payload.event))
      .map(([componentName]) => componentName)
    for (const component of clientComponentNames) {
      event.client = new client_1.Client(component, clientGeneric)
      try {
        await manager.clientListeners[
          req.body.payload.event + '__' + component
        ](event)
      } catch {
        console.error(
          `Error dispatching ${req.body.payload.event} to ${component}: it isn't registered`
        )
      }
    }
    res.payload.execute.push(manager.getInjectedScript(clientGeneric))
    res.end(JSON.stringify(res.payload))
  }
  // 'event', 'ecommerce' 'pageview', 'client' are the standard types
  // 'remarketing', 'identify' or any other event type
  const handleTrack = (req, res) => {
    const eventType = req.body.eventType
    if (eventType === 'client') {
      return handleClientEvent(req, res)
    } else {
      return handleEvent(eventType, req, res)
    }
  }
  const handleRequest = (req, clientGeneric) => {
    if (!manager.listeners['request']) return
    const requestEvent = new manager_1.MCEvent('request', req)
    for (const componentName of Object.keys(manager.listeners['request'])) {
      requestEvent.client = new client_1.Client(componentName, clientGeneric)
      manager.listeners['request'][componentName]?.forEach(fn =>
        fn(requestEvent)
      )
    }
  }
  const app = (0, express_1.default)().use(express_1.default.json())
  app.set('trust proxy', true)
  // Mount WebCM endpoint
  app.post(trackPath, handleTrack)
  // Mount components endpoints
  for (const route of Object.keys(manager.mappedEndpoints)) {
    app.all(route, async (req, res) => {
      const response = manager.mappedEndpoints[route](req)
      for (const [headerName, headerValue] of response.headers.entries()) {
        res.set(headerName, headerValue)
      }
      res.status(response.status)
      let isDone = false
      const reader = response.body?.getReader()
      while (!isDone && reader) {
        const { value, done } = await reader.read()
        if (value) res.send(Buffer.from(value))
        isDone = done
      }
      res.end()
    })
  }
  // Mount components proxied endpoints
  for (const component of Object.keys(manager.proxiedEndpoints)) {
    for (const [path, proxyTarget] of Object.entries(
      manager.proxiedEndpoints[component]
    )) {
      const proxyEndpoint = '/webcm/' + component + path
      app.all(proxyEndpoint + '*', async (req, res, next) => {
        const proxy = (0, http_proxy_middleware_1.createProxyMiddleware)({
          target: proxyTarget + req.path.replace(proxyEndpoint, ''),
          ignorePath: true,
          followRedirects: true,
          changeOrigin: true,
        })
        proxy(req, res, next)
      })
    }
  }
  // Mount static files
  for (const [filePath, fileTarget] of Object.entries(manager.staticFiles)) {
    app.use(
      filePath,
      express_1.default.static(path.join(componentsPath, fileTarget))
    )
  }
  // Listen to all normal requests
  app.use('**', (req, res, next) => {
    res.payload = getDefaultPayload()
    const clientGeneric = new client_1.ClientGeneric(req, res, manager, config)
    const proxySettings = {
      target: config.target,
      changeOrigin: true,
      selfHandleResponse: true,
      onProxyReq: (_proxyReq, req, _res) => {
        handleRequest(req, clientGeneric)
      },
      onProxyRes: (0, http_proxy_middleware_1.responseInterceptor)(
        async (responseBuffer, _proxyRes, proxyReq, _res) => {
          if (proxyReq.headers['accept']?.toLowerCase().includes('text/html')) {
            let response = responseBuffer.toString('utf8')
            response = await manager.processEmbeds(response)
            response = await manager.processWidgets(response)
            return response.replace(
              '<head>',
              `<head><script>${manager.getInjectedScript(
                clientGeneric
              )};webcm._processServerResponse(${JSON.stringify(
                res.payload
              )})</script>`
            )
          }
          return responseBuffer
        }
      ),
    }
    const proxy = (0, http_proxy_middleware_1.createProxyMiddleware)(
      proxySettings
    )
    proxy(req, res, next)
  })
  console.info(
    '\nWebCM, version',
    process.env.npm_package_version || locreq('package.json').version
  )
  app.listen(port, hostname)
  console.info(
    `\n🚀 WebCM is now proxying ${config.target} at http://${hostname}:${port}\n\n`
  )
}
exports.startServerFromConfig = startServerFromConfig
