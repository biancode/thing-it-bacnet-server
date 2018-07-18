import {
    UnitStorageProperty,
} from '../../../core/interfaces';

import * as BACNet from 'tid-bacnet-logic';

export const MultiStateMetadata: UnitStorageProperty[] = [
    {
        id: BACNet.Enums.PropertyId.presentValue,
        payload: new BACNet.Types.BACnetUnsignedInteger(1),
    },
    {
        id: BACNet.Enums.PropertyId.numberOfStates,
        payload: new BACNet.Types.BACnetUnsignedInteger(1),
    },
];
