import * as _ from 'lodash';
import { Subject, Observable } from 'rxjs';

import {
    BACnetPropIds,
} from '../../core/enums';

import {
    ApiError,
} from '../../core/errors';

import {
    INativeUnit,
    IBACnetObject,
    IBACnetObjectProperty,
    IBACnetTypeObjectId,
    IBACnetType,
    IEDEUnit,
    IBACnetPropertyNotification,
} from '../../core/interfaces';

import { NativeMetadata } from './native.metadata';

export class NativeUnit {
    public className: string = 'UnitNativeBase';
    // Unit metadata
    public metadata: IBACnetObject;
    // Unit properties subject
    public sjData: Subject<IBACnetPropertyNotification>;
    public sjCOV: Subject<IBACnetObjectProperty[]>;

    constructor (bnUnit: IEDEUnit, metadata: IBACnetObject) {
        if (_.isNil(bnUnit.objInst)) {
            throw new ApiError(`${this.className} - constructor: Unit ID is required!`);
        }
        this.sjData = new Subject();

        const nativeMetadata = _.cloneDeep(NativeMetadata);
        this.metadata = _.merge(nativeMetadata, metadata);
    }

    /**
     * initUnit - inits the unit using the EDE unit configuration.
     *
     * @param  {IEDEUnit} edeUnit - property ID
     * @return {void}
     */
    public initUnit (edeUnit: IEDEUnit): void {
        this.metadata.instance = edeUnit.objInst;
        this.metadata.deviceInstance = edeUnit.deviceInst;

        this.setProperty(BACnetPropIds.objectName, {
            value: edeUnit.objName,
        });
    }

    /**
     * setProperty - sets the value of the unit property by property ID.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @param  {IBACnetType} value - property value
     * @return {void}
     */
    public setProperty (propId: BACnetPropIds, value: IBACnetType): void {
        const prop = this.findProperty(propId);
        const oldValue = prop.payload;
        prop.payload = value;
        this.sjData.next({
            id: propId,
            oldValue: oldValue,
            newValue: value,
        });
    }

    /**
     * getProperty - return the clone value of the unit property by property ID.
     *
     * @param  {BACnetPropIds} propId - property ID
     * @return {IBACnetObjectProperty}
     */
    public getProperty (propId: BACnetPropIds): IBACnetObjectProperty {
        const prop = this.findProperty(propId);
        return _.cloneDeep(prop);
    }

    /**
     * subscribe - subscribes to the changes for all properties.
     *
     * @return {Observable<IBACnetObjectProperty>}
     */
    public subscribe (): Observable<IBACnetObjectProperty[]> {
        return this.sjCOV.filter(Boolean);
    }

    /**
     * isBACnetObject - returns true if object has compatible id and type.
     *
     * @param  {IBACnetTypeObjectId} objId - object identifier
     * @return {boolean}
     */
    public isBACnetObject (objId: IBACnetTypeObjectId): boolean {
        return this.metadata.type === objId.type
            && this.metadata.instance === objId.instance;
    }

    /**
     * getMetadata - returns the BACnet object (metadata) for current unit.
     *
     * @return {IBACnetObject}
     */
    public getMetadata (): IBACnetObject {
        return _.cloneDeep(this.metadata);
    }

    public dipatchCOVNotification () {
        const reportedProps = this.getReportedProperties();
        this.sjCOV.next(reportedProps);
    }

    protected getReportedProperties (): IBACnetObjectProperty[] {
        return null;
    }

    protected findProperty (propId: BACnetPropIds) {
        const property = _.find(this.metadata.props, [ 'id', propId ]);
        return property;
    }
}
