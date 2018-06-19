import { spawn, exec, ChildProcess } from 'child_process';
import * as stream from 'stream';

export class Container {
    public process: ChildProcess;
    public fileLog: stream.Writable;
    public fileErrorsLog: stream.Writable;

    constructor (public name: string,
        public port: number,
        private edeDir: string) { }

    /**
     * start runs docker container with specified options
     */
    start(): void {
        this.process = spawn( 'docker', [
            'run',
            '-i',
            '--rm',
            '--name', `${this.name}`,
            '-v', `${this.edeDir}:/edefiles`,
            '-p', `${this.port}:47808/udp`,
            '-e', `FILE=${this.name}.csv`,
            'bacnet-server'
        ]);
    }

    /**
     *
     *
     * @param {Function} callback - callback to process exec output
     */
    stop(callback: Function): void {
        exec(`docker stop ${this.name}`, () => {
            callback();
        });
        this.fileLog.destroy();
        this.fileErrorsLog.destroy();
    }
}
