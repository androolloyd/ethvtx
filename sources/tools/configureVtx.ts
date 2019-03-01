import { State }                    from '../state';
import { VtxconfigAllowedNetworks } from '../state/vtxconfig';

export interface VtxConfigArguments {
    poll_timer?: number;
    confirmation_treshold?: number;
    allowed_nets?: VtxconfigAllowedNetworks;
}

export const configureVtx = <T extends State = State>(initialState: T, config: VtxConfigArguments): T => {

    if (config.poll_timer) initialState.vtxconfig.poll_timer = config.poll_timer;
    if (config.confirmation_treshold) initialState.vtxconfig.confirmation_treshold = config.confirmation_treshold;
    if (config.allowed_nets) initialState.vtxconfig.allowed_nets = config.allowed_nets;

    return initialState;
};
