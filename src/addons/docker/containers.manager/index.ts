import * as fs from 'fs';
import { Container } from './container';
import * as Bluebird from 'bluebird';
import * as colors from 'colors';

export class ContainersManager {
    private containers: Container[] = [];
    public containersPorts: number[] = [];
    constructor(private edeDir: string) {}

    /**
     *initCntainer - creates and starts docker container for specified ede-file name and port
     *
     * @param {string} name
     * @param {number} port
     */
    initContainer(name: string, port: number): void {
        const container: Container = new Container (name, port, this.edeDir);
        container.start();
        this.containers.push(container);
        this.containersPorts.push(port);
        this.logContainer(container);
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
            console.log(`Stopping docker container ${container.name}... `);

            return new Bluebird((resolve, reject) => {
                container.stop((error, stdout, stderr) => {
                    if (error) {
                      console.error(`Unable to execute stop command for ${container.name}: ${error}`)
                    }
                    if (stderr) {
                        console.error(`An error occured while stoping ${container.name}: ${stderr}`);
                    }
                    if (stdout) {
                        console.log(`Docker container ${stdout} has successfully stopped`);
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
