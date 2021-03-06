import * as fs from 'fs';
import * as path from 'path';
import { argv } from 'yargs';
import * as _ from 'lodash';
import * as Docker from './index';
import * as DEFAULTS from './defaults';
import { Logger } from './logger';

const logger = new Logger('Docker addon');

logger.info('Starting Docker Service...');

let dirPath = argv.dirPath ? argv.dirPath : DEFAULTS.EDEDIR;

if (!_.isString(dirPath) || !dirPath) {
    throw new Error('Path to the EDE directory is required!');
}
if (!path.isAbsolute(dirPath)) {
    dirPath = path.resolve(dirPath);
}
const dirStat = fs.statSync(dirPath);
if (!fs.existsSync('./logs') || fs.statSync('./logs').isFile()) {
    fs.mkdirSync('./logs');
}

const dockerService = new Docker.Service(argv.port);
if (dirStat.isFile()) {
    logger.error('Path is a file, attempt to start bacnet server from it...');
    let fileName = dirPath.split('/').pop();
    if (_.endsWith(fileName, '.csv')) {
        fileName = fileName.slice(0, -4);
    }
    const parentPath = path.resolve(dirPath, '../');
    dockerService.start(parentPath, [ fileName ]);
}
if (dirStat.isDirectory()) {

    fs.readdir(dirPath, (err, files) => {
        if (err) {
            throw err;
        } else {
            const fileNames = files.map((file) => {
                if (_.endsWith(file, '.csv')) {
                    return file.slice(0, -4);
                }
                return file;
            })
            dockerService.start(dirPath, fileNames);

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
