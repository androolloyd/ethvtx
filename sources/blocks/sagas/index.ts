import { SagaIterator }       from 'redux-saga';
import { takeEvery }          from 'redux-saga/effects';
import { BlocksActions }      from '../actions/actionTypes';
import { BlocksFetchSaga }    from './BlocksFetch';
import { VtxconfigActions }   from '../../vtxconfig/actions/actionTypes';
import { VtxconfigResetSaga } from './VtxconfigReset';

export function* BlocksSagas(): SagaIterator {
    yield takeEvery(BlocksActions.BlocksFetch, BlocksFetchSaga);
    yield takeEvery(VtxconfigActions.VtxconfigReset, VtxconfigResetSaga);
}
