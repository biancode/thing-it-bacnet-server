import * as _ from 'lodash';

import {
    BACnetPropertyId,
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

import { UnitStorage } from '../../unit.storage';

import * as BACnetTypes from '../../../core/types';

export class MiddleUnit {
    public readonly className: string = 'MiddleUnit';

    static createAndBind (storage: UnitStorage, edeUnit?: IEDEUnit) {
        const newInst = new this(storage);
        newInst.initMiddle(edeUnit);
        return newInst;
    }

    constructor (protected storage: UnitStorage) {
    }

    /**
     * initMiddle - initializes the middle unit.
     *
     * @param  {IEDEUnit} edeUnit -  ede unit configuration
     * @return {void}
     */
    public initMiddle (edeUnit?: IEDEUnit): void {
        this.sjHandler();
    }

    /**
     * sjHandler - handles the changes of properties.
     *
     * @return {void}
     */
    public sjHandler (): void {
    }
}
