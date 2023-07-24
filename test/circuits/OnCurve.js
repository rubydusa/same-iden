const path = require('path');
const { buildBabyjub } = require('circomlibjs');
const { OUTPUT_DIR } = require('../../src/circuits/test_config/test_config');

const { generateCircuitTest } = require('../../src/circuits/test_config/generate_tests');

generateCircuitTest({
    name: 'OnCurve',
    path: path.join(OUTPUT_DIR, 'OnCurve.t.circom'),
    cases: [
        {
            input: async () => {
                const babyjub = await buildBabyjub();
                const { x, y } = {
                    x: babyjub.F.toString(babyjub.Base8[0]),
                    y: babyjub.F.toString(babyjub.Base8[1])
                }
                return {
                    point: [x, y]
                }
            },
            output: null,
        }
    ]
});
