const path = require('path');
const { buildBabyjub, buildPoseidon } = require('circomlibjs');
const { Scalar, ZqField } = require('ffjavascript');
const { OUTPUT_DIR } = require('../../src/circuits/test_config/test_config');

const { generateCircuitTest } = require('../../src/circuits/test_config/generate_tests');

generateCircuitTest({
    name: 'SameIden',
    path: path.join(OUTPUT_DIR, 'SameIden.t.circom'),
    cases: [
        {
            input: async () => {
                const babyjub = await buildBabyjub();

                const sk1Gen = Scalar.e("4");
                const sk2Gen = Scalar.e("6");

                const sk1Point = babyjub.mulPointEscalar(babyjub.Base8, sk1Gen);
                const sk2Point = babyjub.mulPointEscalar(babyjub.Base8, sk2Gen);

                const poseidon = await buildPoseidon();

                const sk1 = babyjub.F.toString(poseidon([babyjub.F.toString(sk1Point[0]), babyjub.F.toString(sk1Point[1])]));
                const sk2 = babyjub.F.toString(poseidon([babyjub.F.toString(sk2Point[0]), babyjub.F.toString(sk2Point[1])]));

                const eSkPoint1 = babyjub.mulPointEscalar(sk1Point, sk2);
                const eSkPoint2 = babyjub.mulPointEscalar(sk2Point, sk1);

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

                const res = {
                    eSkPoint1: [babyjub.F.toString(eSkPoint1[0]), babyjub.F.toString(eSkPoint1[1])],
                    eSkPoint2: [babyjub.F.toString(eSkPoint2[0]), babyjub.F.toString(eSkPoint2[1])],
                    sk1Gen: Scalar.toString(sk1Gen),
                    sk2Gen: Scalar.toString(sk2Gen),
                    sk1: Scalar.toString(sk1),
                    sk2: Scalar.toString(sk2)
                };

                return res;
            },
            output: null,
        }
    ]
});
