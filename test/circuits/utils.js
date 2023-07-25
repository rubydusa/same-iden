const stringPoint = (curve, [x, y]) => [curve.F.toString(x), curve.F.toString(y)];

const pointEq = (curve, [x1, y1], [x2, y2]) => curve.F.eq(x1, x2) && curve.F.eq(y1, y2);

module.exports = {
    stringPoint,
    pointEq
}
