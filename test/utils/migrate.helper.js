const {
    _sizes,
    _spirits,
    _ages,
    _resources,
    _morales,
    _governments,
    _realms,
} = require("./params");

async function buildMigrationPayload(tokenId, legacyContract) {
    const tokenURI = await legacyContract.tokenURI(tokenId);

    const json = Buffer.from(tokenURI.substring(29), "base64").toString();
    const result = JSON.parse(json);

    const size = _sizes.indexOf(result.attributes[0].value);
    const spirit = _spirits.indexOf(result.attributes[1].value);
    const age = _ages.indexOf(result.attributes[2].value);
    const resource = _resources.indexOf(result.attributes[3].value);
    const morale = _morales.indexOf(result.attributes[4].value);
    const government = _governments.indexOf(result.attributes[5].value);
    const turns = _realms.indexOf(result.attributes[6].value);

    return {
        size,
        spirit,
        age,
        resource,
        morale,
        government,
        turns,
    };
}

async function migrateContract(tokenId, legacyContract, v2Contract) {
    const dto = await buildMigrationPayload(tokenId, legacyContract);
    await legacyContract.setApprovalForAll(v2Contract.address, true);
    await v2Contract.claim(
        tokenId,
        dto.size,
        dto.spirit,
        dto.age,
        dto.resource,
        dto.morale,
        dto.government,
        dto.turns
    );
}

module.exports = {
    buildMigrationPayload,
    migrateContract,
    _sizes,
    _spirits,
    _ages,
    _resources,
    _morales,
    _governments,
    _realms,
};
