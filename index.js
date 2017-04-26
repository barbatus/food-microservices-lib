const {
  createCustomerAndAddSource,
  createCharge,
  createRefund,
  addSource,
} = require('./stripe');

const addStripeCard = addSource;

const { execGQLQuery } = require('./gql');

const { processOrderChargeAndRespond } = require('./order');

const updateOrderUnverified = require('./order').updateUnverified;

const updateOrderVerified = require('./order').updateVerified;

module.exports = {
  createCustomerAndAddSource,
  createCharge,
  createRefund,
  addStripeCard,
  execGQLQuery,
  processOrderChargeAndRespond,
  updateOrderUnverified,
  updateOrderVerified,
};
