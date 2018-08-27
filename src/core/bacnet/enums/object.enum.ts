
export enum BACnetObjectType {
    AnalogInput = 0,
    AnalogOutput = 1,
    AnalogValue = 2,
    BinaryInput = 3,
    BinaryOutput = 4,
    BinaryValue = 5,
    Calendar = 6,
    Command = 7,
    Device = 8,
    EventEnrollment = 9,
    File = 10,
    Group = 11,
    Loop = 12,
    MultiStateInput = 13,
    MultiStateOutput = 14,
    NotificationClass = 15,
    Program = 16,
    Schedule = 17,
    Averaging = 18,
    MultiStateValue = 19,
    TrendLog = 20,
    LifeSafetyPoint = 21,
    LifeSafetyZone = 22,
    Accumulator = 23,
    PulseConverter = 24,
    EventLog = 25,
    GlobalGroup = 26,
    TrendLogMultiple = 27,
    LoadControl = 28,
    StructuredView = 29,
    AccessDoor = 30,
    Timer = 31,
    AccessCredential = 32,
    AccessPoint = 33,
    AccessRights = 34,
    AccessUser = 35,
    AccessZone = 36,
    CredentialDataInput = 37,
    NetworkSecurity = 38,
    BitstringValue = 39,
    CharacterStringValue = 40,
    DatepatternValue = 41,
    DateValue = 42,
    DatetimepatternValue = 43,
    DatetimeValue = 44,
    IntegerValue = 45,
    LargeAnalogValue = 46,
    OctetstringValue = 47,
    PositiveIntegerValue = 48,
    TimepatternValue = 49,
    TimeValue = 50,
    NotificationForwarder = 51,
    AlertEnrollment = 52,
    Channel = 53,
    LightingOutput = 54,
    BinaryLightingOutput = 55,
    NetworkPort = 56,
    ElevatorGroup = 57,
    Escalator = 58,
    Lift = 59,
}

export enum BACnetPropertyId {
    apduSegmentTimeout = 10,
    apduTimeout = 11,
    applicationSoftwareVersion = 12,
    changeOfStateCount = 15,
    changeOfStateTime = 16,
    covIncrement = 22,
    description = 28,
    deviceAddressBinding = 30,
    elapsedActiveTime = 33,
    eventState = 36,
    firmwareRevision = 44,
    localDate = 56,
    localTime = 57,
    maxApduLengthAccepted = 62,
    maxInfoFrames = 63,
    maxMaster = 64,
    maxPresValue = 65,
    minimumOffTime = 66,
    minimumOnTime = 67,
    minPresValue = 69,
    modelName = 70,
    numberOfApduRetries = 73,
    numberOfStates = 74,
    objectIdentifier = 75,
    objectList = 76,
    objectName = 77,
    objectType = 79,
    outOfService = 81,
    polarity = 84,
    presentValue = 85,
    priorityArray = 87,
    protocolObjectTypesSupported = 96,
    protocolServicesSupported = 97,
    protocolVersion = 98,
    reliability = 103,
    relinquishDefault = 104,
    segmentationSupported = 107,
    stateText = 110,
    statusFlags = 111,
    systemStatus = 112,
    vendorIdentifier = 120,
    vendorName = 121,
    timeOfActiveTimeReset = 114,
    timeOfStateCountReset = 115,
    units = 117,
    protocolRevision = 139,
    databaseRevision = 155,
    currentCommandPriority = 431,
}