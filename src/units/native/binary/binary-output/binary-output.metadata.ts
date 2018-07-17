// import {
//     BACnetPropertyId,
//     BACnetObjectType,
//     BACnetBinaryPV,
//     BACnetPolarity,
// } from '../../../../core/bacnet/enums';

import {
    UnitPropertyObject,
} from '../../../../core/interfaces';

// import * as BACnetTypes from '../../../../core/bacnet/types';
import * as BACNet from 'tid-bacnet-logic';

export const BinaryOutputMetadata: UnitPropertyObject[] = [
    {
        id: BACNet.Enums.PropertyId.objectType,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.ObjectType.BinaryOutput),
    },

    {
        id: BACNet.Enums.PropertyId.polarity,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.Polarity.Normal),
    },
    {
        id: BACNet.Enums.PropertyId.presentValue,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.BinaryPV.Active),
    },
    {
        id: BACNet.Enums.PropertyId.relinquishDefault,
        payload: new BACNet.Types.BACnetEnumerated(BACNet.Enums.BinaryPV.Active),
    },
];
