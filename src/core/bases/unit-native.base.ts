import * as _ from 'lodash';
import { Subject, Observable } from 'rxjs';

import {
    BACnetPropIds,
} from '../enums';

import {
    ApiError,
} from '../errors';

import {
    IBACnetObject,
    IBACnetObjectProperty,
} from '../interfaces';

import { UnitBase } from './unit.base';

export class UnitNativeBase extends UnitBase {
    public className: string = 'UnitNativeBase';
    // Unit metadata
    public metadata: IBACnetObject;
    // Unit properties subject
    public sjData: Subject<IBACnetObjectProperty>;

    constructor (bnUnit: any) {
        super();

        if (_.isNil(bnUnit.config)) {
            throw new ApiError(`${this.className} - constructor: Unit config is required!`);
        }

        this.sjData = new Subject();
    }

    /**
     * setProperty - sets the value of the unit property by property ID.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @param  {any} values - property value
     * @return {void}
     */
    public setProperty (propId: BACnetPropIds, values: any): void {
        const prop = _.find(this.metadata.props, [ 'id', propId ]);
        prop.values = values;

        // Emit change of unit
        const propClone = _.cloneDeep(prop);
        this.sjData.next(propClone);
    }

    /**
     * getProperty - return the clone value of the unit property by property ID.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @return {IBACnetObjectProperty}
     */
    public getProperty (propId: BACnetPropIds): IBACnetObjectProperty {
        const prop = _.find(this.metadata.props, [ 'id', propId ]);
        return _.cloneDeep(prop);
    }

    /**
     * subscribeProp - subscribes to the changes of specific property.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @return {Observable<IBACnetObjectProperty>}
     */
    public subscribeProp (propId: BACnetPropIds): Observable<IBACnetObjectProperty> {
        return this.sjData
            .filter(Boolean)
            .filter((prop) => prop.id === propId);
    }

    /**
     * isBACnetObject - returns true if object has compatible id and type.
     *
     * @param  {number} objInst - object instance
     * @param  {number} objType - object type
     * @return {boolean}
     */
    public isBACnetObject (objInst: number, objType: number): boolean {
        return this.metadata.type === objType && this.metadata.id === objInst;
    }

    /**
     * getNativeUnits - returns the native BACnet units for current unit.
     *
     * @return {UnitNativeBase}
     */
    public getNativeUnits (): UnitNativeBase {
        return this;
    }
}
