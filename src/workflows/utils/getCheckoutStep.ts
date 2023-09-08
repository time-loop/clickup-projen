export function getCheckoutStep() {
  const step = {
    name: 'Checkout',
    uses: 'actions/checkout@c85c95e3d7251135ab7dc9ce3241c5835cc595a9', // v3.5.3
  };
  return step;
}
