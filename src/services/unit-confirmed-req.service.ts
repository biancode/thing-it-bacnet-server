import * as Bluebird from 'bluebird';

import {
    BACnetPropertyId,
} from '../core/bacnet/enums';

import {
    ILayerConfirmedReq,
    ILayerConfirmedReqService,
    ILayerConfirmedReqServiceReadProperty,
    ILayerConfirmedReqServiceSubscribeCOV,
    ILayerConfirmedReqServiceWriteProperty,
} from '../core/bacnet/interfaces';

import {
    BACnetObjectId,
} from '../core/bacnet/types';

import { InputSocket, OutputSocket, ServiceSocket } from '../core/sockets';

import { UnitStorageManager } from '../managers/unit-storage.manager';

import { unconfirmedReqService, simpleACKService, complexACKService } from '../core/bacnet/services';

export class UnitConfirmedReqService {

    /**
     * readProperty - handles the "readProperty" confirmed request.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {Bluebird<any>}
     */
    public readProperty (inputSoc: InputSocket, outputSoc: OutputSocket,
            serviceSocket: ServiceSocket): Bluebird<any> {
        const apduMessage = inputSoc.apdu as ILayerConfirmedReq;
        const apduService = apduMessage.service as ILayerConfirmedReqServiceReadProperty;

        const invokeId = apduMessage.invokeId;

        // Get object identifier
        const unitObjId = apduService.objId;

        // Get property identifier
        const propId = apduService.propId;
        const propIdValue = propId.getValue();

        // Get BACnet property (for BACnet object)
        const unitStorage: UnitStorageManager = serviceSocket.getService('unitStorage');
        const unitProp = unitStorage.getUnitProperty(unitObjId, propIdValue);

        const msgReadProperty = complexACKService.readProperty({
            invokeId: invokeId,
            unitObjId: unitObjId,
            unitProp: unitProp,
        });
        outputSoc.send(msgReadProperty, `Complex ACK - readProperty`);

        return Bluebird.resolve();
    }

    /**
     * subscribeCOV - handles the "subscribeCOV" confirmed request.
     * Method sends the "subscribeCOV" simple ack response and subscribe on the
     * COV notification for specific BACnet object (unit).
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {Bluebird<any>}
     */
    public subscribeCOV (inputSoc: InputSocket, outputSoc: OutputSocket,
            serviceSocket: ServiceSocket): Bluebird<any> {
        const apduMessage = inputSoc.apdu as ILayerConfirmedReq;
        const apduService = apduMessage.service as ILayerConfirmedReqServiceSubscribeCOV;
        const unitStorage: UnitStorageManager = serviceSocket.getService('unitStorage');

        // --- Sends response "subscribeCOV"

        // Get invoke ID
        const invokeId = apduMessage.invokeId;

        const msgSubscribeCOV = simpleACKService.subscribeCOV({
            invokeId: invokeId
        });
        outputSoc.send(msgSubscribeCOV, `Simple ACK - subscribeCOV`);

        // --- Sends response "covNotification"

        // Get process ID
        const subProcessId = apduService.subscriberProcessId;

        // Get unit Object identifier
        const unitObjId = apduService.objId;

        // Get device Object identifier
        const device = unitStorage.getDevice();
        const devObjIdProp = device.storage.getProperty(BACnetPropertyId.objectIdentifier);
        const devObjId = devObjIdProp.payload as BACnetObjectId;

        unitStorage
            .subscribeToUnit(unitObjId)
            .subscribe((reportedProps) => {
                const msgCovNotification = unconfirmedReqService.covNotification({
                    processId: subProcessId,
                    devObjId: devObjId,
                    unitObjId: unitObjId,
                    reportedProps: reportedProps,
                });
                outputSoc.send(msgCovNotification, `Unconfirmed Request - covNotification`);
            });

        return Bluebird.resolve();
    }

    /**
     * writeProperty - handles the "writeProperty" confirmed request.
     * Method sends the "writeProperty" simple ack response.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {Bluebird<any>}
     */
    public writeProperty (inputSoc: InputSocket, outputSoc: OutputSocket,
            serviceSocket: ServiceSocket): Bluebird<any> {
        const apduMessage = inputSoc.apdu as ILayerConfirmedReq;
        const apduService = apduMessage.service as ILayerConfirmedReqServiceWriteProperty;
        const invokeId = apduMessage.invokeId;

        // Get unit Object identifier
        const objId = apduService.objId;

        // Get property ID
        const propId = apduService.propId;

        // Get property value
        const propValues = apduService.propValues;
        const propValue = propValues[0];

        // Get priority of the property
        let priorityValue: number;
        try {
            const priority = apduService.priority;
            priorityValue = priority.getValue();
        } catch (error) {
        }

        const unitStorage: UnitStorageManager = serviceSocket.getService('unitStorage');
        unitStorage.setUnitProperty(objId, {
            id: propId.getValue(),
            payload: propValue,
            priority: priorityValue,
        });

        const msgWriteProperty = simpleACKService.writeProperty({
            invokeId: invokeId,
        });
        outputSoc.send(msgWriteProperty, `Simple ACK - writeProperty`);

        return Bluebird.resolve();
    }
}

export const unitConfirmedReqService: UnitConfirmedReqService = new UnitConfirmedReqService();