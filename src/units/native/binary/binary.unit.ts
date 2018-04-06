import * as _ from 'lodash';

import {
    BACnetPropIds,
    BACnetBinaryPV,
    BACnetEventState,
    BACnetPolarity,
} from '../../../core/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    IBACnetObjectProperty,
    IBACnetTypeStatusFlags,
    IEDEUnit,
} from '../../../core/interfaces';

import { BinaryMetadata } from './binary.metadata';

import { NativeUnit } from '../native.unit';

import * as BACnetTypes from '../../../core/utils/types';

export class BinaryUnit extends NativeUnit {
    public readonly className: string = 'BinaryUnit';

    public initUnit (edeUnit: IEDEUnit) {
        super.initUnit(edeUnit);

        this.storage.addUnitStorage(BinaryMetadata);
    }

    /**
    * getReportedProperties - returns the reported properties for COV notification.
    *
    * @return {IBACnetObjectProperty[]}
    */
   protected getReportedProperties (): IBACnetObjectProperty[] {
       const presentValue = this.storage.getProperty(BACnetPropIds.presentValue);
       const statusFlags = this.storage.getProperty(BACnetPropIds.statusFlags);

       return [ presentValue, statusFlags ];
   }
}
