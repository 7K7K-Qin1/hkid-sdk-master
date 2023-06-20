"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.burn = exports.transferName = exports.renewByManager = exports.renew = exports.getKeysByHash = exports.getKeys = exports.setKeysByHash = exports.getKey = exports.getApproved = exports.approve = exports.getNftName = exports.setNftName = exports.getName = exports.setName = exports.mintSubdomain = exports.origin = exports.parent = exports.available = exports.expire = exports.getTokenPrice = exports.getPrices = exports.rentPrice = exports.basePrice = exports.renewPrice = exports.registerPrice = exports.getOwner = exports.exists = exports.ownerOfName = exports.ownerOfId = exports.nameRegisterByManager = exports.nameRegisterExtended = exports.nameRegister = exports.getFee = exports.setupNameRegistry = exports.keylist = exports.nonode = exports.altBaseNode = exports.altBaseLabel = exports.baseNode = exports.baseLabel = exports.emptyNode = exports.weirdNode = exports.emptyAddress = exports.removeTld = exports.suffixTld = exports.toChecksumAddress = exports.getNamehash = exports.sha3 = exports.CONTRACT_ADDRS = void 0;
const js_sha3_1 = require("js-sha3");
const abstract_provider_1 = require("@ethersproject/abstract-provider");
const factories_1 = require("./factories");
exports.CONTRACT_ADDRS = {
    oracle: "0x0f64B1e2B2776071121436771AC64701870F9C8c",
    registry: "0x6248cF19321a354a970b99e811C979A18b4e6446",
    controller: "0xc13cA34ed99CA845001798aEeDd868A30D839D7a",
};
function sha3(data) {
    return "0x" + (0, js_sha3_1.keccak_256)(data);
}
exports.sha3 = sha3;
function getNamehash(name) {
    let node = "0000000000000000000000000000000000000000000000000000000000000000";
    if (name) {
        let labels = name.split(".");
        for (let i = labels.length - 1; i >= 0; i--) {
            let labelSha = (0, js_sha3_1.keccak_256)(labels[i]);
            node = (0, js_sha3_1.keccak_256)(Buffer.from(node + labelSha, "hex"));
        }
    }
    return "0x" + node;
}
exports.getNamehash = getNamehash;
function toChecksumAddress(address) {
    address = address.toLowerCase().replace("0x", "");
    const hash = (0, js_sha3_1.keccak_256)(address);
    let ret = "0x";
    for (let i = 0; i < address.length; i++) {
        if (parseInt(hash[i], 16) > 7) {
            ret += address[i].toUpperCase();
        }
        else {
            ret += address[i];
        }
    }
    return ret;
}
exports.toChecksumAddress = toChecksumAddress;
function suffixTld(label) {
    return label.replace(".hk", "") + ".hk";
}
exports.suffixTld = suffixTld;
function removeTld(label) {
    return label.replace(".hk", "");
}
exports.removeTld = removeTld;
exports.emptyAddress = "0x0000000000000000000000000000000000000000";
exports.weirdNode = "0x0000000000000000000000000000000000000000000000000000000000000001";
exports.emptyNode = "0x0000000000000000000000000000000000000000000000000000000000000000";
exports.baseLabel = sha3("hk");
exports.baseNode = getNamehash("hk");
exports.altBaseLabel = sha3("com");
exports.altBaseNode = getNamehash("com");
exports.nonode = "0x0000000000000000000000000000000000000000000000000000000000001234";
exports.keylist = [
    "eth",
    "btc",
    "dot",
    "nft",
    "ipv4",
    "ipv6",
    "nostr",
    "cname",
    "contenthash",
    "profile.email",
    "profile.url",
    "profile.avatar",
    "profile.description",
    "social.twitter",
    "social.github",
];
function setupNameRegistry(registryAddress, controllerAddress, provider) {
    let resolver = factories_1.NameRegistry__factory.connect(registryAddress, provider);
    let registry = factories_1.NameRegistry__factory.connect(registryAddress, provider);
    let controller = factories_1.NameController__factory.connect(controllerAddress, provider);
    return { registry, resolver, controller };
}
exports.setupNameRegistry = setupNameRegistry;
async function getFee(controller, name, duration) {
    return controller.registerPrice(name, duration);
}
exports.getFee = getFee;
async function nameRegister(controller, name, addr, duration) {
    let fee = await getFee(controller, name, duration);
    return controller.nameRegister(name, addr, duration, { value: fee });
}
exports.nameRegister = nameRegister;
async function nameRegisterExtended(controller, name, addr, duration, setReverse, keys, values) {
    let fee = await getFee(controller, name, duration);
    let keyhashes = keys.map(key => sha3(key));
    return controller.nameRegisterExtended(name, addr, duration, setReverse, keyhashes, values, { value: fee });
}
exports.nameRegisterExtended = nameRegisterExtended;
async function nameRegisterByManager(controller, name, addr, duration, setReverse, keys, values) {
    let keyhashes = keys.map(key => sha3(key));
    return controller.nameRegisterByManager(name, addr, duration, setReverse, keyhashes, values);
}
exports.nameRegisterByManager = nameRegisterByManager;
function ownerOfId(registry, tokenId) {
    return registry.ownerOf(tokenId);
}
exports.ownerOfId = ownerOfId;
function ownerOfName(registry, name) {
    let tokenId = getNamehash(name);
    return registry.ownerOf(tokenId);
}
exports.ownerOfName = ownerOfName;
function exists(registry, name) {
    let tokenId = getNamehash(name);
    return registry.exists(tokenId);
}
exports.exists = exists;
async function getOwner(registry, name) {
    let tokenId = getNamehash(name);
    if (await registry.exists(tokenId)) {
        return registry.ownerOf(tokenId);
    }
    else {
        return exports.emptyAddress;
    }
}
exports.getOwner = getOwner;
async function registerPrice(controller, name, duration) {
    return controller.registerPrice(name, duration);
}
exports.registerPrice = registerPrice;
async function renewPrice(controller, name, duration) {
    return controller.renewPrice(name, duration);
}
exports.renewPrice = renewPrice;
async function basePrice(controller, name) {
    return controller.basePrice(name);
}
exports.basePrice = basePrice;
async function rentPrice(controller, name, duration) {
    return controller.rentPrice(name, duration);
}
exports.rentPrice = rentPrice;
async function getPrices(controller) {
    return controller.getPrices();
}
exports.getPrices = getPrices;
async function getTokenPrice(controller) {
    return controller.getTokenPrice();
}
exports.getTokenPrice = getTokenPrice;
async function expire(registry, name) {
    name = suffixTld(name);
    return registry.expire(getNamehash(name));
}
exports.expire = expire;
async function available(registry, name) {
    name = suffixTld(name);
    return registry.available(getNamehash(name));
}
exports.available = available;
async function parent(registry, name) {
    name = suffixTld(name);
    return registry.parent(getNamehash(name));
}
exports.parent = parent;
async function origin(registry, name) {
    name = suffixTld(name);
    return registry.origin(getNamehash(name));
}
exports.origin = origin;
async function mintSubdomain(registry, newOwner, name, label) {
    let tokenId = getNamehash(name);
    return registry.mintSubdomain(newOwner, tokenId, label);
}
exports.mintSubdomain = mintSubdomain;
async function setName(resolver, addr, name) {
    const tokenId = getNamehash(name);
    return resolver.setName(addr, tokenId);
}
exports.setName = setName;
async function getName(resolver, addr) {
    return resolver.getName(addr);
}
exports.getName = getName;
async function setNftName(resolver, nftAddr, nftTokenId, nameTokenId) {
    return resolver.setNftName(nftAddr, nftTokenId, nameTokenId);
}
exports.setNftName = setNftName;
async function getNftName(resolver, nftAddr, nftTokenId) {
    return resolver.getNftName(nftAddr, nftTokenId);
}
exports.getNftName = getNftName;
async function approve(registry, name, approved) {
    name = suffixTld(name);
    let tokenId = getNamehash(name);
    return registry.approve(approved, tokenId);
}
exports.approve = approve;
async function getApproved(registry, name) {
    name = suffixTld(name);
    let tokenId = getNamehash(name);
    return registry.getApproved(tokenId);
}
exports.getApproved = getApproved;
async function getKey(resolver, name, key) {
    const tokenId = getNamehash(name);
    return resolver.get(key, tokenId);
}
exports.getKey = getKey;
async function setKeysByHash(resolver, name, keys, values) {
    const tokenId = getNamehash(name);
    return resolver.setManyByHash(keys, values, tokenId);
}
exports.setKeysByHash = setKeysByHash;
async function getKeys(resolver, name, key, resv) {
    const tokenId = getNamehash(name);
    return resolver.getMany(key, tokenId);
}
exports.getKeys = getKeys;
async function getKeysByHash(resolver, name, key, resv) {
    const tokenId = getNamehash(name);
    return resolver.getManyByHash(key, tokenId);
}
exports.getKeysByHash = getKeysByHash;
async function renew(controller, label, duration) {
    const price = await renewPrice(controller, label, duration);
    return controller.renew(label, duration, { value: price });
}
exports.renew = renew;
async function renewByManager(controller, label, duration) {
    return controller.renewByManager(label, duration);
}
exports.renewByManager = renewByManager;
async function transferName(registry, name, newOwner) {
    let namehash = getNamehash(name);
    let oldOwner = await getOwner(registry, name);
    return registry.transferFrom(oldOwner, newOwner, namehash);
}
exports.transferName = transferName;
async function burn(registry, name) {
    let tokenId = getNamehash(name);
    return registry.burn(tokenId);
}
exports.burn = burn;
