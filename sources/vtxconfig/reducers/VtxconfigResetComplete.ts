import { Reducer }                     from 'redux';
import { VtxconfigSection, VtxStatus } from '../../state/vtxconfig';
import { IVtxconfigResetComplete }     from '../actions/actionTypes';

export const VtxconfigResetCompleteReducer: Reducer<VtxconfigSection, IVtxconfigResetComplete> =
    (state: VtxconfigSection, action: IVtxconfigResetComplete): VtxconfigSection =>
        ({
            ...state,
            reset_status: {
                txs: false,
                blocks: false,
                contracts: false,
                vtxcache: false,
                vtxconfig: false
            },
            status: VtxStatus.Loaded
        });
