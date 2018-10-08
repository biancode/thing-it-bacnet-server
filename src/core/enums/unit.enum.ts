
export enum BACnetUnitDataFlow {
    Set = 'set',
    Update = 'update',
}

export enum BACnetUnitAbbr {
    Default = 'Default',
}

export enum BACnetThermostatUnitFunctions {
    SetpointFeedback = 'setpointFeedback',
    SetpointModification = 'setpointModification',
    Temperature = 'temperature',
    Mode = 'mode'
}

export enum BACnetUnitFamily {
    Native = 'native',
    Analog = 'analog',
    Binary = 'binary',
    MultiState = 'multi-state',
}