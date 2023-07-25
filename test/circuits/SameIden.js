const path = require('path');
const { buildBabyjub, buildPoseidon } = require('circomlibjs');
const { Scalar, ZqField } = require('ffjavascript');
const { OUTPUT_DIR } = require('../../src/circuits/test_config/test_config');

const { stringPoint, pointEq } = require('./utils.js');
const { generateCircuitTest } = require('../../src/circuits/test_config/generate_tests');
const { expect } = require('chai');

const JF = new ZqField("2736030358979909402780800718157159386076813972158567259200215660948447373041");

// gen is string
const computeSk = (curve, poseidon, gen) => {
    const skGen = Scalar.e(gen);
    const skPoint = curve.mulPointEscalar(curve.Base8, skGen);
    const sk = poseidon(stringPoint(curve, skPoint));

    return {
        skGen,
        skPoint,
        sk
    };
}

// [sk]message
const encrypt = (curve, sk, message) => curve.mulPointEscalar(message, curve.F.toString(sk));

// [sk]message * [1/sk]
const decrypt = (curve, f, sk, encryptedMessage) => curve.mulPointEscalar(encryptedMessage, f.inv(BigInt(curve.F.toString(sk))));

generateCircuitTest({
    name: 'SameIden',
    path: path.join(OUTPUT_DIR, 'SameIden.t.circom'),
    cases: [
        {
            input: async () => {
                const babyjub = await buildBabyjub();
                const poseidon = await buildPoseidon();

                const sk1Data = computeSk(babyjub, poseidon, "4");
                const sk2Data = computeSk(babyjub, poseidon, "6");

                const eSk1Point = encrypt(babyjub, sk2Data.sk, sk1Data.skPoint);
                const eSk2Point = encrypt(babyjub, sk1Data.sk, sk2Data.skPoint);

                const dSk1Point = decrypt(babyjub, JF, sk2Data.sk, eSk1Point);
                const dSk2Point = decrypt(babyjub, JF, sk1Data.sk, eSk2Point);

                expect(pointEq(babyjub, dSk1Point, sk1Data.skPoint)).to.be.true;
                expect(pointEq(babyjub, dSk2Point, sk2Data.skPoint)).to.be.true;

                return {
                    eSk1Point: stringPoint(babyjub, eSk1Point),
                    eSk2Point: stringPoint(babyjub, eSk2Point),
                    sk1Gen: Scalar.toString(sk1Data.skGen),
                    sk2Gen: Scalar.toString(sk2Data.skGen),
                    sk1: Scalar.toString(babyjub.F.toString(sk1Data.sk)),
                    sk2: Scalar.toString(babyjub.F.toString(sk2Data.sk))
                };
            },
            output: null,
        }
    ]
});
