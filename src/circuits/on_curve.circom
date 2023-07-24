pragma circom 2.1.5;

include "../../node_modules/ec-elgamal-circuit/circuits/onCurve.circom";

template Main() {
    signal input point[2];

    component isOnCurve = OnCurve();

    isOnCurve.p <== point;
    isOnCurve.out === 1;
}
