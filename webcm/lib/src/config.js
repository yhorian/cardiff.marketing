"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = exports.defaultConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const path = __importStar(require("path"));
exports.defaultConfig = {
    port: 1337,
    hostname: 'localhost',
    components: [],
    trackPath: '/webcm/track',
    cookiesKey: 'something-very-secret',
};
function getConfig(configPath) {
    let config = exports.defaultConfig;
    if (!configPath) {
        console.log('Config path not provided, checking if the config file exists...');
        const tryPath = path.resolve("./webcm.config.ts");
        if (fs_1.default.existsSync(tryPath)) {
            console.log(`Found config file: ${tryPath}, using it...`);
            configPath = tryPath;
        }
        else {
            console.log("Config file not found, using defaults");
        }
    }
    if (configPath) {
        const configFullPath = path.resolve(configPath);
        if (!fs_1.default.existsSync(configFullPath)) {
            throw new Error(`No config file found at provided path: ${configFullPath}`);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            config = { ...config, ...require(configFullPath).default };
            for (const component of config.components) {
                if ('path' in component && !component.path.startsWith('/')) {
                    component.path = path.resolve(configPath, '../', component.path);
                }
            }
        }
    }
    if (!config.components) {
        config.components = [];
    }
    return config;
}
exports.getConfig = getConfig;
