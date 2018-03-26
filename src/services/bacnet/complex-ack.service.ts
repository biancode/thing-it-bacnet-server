import * as Bluebird from 'bluebird';

import {
    BACnetServiceTypes,
    BLVCFunction,
} from '../../core/enums';

import { complexACKPDU } from '../../core/layers/apdus';
import { blvc, npdu } from '../../core/layers';

import { BACnetWriterUtil } from '../../core/utils';

import {
    IConfirmedReqReadPropertyOptions,
    IComplexACKLayer,
    IComplexACKReadPropertyService,
    IBACnetTypeObjectId,
    IBACnetTypeUnsignedInt,
} from '../../core/interfaces';

import { InputSocket, OutputSocket, ServiceSocket } from '../../core/sockets';

import { UnitStorageManager } from '../../managers/unit-storage.manager';

export class ComplexACKService {

    /**
     * readProperty - handles the "readProperty" confirmed request.
     *
     * @param  {RequestSocket} req - request object (socket)
     * @param  {ResponseSocket} resp - response object (socket)
     * @return {type}
     */
    public readProperty (
            inputSoc: InputSocket, outputSoc: OutputSocket, serviceSocket: ServiceSocket) {
        const apduMessage = inputSoc.apdu as IComplexACKLayer;
        const invokeId = apduMessage.invokeId;
        const apduService = apduMessage.service as IComplexACKReadPropertyService;

        // Get object identifier
        const objId = apduService.objId;
        const objIdPayload = objId.payload as IBACnetTypeObjectId;

        // Get property identifier
        const propId = apduService.propId;
        const propIdPayload = propId.payload as IBACnetTypeUnsignedInt;

        // Get BACnet property (for BACnet object)
        const unitManager: UnitStorageManager = serviceSocket.getService('unitManager');
        const unitProp = unitManager.getUnitProperty(objIdPayload, propIdPayload.value);

        // Generate APDU writer
        const writerComplexACK = complexACKPDU.writeReq({
            invokeId: invokeId
        });
        const writerReadProperty = complexACKPDU.writeReadProperty({
            objId: objIdPayload,
            unitProp: unitProp,
        });
        const writerAPDU = BACnetWriterUtil.concat(writerComplexACK, writerReadProperty);

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
        outputSoc.send(msgBACnet, 'readProperty');

        return Bluebird.resolve();
    }
}

export const complexACKService: ComplexACKService = new ComplexACKService();
