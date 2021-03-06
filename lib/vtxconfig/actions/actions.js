"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actionTypes_1 = require("./actionTypes");
exports.VtxconfigSetWeb3 = function (web3) { return ({
    type: actionTypes_1.VtxconfigActions.VtxconfigSetWeb3,
    web3: web3,
}); };
exports.VtxconfigSetStatus = function (status) { return ({
    type: actionTypes_1.VtxconfigActions.VtxconfigSetStatus,
    status: status
}); };
exports.VtxconfigReset = function (enable) { return ({
    type: actionTypes_1.VtxconfigActions.VtxconfigReset,
    enable: enable
}); };
exports.VtxconfigResetSectionComplete = function (section) { return ({
    type: actionTypes_1.VtxconfigActions.VtxconfigResetSectionComplete,
    section: section
}); };
exports.VtxconfigResetComplete = function () { return ({
    type: actionTypes_1.VtxconfigActions.VtxconfigResetComplete
}); };
exports.VtxconfigSetInfos = function (coinbase, net) { return ({
    type: actionTypes_1.VtxconfigActions.VtxconfigSetInfos,
    coinbase: coinbase,
    net: net
}); };
