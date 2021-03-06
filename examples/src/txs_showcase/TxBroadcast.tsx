import React               from 'react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardImg,
    CardBody,
    CardFooter,
    Button,
    Form,
    FormGroup,
    FormInput,
}                          from 'shards-react';
import { State, TxInfos }  from 'ethvtx/lib/state';
import { Dispatch }        from 'redux';
import { sendTransaction } from 'ethvtx/lib/dispatchers';
import { connect }         from 'react-redux';

interface ITXBroadcastProps {
    send?: (args: Partial<TxInfos>) => number;
    coinbase?: string;
}

interface ITxBroadcastState {
    address: string;
    value: number;
}

export class TxBroadcastRaw extends React.Component<ITXBroadcastProps, ITxBroadcastState> {

    state: ITxBroadcastState = {
        address: '',
        value: 0
    };

    constructor(props: ITXBroadcastProps) {
        super(props);

        this.handleAddressInput = this.handleAddressInput.bind(this);
        this.handleValueInput = this.handleValueInput.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
    }

    handleAddressInput(e: any, address: string): void {
        this.setState({address: e.target.value});
    }

    handleValueInput(e: any, value: number): void {
        this.setState({value: e.target.value});
    }

    handleButtonClick(): void {
        this.props.send!({to: this.state.address, value: '0x' + this.state.value.toString(16), from: this.props.coinbase});
    }

    render(): React.ReactNode {
        return (
            <div>
                <Card>
                    <CardHeader>Broadcasting Transactions</CardHeader>
                    <CardBody>
                        <p>You can broadcast transactions. As soon as a transaction is broadcasted, its hash is added in the store and its status gets updated.</p>
                        <Form>
                            <FormGroup>
                                <label htmlFor="#to">Destination Address</label>
                                <FormInput id="#to" placeholder="address" onChange={this.handleAddressInput}/>
                            </FormGroup>
                            <FormGroup>
                                <label htmlFor="#value">Amount of Wei to send</label>
                                <FormInput type="number" id="#value" placeholder="value" onChange={this.handleValueInput}/>
                            </FormGroup>
                            <FormGroup>
                                <Button onClick={this.handleButtonClick} outline theme="dark">
                                    Send Transaction
                                </Button>
                            </FormGroup>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state: State): ITXBroadcastProps => ({
    coinbase: state.vtxconfig.coinbase
});

const mapDispatchToProps = (dispatch: Dispatch): ITXBroadcastProps => ({
    send: (args: Partial<TxInfos>): number => sendTransaction(dispatch, args)
});

export const TxBroadcast = connect(mapStateToProps, mapDispatchToProps)(TxBroadcastRaw);
