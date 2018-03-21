import * as Bluebird from 'bluebird';

import {
    BACnetServiceTypes,
    BACnetPropIds,
    BLVCFunction,
} from '../../core/enums';

import { unconfirmReqPDU } from '../../core/layers/apdus';
import { blvc, npdu } from '../../core/layers';

import { BACnetWriterUtil } from '../../core/utils';
import { IUnconfirmReqWhoIsOptions } from '../../core/interfaces';

import {
    IConfirmedReqLayer,
    IConfirmedReqSubscribeCOVService,
    IConfirmedReqWritePropertyService,
    IBACnetTypeObjectId,
    IBACnetTypeUnsignedInt,
} from '../../core/interfaces';


import { InputSocket, OutputSocket, ServiceSocket } from '../../core/sockets';

import { UnitManager } from '../../units/unit.manager';

export class UnconfirmedReqService {

    /**
     * whoIs - sends the "whoIs" request.
     *
     * @param  {IUnconfirmReqWhoIsOptions} opts - request options
     * @param  {OutputSocket} output - output socket
     * @return {type}
     */
    public whoIs (opts: IUnconfirmReqWhoIsOptions, output: OutputSocket) {
        // Generate APDU writer
        const writerUnconfirmReq = unconfirmReqPDU.writeReq({});
        const writerWhoIs = unconfirmReqPDU.writeWhoIs({});
        const writerAPDU = BACnetWriterUtil.concat(writerUnconfirmReq, writerWhoIs);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({
            control: {
                destSpecifier: true,
            },
            destNetworkAddress: 0xffff,
            hopCount: 0xff,
        });

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
            func: BLVCFunction.originalBroadcastNPDU,
            npdu: writerNPDU,
            apdu: writerAPDU,
        });

        // Concat messages
        const writerBACnet = BACnetWriterUtil.concat(writerBLVC, writerNPDU, writerAPDU);

        // Get and send BACnet message
        const msgBACnet = writerBACnet.getBuffer();
        return output.sendBroadcast(msgBACnet, 'whoIs');
    }

    /**
     * iAm - handles the "whoIs" request and sends a "iAm" response.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {type}
     */
    public iAm (
            inputSoc: InputSocket, outputSoc: OutputSocket, serviceSocket: ServiceSocket) {
        const unitManager: UnitManager = serviceSocket.getService('unitManager');
        const device = unitManager.device;
        const deviceMetadata = device.getMetadata();

        // Generate APDU writer
        const writerUnconfirmReq = unconfirmReqPDU.writeReq({});
        const writerIAm = unconfirmReqPDU.writeIAm({
            objInst: deviceMetadata.id,
            objType: deviceMetadata.type,
            vendorId: deviceMetadata.vendorId,
        });
        const writerAPDU = BACnetWriterUtil.concat(writerUnconfirmReq, writerIAm);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({
            control: {
                destSpecifier: true,
            },
            destNetworkAddress: 0xffff,
            hopCount: 0xff,
        });

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
            func: BLVCFunction.originalBroadcastNPDU,
            npdu: writerNPDU,
            apdu: writerAPDU,
        });

        // Concat messages
        const writerBACnet = BACnetWriterUtil.concat(writerBLVC, writerNPDU, writerAPDU);

        // Get and send BACnet message
        const msgBACnet = writerBACnet.getBuffer();
        return outputSoc.sendBroadcast(msgBACnet, 'iAm');
    }

    /**
     * covNotification - handles the "COV notification" unconfirmed request.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {type}
     */
    public covNotification (
            inputSoc: InputSocket, outputSoc: OutputSocket, serviceSocket: ServiceSocket) {
        const apduMessage = inputSoc.apdu as IConfirmedReqLayer;
        const invokeId = apduMessage.invokeId;
        const apduService = apduMessage.service as IConfirmedReqSubscribeCOVService;

        const subProcessId = apduService.subscriberProcessId;
        const subProcessIdPayload = subProcessId.payload as IBACnetTypeUnsignedInt;

        // Get object identifier
        const objId = apduService.objId;
        const objIdPayload = objId.payload as IBACnetTypeObjectId;
        const objType = objIdPayload.type;
        const objInst = objIdPayload.instance;

        // Get BACnet object (from device)
        const unitManager: UnitManager = serviceSocket.getService('unitManager');

        const device = unitManager.device;
        const deviceMetadata = device.getMetadata();

        const unit = unitManager.findUnit(objInst, objType);
        const unitMetadata = unit.getMetadata();

        // Get value
        const bnProp = unit.getProperty(BACnetPropIds.presentValue);
        const bnStatus = unit.getProperty(BACnetPropIds.statusFlags);

        // Generate APDU writer
        const writerUnconfirmReq = unconfirmReqPDU.writeReq({});
        const writerCOVNotification = unconfirmReqPDU.writeCOVNotification({
            device: deviceMetadata,
            devObject: unitMetadata,
            prop: bnProp,
            status: bnStatus,
            processId: subProcessIdPayload.value,
        });
        const writerAPDU = BACnetWriterUtil.concat(writerUnconfirmReq, writerCOVNotification);

        // Generate NPDU writer
        const writerNPDU = npdu.writeNPDULayer({});

        // Generate BLVC writer
        const writerBLVC = blvc.writeBLVCLayer({
            func: BLVCFunction.originalUnicastNPDU,
            npdu: writerNPDU,
            apdu: writerAPDU,
        });

        // Concat messages
        const writerBACnet = BACnetWriterUtil.concat(writerBLVC, writerNPDU, writerAPDU);

        // Get and send BACnet message
        const msgBACnet = writerBACnet.getBuffer();
        return outputSoc.send(msgBACnet, 'covNotification');
    }
}

export const unconfirmedReqService: UnconfirmedReqService = new UnconfirmedReqService();
