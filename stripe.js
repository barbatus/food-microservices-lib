const stripe = require('stripe')(process.env.STRIPE_SECRET);

function createCustomerAndAddSource(
  email, name, source,
  onSuccess, onError
) {
  stripe.customers.create({
    email,
    description: name,
  }, (err, customer) => {
    if (err) {
      console.log(err);
      return onError(err);
    }
    return stripe.customers.createSource(
      customer.id, { source }, (err, card) => {
      if (err) {
        console.log(err);
        return onError(err);
      }
      return onSuccess(customer, card);
    });
  });
}

function createCharge(
  amount, customerId, cardId,
  onSuccess, onError
) {
  console.log(`Charging ${customerId} using ${cardId} card.`);
  stripe.charges.create({
    amount: Math.floor(amount),
    customer: customerId,
    source: cardId,
    currency: 'usd',
    description: 'Nomiku order',
  }, function(err, charge) {
    if (err) {
      console.log(err);
      return onError(err);
    }
    console.log(`Charge ${charge.id} created.`);
    return onSuccess(charge);
  });
}

function createRefund(chargeId, onSuccess, onError) {
  console.log(`Refunding ${chargeId}.`);
  stripe.refunds.create({
    charge: chargeId,
  }, (err, refund) => {
    if (err) {
      console.log(err);
      return onError(err);
    }
    console.log(`Charge ${chargeId} refunded.`);
    return onSuccess(refund);
  });
}

module.exports = {
  createCustomerAndAddSource,
  createCharge,
  createRefund,
};
