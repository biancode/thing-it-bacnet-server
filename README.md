# Installing

```
npm install
```

# Usage


## Start

```
npm start -- <options...> - start bacnet-server for single ede-file
npm run build-docker - build docker image of bacnet-server
npm run start-docker-service -- <options...> - start simulation for a folder of ede-files, 
with wrapping each bacnet-server instance with docker container
```

## Options

### Start options
- `--port <port>` (by default `47808`): port of the server.
- `--filePath <file_path>`: path to the `EDE` file.
- `--reqDelay <delay>` (by default `20 ms`): timeout between end of old request and start of new request.
- `--reqThread <thread>` (by default `1`): number of concurrent unicast requests to the one `IP:PORT`.

### Docker service options
- `--port <port>` (by default `47808`): port of the server.
- `--dirPath <dir_path>` (by default `./edefiles`): path to the `EDE` files directory.
- `--outputAddr <output_address>`: ip address of the remote thing-it-bacnet-device to connect.
- `--outputPort <output_port` (by default `47808`): port of remote thing-it-bacnet-device to connect.

# Units

Application implements two types of units:
- `native` units - implements simulation logic to change properties of the `BACnet Object`s by the algorithms of the `BACnet` protocol.
- `custom` units - implements simulation logic of `custom` devices. Eg: `noop`, `function`, `thermostat`, `light` etc.

## Custom units

### Noop

Implements the `No operation` logic. It sets as default value for `cust.-unit-type` column in EDE files.

Aliases: `''`, `default`, `0`, `noop`.

Functions:
- `default` (aliasses: `''`, `default`): implements the `No operation` logic.

### Functional

Implements the `distribution (mathematics)` logic.

Aliases: `1`, `fn`, `func`, `function`.

Functions:
- `uniform` (aliases: `''`, `default`, `0`, `unif`, `uniform`, `uniformDistribution`): implements the logic of changes of `Present Value` property by `uniform` distribution.
- `normal` (aliases: `1`, `gaus`, `gaussian`, `norm`, `normal`, `normalDistribution`): implements the logic of changes of `Present Value` property by `normal` distribution.

### Thermostat

Implements the `BACNet thermostat` logic.

Aliases: `2`, `th`, `thermo`, `thermostat`.

Functions:
- `setpoint-feedback` (aliases: `0`, `setpointFeedback`, `setpoint-feedback`, `setpointFb`, `setpoint-fb`): implements the logic of thermostat's `setpointFeedbackObject` of `Analog Value` type. Returns the value of the current thermostat setpoint.
- `setpoint-modification` (aliases: `1`, `setpointModification`, `setpoint-modification`, `setpointMod`, `setpoint-mod`): implements the logic of thermostat's `setpointModificationObject` of `Analog Value` type. When its own `Present Value` has been changed, increases/decreases the `Present Value` property of `setpoint-feedback` object on its own `Present Vlaue` property value.
- `temperature` (aliases: `2`, `temperature`): implements the logic of thermostat's `temperatureObject` of `Analog Value` type. Returns the simulated value of the area's tempreture. When setpoint is set, changes the temperature Object's `Present Value` property by 0,1 until it fit the setpoint value.
- `mode` (aliases: `3`, `mode`): implements the logic of thermostat's `modeObject` of `MultiState Value` type. Represents the mode of the thermostats with two possible states: `HEAT`(when the temperature increases and sepoint > temperature) or `COOL`(when the temperature decreases and sepoint < temperature).

### Light

Implements the `BACNet light` logic.

Aliases: `3`, `light`.

Functions:
- `level-feedback` (aliases: `0`, `levelFeedback`, `level-feedback`, `lvlFb`, `lvl-fb`): implements the logic of light's `levelFeedbackObject` of `Analog Value` type. Returns the value of the current dimmer level.
- `level-modification` (aliases: `1`, `levelModification`, `lvl-modification`, `lvlMod`, `lvl-mod`): implements the logic of light's `levelModificationObject` of `Analog Value` type. When its own `Present Value` has been changed, sets its own `Present Value` to the `level-feedback` object's `Present Value` property.
- `state-feedback` (aliases: `2`, `stateFeedback`, `state-feedback`, `stateFb`, `state-fb`): implements the logic of light's `lightActiveFeedbackObject` of `MultiState Value` type. Return the state of the light, represented by two possible state values: `ON` or `OFF`.
- `state-modification` (aliases: `3`, `stateModification`, `state-modification`, `state-mod`, `stateMod`): implements the logic of light's `lightActiveModificationObject` of `MultiState Value` type. Allows to modify light's state (on or off). When the value has been set to its own `Present Value`, modifies the `state-feedback object`'s `Present Value` accordingly.


### Jalousie

Implements the `BACNet jalousie` logic.

Aliases: `4`, `jal`, `jalousie`.

Functions:
- `position-feedback` (aliases: `0`, `positionFeedback`, `position-feedback`, `posFb`, `pos-fb`): implements the logic of jalousie's `positionFeedbackObject` of `Analog Value` type. Returns the value of the jalousie position.
- `position-modification` (aliases: `1`, `positionModification`, `pos-modification`, `posMod`, `pos-mod`): implements the logic of jalousie's `positionModificationObject` of `Analog Value` type. When its own `Present Value` has been changed, sends it to the jalousie physical state simulation logic.
- `rotation-feedback` (aliases: `2`, `rotationFeedback`, `rotation-feedback`, `rotFb`, `rot-fb`): implements the logic of jalousie's `rotationFeedbackObject` of `Analog Value` type. Return the value of the jalousie rotation.
- `rotation-modification` (aliases: `3`, `rotationModification`, `rotation-modification`, `rot-mod`, `rotMod`): implements the logic of jalousie's `rotationModificationObject` of `Analog Value` type. When its own `Present Value` has been changed, sends it to the jalousie physical state simulation logic.
- `action` (aliases: `4`, `action`, `act`): implements the logic of jalousie's `actionObject` of `MultiState Value` type. Represents the action state of the jalousie (`'STOP'` or `'MOVE'`). When `'MOVE'` value, position value & rotation value are received, inits the jalousie physical state modification logic.


# EDE file

## Restrictions

Aplication processes a specific set of columns. Increasing, decreasing or changing an order in the list of columns provided below will cause errors and unstable work of the application

### Native units

Here is a set of `native` units columns which are correctly processed by the app
1. `#keyname`
2. `device obj.-instance`
3. `object-name`
4. `object-type`
5. `object-instance`
6. `description`
7. `present-value-default`
8. `min-present-value`
9. `max-present-value`
10. `commandable`
11. `supports COV`
12. `hi-limit`
13. `low-limit`
14. `state-text-reference`
15. `unit-code`
16. `vendor-specific-address`

### Custom units

Application processes next optional EDE columns:

17. `cust.-unit-type` 
18. `cust.-unit-id`
19. `cust.-unit-fn`
20. `cust.-min.-value`
21. `cust.-max.-value`
22. `cust.-freq`
- `cust.-unit-type` (default: `noop`): type of the `custom` unit.
- `cust.-unit-id` (default: `auto`): ID of the `custom` unit.
- `cust.-unit-fn` (default: `''`): function of the `native` unit in the `custom` unit.
- `cust.-min.-value` (default: get from `cust.-unit-fn`): min value for simulation algorithm.
- `cust.-max.-value` (default: get from `cust.-unit-fn`): max value for simulation algorithm.
- `cust.-freq` (default: get from `cust.-unit-fn`): frequency of changes of values.

### File references

Currently, application is unable to process additional file references inside the main EDE file. Entries with object type 10 will be processed as `default` native units

# State texts file

## Restrictions

State texts file name should consist of three parts:
- the same name  EDE file have (without `.csv` extension)
- separator ( `-` or `_` )
- one of possible suffix aliases: `states`, `state-texts`, `States`, `State-Texts`, `StateTexts`.

State texts file should have a specific set of columns. Decreasing or changing an order in the list of columns provided below will cause errors and incorrect reading of state texts data.

1. `#Reference number`,
2. `Text 1 or Inactive-Text`,
3. `Text 2 or Active-Text`,
4. `Text 3`,
5. `Text4`,
6. `Text 4`,
7. `Text 5`,  
... etc (you can specify as many state texts as you want).  

## Usage

Specify the number of `state-text-reference` in the corresponding column of the EDE file. The row from state texts file with the same `#Reference number` will be used for that unit (usually MultiState or Binary).
