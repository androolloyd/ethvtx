"use strict";
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", { value: true });
var address_checker_1 = require("../../utils/address_checker");
var is_alias_1 = require("../../utils/is_alias");
/**
 * @description Get the list of contract specifications available in the store
 * @param state
 */
exports.getContractsSpecList = function (state) { return Object.keys(state.contracts.specs)
    .filter(function (key) { return state.contracts.specs[key] !== undefined; }); };
/**
 * @description Get a contract instance
 * @param state
 * @param contract_name
 * @param address_or_alias
 */
exports.getContract = function (state, contract_name, address_or_alias) {
    try {
        address_or_alias = address_checker_1.address_checker(address_or_alias);
    }
    catch (e) {
        throw new Error("Invalid provided address or alias: " + address_or_alias);
    }
    if (is_alias_1.is_alias(address_or_alias)) {
        try {
            address_or_alias = state.contracts.alias[contract_name][address_or_alias].address;
        }
        catch (e) {
            return undefined;
        }
    }
    if (!state.contracts.instances[contract_name] || !state.contracts.instances[contract_name][address_or_alias])
        return undefined;
    return state.contracts.instances[contract_name][address_or_alias].instance;
};
/**
 * @description Get the list of contract instances
 * @param state
 */
exports.getContractList = function (state) {
    var e_1, _a;
    var ret = {};
    try {
        for (var _b = __values(Object.keys(state.contracts.instances)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var contract = _c.value;
            ret[contract] = Object.keys(state.contracts.instances[contract]);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return ret;
};
