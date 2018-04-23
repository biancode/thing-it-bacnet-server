import {
    BACnetPropertyId,
    BACnetObjectType,
    BACnetPropTypes,
} from '../../../../core/enums';

import {
    IBACnetObjectProperty,
} from '../../../../core/interfaces';

import * as BACnetTypes from '../../../../core/types';

export const MultiStateValueMetadata: IBACnetObjectProperty[] = [
    {
        id: BACnetPropertyId.objectType,
        payload: new BACnetTypes.BACnetEnumerated(BACnetObjectType.MultiStateValue),
    },
];
