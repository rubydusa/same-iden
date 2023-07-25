pragma circom 2.1.5;

include "../../node_modules/circomlib/circuits/escalarmulany.circom";
include "../../node_modules/circomlib/circuits/babyjub.circom";
include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../../node_modules/circomlib/circuits/bitify.circom";

function Base8() {
    return [
        5299619240641551281634865583518297030282874472190772894086521144482721001553,
        16950150798460657717958625567821834550301663161624707787222815936182638968203
    ];
}

// does not check validity of point
template PointHash() {
    signal input point[2];
    signal output hash;

    component hasher = Poseidon(2);
    hasher.inputs <== point;

    hash <== hasher.out;
}

// does not check validity of point
// remove need to convert to bits every time
template EscalarMulNoBits(N) {
    signal input in;
    signal input p[2];
    signal output out[2];
    
    component bits = Num2Bits(N);
    bits.in <== in;

    component genPoint = EscalarMulAny(N);
    genPoint.e <== bits.out;
    genPoint.p <== p;

    out <== genPoint.out;
}

// Check that secret key is generated correctly from point on curve:
//
// B - base point on babyjubjub
// H - hash function
//
// The Relationship between skGen and sk:
// H([skGen]B) === sk
template ValidSK() {
    signal input skGen;
    signal input sk;

    signal output point[2];

    component skPoint = EscalarMulNoBits(254);
    skPoint.in <== skGen;
    skPoint.p <== Base8();
    component skGenerate = PointHash();
    skGenerate.point <== skPoint.out;
    skGenerate.hash === sk;

    point <== skPoint.out;
}

template SameIden() {
    // encrypted sk points
    signal input eSkPoint1[2];  // public
    signal input eSkPoint2[2];  // public

    signal input sk1Gen;
    signal input sk2Gen;

    signal input sk1;
    signal input sk2;

    component validateSk1 = ValidSK();
    component validateSk2 = ValidSK();

    validateSk1.skGen <== sk1Gen;
    validateSk1.sk <== sk1;
    validateSk2.skGen <== sk2Gen;
    validateSk2.sk <== sk2;

    component eSkPoint1Calc = EscalarMulNoBits(254);
    component eSkPoint2Calc = EscalarMulNoBits(254);

    eSkPoint1Calc.in <== sk2;
    eSkPoint1Calc.p <== validateSk1.point;
    eSkPoint2Calc.in <== sk1;
    eSkPoint2Calc.p <== validateSk2.point;

    eSkPoint1Calc.out === eSkPoint1;
    eSkPoint2Calc.out === eSkPoint2;
}

template OnCurve() {
    signal input point[2];

    component check = BabyCheck();
    check.x <== point[0];
    check.y <== point[1];
}
