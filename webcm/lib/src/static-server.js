"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticServer = void 0;
const express_1 = __importDefault(require("express"));
const locreq_1 = __importDefault(require("locreq"));
const locreq = (0, locreq_1.default)(__dirname);
class StaticServer {
    port;
    app;
    server;
    constructor(port = 3000) {
        this.port = port;
        this.app = (0, express_1.default)();
        this.server = null;
        console.log("SERVING", locreq.resolve('assets'));
        this.app.use(express_1.default.static(locreq.resolve('assets')));
    }
    start() {
        if (!this.server) {
            this.server = this.app.listen(this.port);
        }
    }
    stop() {
        this.server?.close();
    }
}
exports.StaticServer = StaticServer;
