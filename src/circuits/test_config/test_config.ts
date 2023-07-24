import path from 'path';
import { generateTestCircuits, Protocol } from './generate_test_circuits';

export const OUTPUT_DIR = path.join(__dirname, '..', 'artifacts', 'test');
const TEST_CIRCUITS = [
    {
        name: 'OnCurve',
        main: 'Main',
        path: path.join(__dirname, '..', 'on_curve.circom'),
        parameters: [],
        publicSignals: [],
        protocol: Protocol.Groth16,
        version: '2.1.5'
    }
];

if (require.main === module) {
    generateTestCircuits(TEST_CIRCUITS, OUTPUT_DIR);
}
