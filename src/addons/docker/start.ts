import * as fs from 'fs';
import * as path from 'path';
import { argv } from 'yargs';
import * as _ from 'lodash';
import * as Docker from './index';
import * as DEFAULTS from './defaults';

const dirPath = argv.dirPath ? argv.dirPath : DEFAULTS.EDEDIR;


if (!_.isString(dirPath) || !dirPath) {
    throw new Error('DockerService - Path to the EDE directory is required!');
}
if (!path.isAbsolute(dirPath)) {
    throw new Error('DockerService - Path to the EDE directory must be absolute!');
}
const dirStat = fs.statSync(dirPath);
let dockerContainersPromise;
if (!fs.existsSync('./logs') || fs.statSync('./logs').isFile()) {
    fs.mkdirSync('./logs');
}
const dockerService = new Docker.Service(argv.port, argv.outputAddr, argv.outputPort)
if (dirStat.isFile()) {
    console.error('DockerService - Path is a file, attempt to start bacnet server from it...');
    const fileName = dirPath.split('/').pop();
    const parentPath = path.resolve(dirPath, '../');
    dockerService.start(parentPath, [ fileName ])
}
if (dirStat.isDirectory()) {

    fs.readdir(dirPath, (err, files) => {
        if (err) {
            throw err;
        } else {
            dockerService.start(dirPath, files);

        }
    });
}

process.on('SIGINT', () => {
    dockerService.stop().then(() => {
        process.exit(0);
    })
});
process.on('SIGTERM', () => {
    dockerService.stop().then(() => {
        process.exit(0);
    })
});
process.on('SIGABRT', () => {
    dockerService.stop().then(() => {
        process.exit(0);
    })
});
process.on('beforeExit', () => {
    dockerService.stop()
});