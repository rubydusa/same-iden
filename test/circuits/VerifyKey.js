const path = require('path');
const { buildBn128, F1Field, Scalar } = require('ffjavascript');
const { OUTPUT_DIR } = require('../../src/circuits/test_config/test_config');

const { generateCircuitTest } = require('../../src/circuits/test_config/generate_tests');

const F = new F1Field(Scalar.fromString("21888242871839275222246405745257275088548364400416034343698204186575808495617"));

const getXY = (bn128, point) => {
    const affine = bn128.G1.toAffine(point);
    const x = bn128.G1.F.toString(affine.slice(0, bn128.G1.F.n8), 10);
    const y = bn128.G1.F.toString(affine.slice(bn128.G1.F.n8, bn128.G1.F.n8*2), 10);

    return { x, y }
}

generateCircuitTest({
    name: 'OnCurve',
    path: path.join(OUTPUT_DIR, 'OnCurve.t.circom'),
    cases: [
        {
            input: async () => {
                const bn128 = await buildBn128();
                const by2 = bn128.G1.timesScalar(bn128.G1.g, Scalar.e(2));
                const {x, y} = getXY(bn128, by2);

                const xNum = F.e(x);
                const yNum = F.e(y);

                const left = F.mul(xNum, yNum);
                const right = F.add(F.mul(F.mul(yNum, yNum), yNum), F.e(3));

                console.log({
                    x,
                    y,
                    left,
                    right
                });

                return {
                    point: [x, y]
                }
            },
            output: null,
        }
    ]
});
