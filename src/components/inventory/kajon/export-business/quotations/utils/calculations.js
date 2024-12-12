export const calculateTotals = (products) => {
  return products.reduce((totals, product) => ({
    netWeightTotal: totals.netWeightTotal + Number(product.netWeight || 0),
    grossWeightTotal: totals.grossWeightTotal + Number(product.grossWeight || 0),
    measureTotal: totals.measureTotal + Number(product.measure || 0)
  }), {
    netWeightTotal: 0,
    grossWeightTotal: 0,
    measureTotal: 0
  });
};