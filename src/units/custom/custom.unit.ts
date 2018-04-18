import * as _ from 'lodash';
import { Subject, BehaviorSubject, Observable } from 'rxjs';

import {
    BACnetPropIds,
} from '../../core/enums';

import {
    ApiError,
} from '../../core/errors';

import {
    IBACnetObjectProperty,
    IBACnetTypeObjectId,
    IEDEUnit,
    ICustomFunction,
} from '../../core/interfaces';

import { UnitStorage } from '../unit.storage';

import * as BACnetTypes from '../../core/utils/types';

import {
    logger,
    TyperUtil,
} from '../../core/utils';

import { AliasMap } from '../../core/alias/alias.map';

import { NativeUnit } from '../native/native.unit';

type TFunctionName = string;

export class CustomUnit {
    public readonly className: string = 'CustomUnit';
    public storage: AliasMap<ICustomFunction<NativeUnit>>;

    constructor () {
    }

    /**
     * setUnitFn - defines which function will be assigned the native unit
     * in custom unit.
     *
     * @param  {string} fn - function of the native unit
     * @param  {NativeUnit} unit - native unit (BACnet object)
     * @param  {IEDEUnit} edeUnit - ede configuration for unit
     * @return {void}
     */
    public setUnitFn (fn: string, unit: NativeUnit, edeUnit: IEDEUnit): void {
        throw new Error('Not implemented yet');
    }

    /**
     * initUnit - inits the custom unit.
     *
     * @param  {IEDEUnit} edeUnit - property ID
     * @return {void}
     */
    public initUnit (): void {
        this.storage = new AliasMap();
    }

    /**
     * addMetadata - adds the metadata to alias store.
     *
     * @param  {ICustomMetadata} metadata - metadata object
     * @return {void}
     */
    public addMetadata (metadata: ICustomMetadata[]): void {
        _.map(metadata, (metaunit) => {
            this.storage.addAlias(metaunit.alias);

            const alias = _.isArray(metaunit.alias)
                ? metaunit.alias[0] : metaunit.alias;

            this.storage.set(alias, {
                unit: null,
                config: _.cloneDeep(metaunit.config),
            });
        });
    }
}
