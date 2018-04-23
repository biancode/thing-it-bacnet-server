import { BACnetUnitAbbr} from '../../../core/bacnet/enums';

import { ICustomMetadata } from '../../../core/bacnet/interfaces';

export const NoopMetadata: ICustomMetadata[] = [
    {
        alias: [ BACnetUnitAbbr.Default, 'noop' ],
        config: { min: 0, max: 1, freq: 1000 },
    },
];
