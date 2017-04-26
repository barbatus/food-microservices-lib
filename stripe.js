const stripe = require('stripe')(process.env.STRIPE_SECRET);

const Promise = require('promise');

function createCustomerAndAddSource(email, name, source) {
  return new Promise((resolve, reject) => {
    stripe.customers.create({
      email,
      description: name,
    }, (err, customer) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return stripe.customers.createSource(
        customer.id, { source }, (err, card) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve({ customer, card });
      });
    });
  });
}

function addSource(customerId, source) {
  return new Promise((resolve, reject) => {
    stripe.customers.createSource(
      customerId, { source }, (err, card) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        return resolve(card);
      });
  });
}

function createCharge(amount, customerId, cardId) {
  console.log(`Charging ${customerId} using ${cardId} card.`);
  return new Promise((resolve, reject) => {
    stripe.charges.create({
      amount: Math.floor(amount),
      customer: customerId,
      source: cardId,
      currency: 'usd',
      description: 'Nomiku order',
    }, (err, charge) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log(`Charge ${charge.id} created.`);
      return resolve(charge);
    });
  });
}

function createRefund(chargeId) {
  console.log(`Refunding ${chargeId}.`);
  return new Promise((resolve, reject) => {
    stripe.refunds.create({
      charge: chargeId,
    }, (err, refund) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      console.log(`Charge ${chargeId} refunded.`);
      return resolve(refund);
    });
  });
}

module.exports = {
  createCustomerAndAddSource,
  addSource,
  createCharge,
  createRefund,
};
