
import {
    UnitStorageProperty,
} from '../../../core/interfaces';

import * as BACNet from 'tid-bacnet-logic';

export const DeviceMetadata: UnitStorageProperty[] = [
    {
        id: BACNet.Enums.PropertyId.objectType,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.ObjectType.Device),
    },
    {
        id: BACNet.Enums.PropertyId.vendorIdentifier,
        payload: new BACNet.Types.BACnetCharacterString('[thing-it] Test Device Name'),
    },
    {
        id: BACNet.Enums.PropertyId.vendorName,
        payload: new BACNet.Types.BACnetCharacterString('THING TECHNOLOGIES GmbH Test'),
    },
    {
        id: BACNet.Enums.PropertyId.modelName,
        payload: new BACNet.Types.BACnetCharacterString('[thing-it] BACnet Test Server'),
    },
    {
        id: BACNet.Enums.PropertyId.applicationSoftwareVersion,
        payload: new BACNet.Types.BACnetCharacterString('V1.0.0'),
    },
    {
        id: BACNet.Enums.PropertyId.objectList,
        payload: [],
    }
];
