import { AliasMap } from '../../core/alias/alias.map';
import { BACnetUnitAbbr } from '../../core/enums';
import { CustomUnit } from './custom.unit';

import { FunctionalUnit } from './functional/functional.unit';
import { ThermostatUnit } from './thermostat/thermostat.unit';
import { LightUnit } from './light/light.unit';
import { JalousieUnit } from './jalousie/jalousie.unit'
import { NoopUnit } from './noop/noop.unit';

export const CustomModule: AliasMap<any> = new AliasMap<any>([
    {
        alias: [ BACnetUnitAbbr.Default, '0', 'noop' ],
        value: NoopUnit,
    },
    {
        alias: [ '1', 'fn', 'func', 'function' ],
        value: FunctionalUnit,
    },
    {
        alias: [ '2', 'th', 'thermo', 'thermostat' ],
        value: ThermostatUnit,
    },
    {
        alias: [ '3', 'light' ],
        value: LightUnit,
    },
    {
        alias: [ '4', 'jal', 'jalousie' ],
        value: JalousieUnit,
    }
]);
