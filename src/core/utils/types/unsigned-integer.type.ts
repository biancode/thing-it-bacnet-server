import * as _ from 'lodash';

import { BACnetTypeBase } from './type.base';

import {
    BACnetPropTypes,
} from '../../enums';

import {
    IBACnetTag,
} from '../../interfaces';

import { ApiError } from '../../errors';
import { BACnetReaderUtil } from '../bacnet-reader.util';
import { BACnetWriterUtil } from '../bacnet-writer.util';

export class BACnetUnsignedInteger extends BACnetTypeBase {
    public readonly className: string = 'BACnetUnsignedInteger';
    public readonly type: BACnetPropTypes = BACnetPropTypes.unsignedInt;

    protected tag: IBACnetTag;
    private value: number;

    constructor (defValue?: number) {
        super();
        this.value = defValue;
    }

    public readValue (reader: BACnetReaderUtil, changeOffset: boolean = true) {
        const tag = reader.readTag(changeOffset);

        let value: number;
        switch (tag.value) {
            case 1:
                value = reader.readUInt8(changeOffset);
                break;
            case 2:
                value = reader.readUInt16BE(changeOffset);
                break;
            case 4:
                value = reader.readUInt32BE(changeOffset);
                break;
        }

        this.value = value;
    }

    public writeValue (writer: BACnetWriterUtil) {
        writer.writeParam(this.value, BACnetPropTypes.unsignedInt, 0);
    }

    public setValue (newValue: number): void {
        this.value = newValue;
    }

    public getValue (): number {
        return this.value;
    }
}
