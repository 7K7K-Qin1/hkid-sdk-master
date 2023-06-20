"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseNode = exports.baseLabel = exports.emptyNode = exports.weirdNode = exports.emptyAddress = void 0;
const ethers_1 = require("ethers");
const HKNameRegistrySDK_1 = require("./HKNameRegistrySDK");
let basePrices = [50, 50, 50, 5, 5, 5];
let rentPrices = [5];
exports.emptyAddress = "0x0000000000000000000000000000000000000000";
exports.weirdNode = "0x0000000000000000000000000000000000000000000000000000000000000001";
exports.emptyNode = "0x0000000000000000000000000000000000000000000000000000000000000000";
exports.baseLabel = (0, HKNameRegistrySDK_1.sha3)("hk");
exports.baseNode = (0, HKNameRegistrySDK_1.getNamehash)("hk");
let oneyear = 86400 * 365;
let tokenId = (0, HKNameRegistrySDK_1.getNamehash)("hongkong.hk");
let subTokenId = (0, HKNameRegistrySDK_1.getNamehash)("my.hongkong.hk");
function getFee(controller, name) {
    return controller.registerPrice(name, oneyear);
}
async function registerName(controller, name, address) {
    name = name || "ethereum";
    address = address;
    let fee = await getFee(controller, name);
    return controller.nameRegister(name, address, oneyear, {
        value: fee,
    });
}
async function getExpire(registry, tokenId) {
    return registry.expire(tokenId);
}
async function getNameRecord(registry, tokenId) {
    let origin = await registry.origin(tokenId);
    let expire = await registry.expire(tokenId);
    return { origin, expire };
}
async function main() {
    let one, two;
    let oneAddr, twoAddr;
    let provider = new ethers_1.ethers.providers.JsonRpcProvider(`https://rpc.debugchain.net`);
    one = new ethers_1.ethers.Wallet(process.env.ONE_PRVKEY || "", provider);
    two = new ethers_1.ethers.Wallet(process.env.TWO_PRVKEY || "", provider);
    oneAddr = await one.getAddress();
    twoAddr = await two.getAddress();
    console.log(oneAddr);
    console.log(twoAddr);
    let registry;
    let controller;
    let resolver;
    ({ registry, resolver, controller } = (0, HKNameRegistrySDK_1.setupNameRegistry)(process.env.REGISTRY_ADDR, process.env.CONTROLLER_ADDR, one));
    console.log(await registry.exists(tokenId));
    await (0, HKNameRegistrySDK_1.nameRegister)(controller, "hongkong8", oneAddr, oneyear);
    // await nameRegisterExtended(controller, "hongkong1", oneAddr, oneyear, 1, ["profile.email"], ["user@example.com"])
    // await nameRegisterByManager(controller, "hongkong2", oneAddr, oneyear, 1, ["profile.email"], ["user@example.com"])
    // console.log(await registry.exists(tokenId))
    console.log("ownerOfId", await (0, HKNameRegistrySDK_1.ownerOfId)(registry, tokenId));
    console.log("ownerOfName", await (0, HKNameRegistrySDK_1.ownerOfName)(registry, "hongkong.hk"));
    console.log("exists", await (0, HKNameRegistrySDK_1.exists)(registry, "hongkong.hk"));
    console.log("getOwner", await (0, HKNameRegistrySDK_1.getOwner)(registry, "hongkong.hk"));
    console.log("registerPrice", await (0, HKNameRegistrySDK_1.registerPrice)(controller, "hongkong", oneyear));
    console.log("renewPrice", await (0, HKNameRegistrySDK_1.renewPrice)(controller, "hongkong", oneyear));
    console.log("basePrice", await (0, HKNameRegistrySDK_1.basePrice)(controller, "hongkong"));
    console.log("rentPrice", await (0, HKNameRegistrySDK_1.rentPrice)(controller, "hongkong", oneyear));
    console.log("getPrices", await (0, HKNameRegistrySDK_1.getPrices)(controller));
    console.log("getTokenPrice", await (0, HKNameRegistrySDK_1.getTokenPrice)(controller));
    // console.log("expire", await expire(registry, "hongkong.hk"))
    // console.log("available", await available(registry, "hongkong.hk"))
    // console.log("parent", await parent(registry, "hongkong.hk"))
    // console.log("origin", await origin(registry, "hongkong.hk"))
    // // await mintSubdomain(registry, twoAddr, "hongkong.hk", "sub0")
    // await setName(resolver, oneAddr, "hongkong.hk")
    // console.log(await getName(resolver, oneAddr))
    // await setNftName(resolver, registry.address, tokenId, getNamehash("sub0.hongkong.hk"))
    // console.log(await getNftName(resolver, registry.address, tokenId))
    // await approve(registry, "hongkong1.hk", twoAddr)
    // console.log("getApproved", await getApproved(registry, "hongkong1.hk"))
    // await getKey(resolver, "hongkong1.hk", "profile.email")
    // await setKeysByHash(resolver, "hongkong1.hk", [sha3("profile.email")], ["newuser@example.com"])
    // await getKeys(resolver, "hongkong1.hk", ["profile.email"])
    // await getKeysByHash(resolver, "hongkong1.hk", [sha3("profile.email")])
    // await renew(controller, "hongkong1", oneyear)
    // await renewByManager(controller, "hongkong2", oneyear)
    // await transferName(registry, "hongkong2.hk", twoAddr)
    // await burn(registry, "hongkong1.hk")
}
main();
