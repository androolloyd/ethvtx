import { Saga }                             from '@redux-saga/types';
import { all, AllEffect, fork, ForkEffect } from 'redux-saga/effects';
import { TxSagas }                          from '../txs/sagas';
import { VtxconfigSagas }                   from '../vtxconfig/sagas';
import { VtxpollSagas }                     from '../vtxpoll/sagas';
import { Store }                            from 'redux';

export const getSagas = (store: Store, custom_sagas?: Saga[]): Saga => {
    if (!custom_sagas) {
        custom_sagas = [];
    }

    const sagas: Saga[] = [
        TxSagas,
        VtxconfigSagas,
        VtxpollSagas.bind(null, store.dispatch, store.getState),
        ...custom_sagas
    ];

    const merged_forked_sagas: ForkEffect[] = sagas.map((saga: Saga): ForkEffect => fork(saga));

    return function* root(): IterableIterator<AllEffect> {
        yield all(merged_forked_sagas);
    };
};