const path = require('path');
const { buildBabyjub, buildPoseidon } = require('circomlibjs');
const { Scalar, ZqField } = require('ffjavascript');
const { OUTPUT_DIR } = require('../../src/circuits/test_config/test_config');

const { stringPoint } = require('./utils.js');
const { generateCircuitTest } = require('../../src/circuits/test_config/generate_tests');

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

                // demonstration of how decrypting works
                // ---
                // const field = new ZqField(babyjub.subOrder);
                // const crackSk2 = field.inv(BigInt(sk1));
                //
                // const crackResult = babyjub.mulPointEscalar(eSkPoint2, crackSk2);
                //
                // console.log({
                //     sk2Point: [babyjub.F.toString(sk2Point[0]), babyjub.F.toString(sk2Point[1])],
                //     crackResult: [babyjub.F.toString(crackResult[0]), babyjub.F.toString(crackResult[1])],
                // });

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
