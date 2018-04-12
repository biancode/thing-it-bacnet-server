import {
    BACnetPropIds,
    BACnetObjTypes,
    BACnetPropTypes,
    BACnetEngineeringUnits,
} from '../../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/interfaces';

import * as BACnetTypes from '../../../../core/utils/types';

export const AnalogInputMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropIds.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjTypes.AnalogInput),
    },

    {
        id: BACnetPropIds.units,
        payload: new BACnetTypes.BACnetEnumerated(BACnetEngineeringUnits.noUnits),
    },
    {
        id: BACnetPropIds.covIncrement,
        payload: new BACnetTypes.BACnetReal(1.0),
    },
    {
        id: BACnetPropIds.presentValue,
        payload: new BACnetTypes.BACnetReal(0.0),
    },
];
