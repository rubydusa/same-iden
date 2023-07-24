pragma circom 2.1.5;

include "../../node_modules/circomlib/circuits/poseidon.circom";
include "./verify_key.circom";

template PointBasedElGamal() {
    // public
    signal pk[2][2];
    
    // private
    signal g[2];

    component sk = Poseidon(2);
    sk.inputs <== g;

    component verify = VerifyKey();
    verify.pk <== pk;
    verify.sk <== sk.out;
}
