import * as Bluebird from 'bluebird';
import { ProxyUDPServer } from './proxy.server';
import { ContainersManager } from './containers.manager';
import * as DEFAULTS from './defaults';

export class Service {
    private containersManager: ContainersManager;
    private proxyServer: ProxyUDPServer;
    constructor(
        private port: number = DEFAULTS.THIS_PORT,
        private outputAddr: string = DEFAULTS.OUTPUT_ADDR,
        private outputPort: number = DEFAULTS.OUTPUT_PORT,
        private portsStart: number = DEFAULTS.DOCKER_CONTAINERS_FIRST_PORT
    ) {}

    start(dirPath: string = DEFAULTS.EDEDIR, files: string[]) {
        let nextPort = this.portsStart
        this.containersManager = new ContainersManager(dirPath);
        Bluebird.resolve().then(() => {
            files.forEach((fileName) => {
                const port = nextPort++;
                this.containersManager.initContainer(fileName, port)
            });
        })
        .then(() => {
            this.proxyServer = new ProxyUDPServer(this.port);
            this.proxyServer.start(this.outputAddr, this.outputPort, this.containersManager.containersPorts)
        })
    }

    stop(): Bluebird<any> {
        this.proxyServer.stop();
        return this.containersManager.destroy();
    }
}
