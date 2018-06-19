import * as fs from 'fs';
import { Container } from './container';
import * as Bluebird from 'bluebird';
import * as colors from 'colors';

export class ContainersManager {
    private containers: Container[] = [];
    public containersInfo: Map<number, any> = new Map();
    constructor(
        private edeDir: string,
        public logger: any
    ) {}

    /**
     *initCntainer - creates and starts docker container for specified ede-file name and port
     *
     * @param {string} name
     * @param {number} port
     */
    initContainer(name: string, port: number): void {
        this.logger.info(`[Docker Containers Manager]: Initializing container for ${name}.csv on port ${port}...`)
        const container: Container = new Container (name, port, this.edeDir);
        container.start();
        this.logContainer(container);
        this.containers.push(container);
        this.containersInfo.set(port, { port, name });
    }

    /**
     * destroy - kills all docker containers processes and sends command to stop containers to docker
     *
     * @returns {Bluebird<any>}
     */
    destroy(): Bluebird<any> {
        this.containers.forEach((container) => {
            container.process.kill('SIGKILL');
        });
        return Bluebird.map(this.containers, (container) => {
            this.logger.info(`[Docker Containers Manager]: Stopping docker container ${container.name}... `);

            return new Bluebird((resolve, reject) => {
                container.stop((error, stdout, stderr) => {
                    if (error) {
                        this.logger.error(`[Docker Containers Manager]: Unable to execute stop command for ${container.name}: ${error}`)
                    }
                    if (stderr) {
                        this.logger.error(`[Docker Containers Manager]: An error occured while stoping ${container.name}: ${stderr}`);
                    }
                    if (stdout) {
                        this.logger.info(`[Docker Containers Manager]: Docker container ${stdout} has successfully stopped`);
                    }
                    resolve();
                  });
            });
        }, { concurrency: 1});
    }

    /**
     * logContainer - creates file Streams for writing container common and errors log,
     * adds event listener to container child processes to log output into console
     *
     * @param {Container} container
     */
    logContainer(container: Container): void {
        container.fileLog = fs.createWriteStream(`./logs/${container.name}.container.log`);
        container.process.stdout.pipe(container.fileLog);
        container.process.stdout.on('data', (data) => {
            console.log(colors.yellow(`${container.name}:`), ` ${data}`)
        });

        container.fileErrorsLog = fs.createWriteStream(`./logs/${container.name}.container.errors.log`);
        container.process.stderr.on('data', (data: string) => {
            console.log(colors.yellow(`${container.name}:`) + ` ${data}`);
            if (data.includes('error')) {
                container.fileErrorsLog.write(data)
            } else {
                container.fileLog.write(data);
            }
        });
    }
}
