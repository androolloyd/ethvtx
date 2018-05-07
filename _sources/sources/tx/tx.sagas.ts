import {call, put, select, take, takeEvery} from 'redux-saga/effects';
import {
    TxBroadcasted,
    TxConfirmed,
    TxError,
    TxReceipt,
    TxSendAction,
    TxSendRawAction
} from "./tx.actions";
import {Vortex} from "../vortex";
import {SagaIterator, eventChannel, END} from "redux-saga";
import {Unsubscribe} from "redux";
import {FeedNewError, FeedNewTransaction} from "../feed/feed.actions";
import {AccountUpdateRequest} from "../accounts/accounts.actions";


function* sendTransaction(action: TxSendAction): SagaIterator {
    let transaction_hash: string;


    return eventChannel((emit: (arg?: any) => void): Unsubscribe => {
        let _transactionEvents = undefined;
        try {
            _transactionEvents = action.web3.eth.sendTransaction(action.txArgs)
                .on('transactionHash', (_transaction_hash: string): void => {
                    transaction_hash = _transaction_hash;
                    if (action.resolvers) {
                        action.resolvers.success(_transaction_hash);
                        action.resolvers = undefined;
                    }
                    emit(FeedNewTransaction(_transaction_hash));
                    emit(TxBroadcasted(_transaction_hash, action.txArgs));
                })
                .on('confirmation', (_amount: number, _receipt: any): void => {
                    emit(TxConfirmed(transaction_hash, _receipt, _amount))
                    if (!(_amount % 5) || _amount < 5) {
                        if (action.txArgs.from)
                            emit(AccountUpdateRequest(action.txArgs.from));
                        if (action.txArgs.to)
                            emit(AccountUpdateRequest(action.txArgs.to));
                    }
                    if (_amount >= 24)
                        emit(END);
                })
                .on('receipt', (_receipt: any): void => {
                    emit(TxReceipt(transaction_hash, _receipt));
                })
                .on('error', (_error: any): void => {
                    if (transaction_hash === undefined) {
                        transaction_hash = 'last';
                    }
                    emit(TxError(transaction_hash, _error));
                    emit(FeedNewError(_error, _error.message, "[tx.sagas.ts][sendTransaction] Trying to send a transaction."));
                    if (action.resolvers) {
                        action.resolvers.success(transaction_hash);
                        action.resolvers = undefined;
                    }
                    emit(END);
                });
        } catch (reason) {
            if (transaction_hash === undefined) {
                transaction_hash = 'last';
            }
            Vortex.get().Store.dispatch(TxError(transaction_hash, reason));
            Vortex.get().Store.dispatch(FeedNewError(reason, reason.message, "[tx.sagas.ts][sendTransaction] Trying to send a transaction."));
            if (action.resolvers) {
                action.resolvers.error(transaction_hash);
                action.resolvers = undefined;
            }
            emit(END);
        }

        return (): void => {
            if (_transactionEvents)
                _transactionEvents.off();
        }
    });
}

function* callSendTransaction(action: TxSendAction): SagaIterator {
    const tx = yield call(sendTransaction, action);
    try {
        while (true) {
            const event = yield take(tx);
            yield put(event);
        }
    } finally {
        tx.close();
    }
}

function* sendRawTransaction(action: TxSendRawAction): SagaIterator {
    let transaction_hash: string;
    let coinbase: string = (yield select()).web3.coinbase;


    return eventChannel((emit: (arg?: any) => void): Unsubscribe => {
        let _transactionEvents = undefined;
        try {
            _transactionEvents = action.web3.eth.sendRawTransaction(action.signedTx)
                .on('transactionHash', (_transaction_hash: string): void => {
                    transaction_hash = _transaction_hash;
                    if (action.resolvers) {
                        action.resolvers.success(_transaction_hash);
                        action.resolvers = undefined;
                    }
                    emit(FeedNewTransaction(_transaction_hash));
                    emit(TxBroadcasted(_transaction_hash, {signed_transaction: action.signedTx}));
                })
                .on('confirmation', (_amount: number, _receipt: any): void => {
                    emit(TxConfirmed(transaction_hash, _receipt, _amount));
                    if (!(_amount % 5) || _amount < 5) {
                        // TODO Recover from and to in receipt
                        emit(AccountUpdateRequest(coinbase));
                    }
                    if (_amount >= 24)
                        emit(END);

                })
                .on('receipt', (_receipt: any): void => {
                    emit(TxReceipt(transaction_hash, _receipt));
                })
                .on('error', (_error: any): void => {
                    if (transaction_hash === undefined) {
                        transaction_hash = 'last';
                    }
                    emit(TxError(transaction_hash, _error));
                    emit(FeedNewError(_error, _error.message, "[tx.sagas.ts][sendRawTransaction] Trying to send a raw transaction."));
                    if (action.resolvers) {
                        action.resolvers.error(transaction_hash);
                        action.resolvers = undefined;
                    }
                    emit(END);
                });
        } catch (reason) {
            if (transaction_hash === undefined) {
                transaction_hash = 'last';
            }
            Vortex.get().Store.dispatch(TxError(transaction_hash, reason));
            Vortex.get().Store.dispatch(FeedNewError(reason, reason.message, "[tx.sagas.ts][sendRawTransaction] Trying to send a raw transaction."));
            if (action.resolvers) {
                action.resolvers.error(transaction_hash);
                action.resolvers = undefined;
            }
            emit(END);
        }

        return (): void => {
            if (_transactionEvents)
                _transactionEvents.off();
        }
    });
}

function* callSendRawTransaction(action: TxSendRawAction): SagaIterator {
    const tx = yield call(sendRawTransaction, action);
    try {
        while (true) {
            const event = yield take(tx);
            yield put(event);
        }
    } finally {
        tx.close();
    }
}
export function* TxSagas(): any {
    yield takeEvery('TX_SEND', callSendTransaction);
    yield takeEvery('TX_SEND_RAW', callSendRawTransaction);
}
