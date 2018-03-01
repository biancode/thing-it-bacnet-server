import * as _ from 'lodash';

import {
    BACnetPropIds,
} from '../../../core/enums';

import {
    ApiError,
} from '../../../core/errors';

import {
    IBinaryValueUnit,
    IBACnetObject,
} from '../../../core/interfaces';

import { BinaryValueMetadata } from './binary-value.metadata';

import { UnitNativeBase } from '../../../core/bases/unit-native.base';

export class BinaryValueUnit extends UnitNativeBase {
    public className: string = 'BinaryValueUnit';
    public metadata: IBACnetObject;

    constructor (bnUnit: IBinaryValueUnit) {
        super(bnUnit);
        this.metadata = _.cloneDeep(BinaryValueMetadata);

        if (_.isNil(bnUnit.config.id)) {
            throw new ApiError(`${this.className} - constructor: Unit ID is required!`);
        }
        this.metadata.id = bnUnit.config.id;

        this.setProps(bnUnit.config);
    }
}
