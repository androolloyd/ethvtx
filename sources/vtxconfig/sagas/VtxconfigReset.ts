import { SagaIterator }                                                         from 'redux-saga';
import { call, put, select }                                                    from 'redux-saga/effects';
import { IVtxconfigReset }                                                      from '../actions/actionTypes';
import { VtxconfigResetSectionComplete, VtxconfigSetInfos, VtxconfigSetStatus } from '../actions/actions';
import { VtxStatus }                                                            from '../../state/vtxconfig';
import { address_checker }                                                      from '../../utils/address_checker';

export function* VtxconfigResetSaga(action: IVtxconfigReset): SagaIterator {

    const state = (yield select());
    const clear: boolean =  state.vtxconfig.web3 === null;

    if (!clear) {

        if (action.enable) {
            yield put(VtxconfigSetStatus(VtxStatus.Authorizing));
            try {
                yield call(action.enable);
            } catch (e) {
                yield put(VtxconfigSetStatus(VtxStatus.Unauthorized));
                return ;
            }
        }

        const web3 = state.vtxconfig.web3;
        const coinbase = address_checker(yield call(web3.eth.getCoinbase));

        const net = yield call(web3.eth.net.getId);

        if (state.vtxconfig.allowed_nets !== null) {

            if (state.vtxconfig.allowed_nets[net] === undefined) {
                yield put(VtxconfigSetStatus(VtxStatus.WrongNet));
                return;
            }

            const genesis_hash: string = (yield call(web3.eth.getBlock, 0)).hash.toLowerCase();
            if (state.vtxconfig.allowed_nets[net].toLowerCase() !== genesis_hash) {
                yield put(VtxconfigSetStatus(VtxStatus.WrongNet));
                return;
            }
        }

        yield put(VtxconfigSetInfos(coinbase, net));
    }
    yield put(VtxconfigResetSectionComplete('vtxconfig'));
}
