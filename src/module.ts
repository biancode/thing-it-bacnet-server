import {
    IAppConfig,
} from './core/interfaces';

export const appConfig: IAppConfig = {
    server: {
        port: 47808,
        outputSequence: {
            thread: 1,
            delay: 20,
        },
    },
    bacnet: {
        edeFilePath: '',
    }
}

export const statePostfix: string[] = [ 'states', 'state-texts', 'stateTexts', 'States', 'State-Texts', 'StateTexts' ];
