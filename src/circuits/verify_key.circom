pragma circom 2.1.5;

include "../../node_modules/ec-elgamal-circuit/circuits/multiplyPoint.circom";

// verify that a public key is produced by the secret key
template VerifyKey() {
    signal input pk[2][2];
    signal input sk;

    component product = MultiplyPoint(254);
    product.c <== sk;
    product.p <== pk[0];

    pk[1] === product.out;
}
