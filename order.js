const { json, send } = require('micro');

const createCharge = require('./stripe').createCharge;

const execGQLQuery = require('./gql').execGQLQuery;

function processOrderChargeAndRespond(
  totalCost, userId, orderId,
  userStripeId, cardStripeId
) {
  console.log(`Order ${orderId} is about to be charged.`);
  createCharge(
    totalCost * 100, userStripeId, cardStripeId,
    (charge) => {
      console.log(`Order ${orderId} charged successfully.`);
      const updateOrder = `mutation {
        updateOrder(
          id: "${orderId}",
          isPaid: true,
          chargeId: "${charge.id}",
        ) {
          id
        }
      }`;
      return execGQLQuery(updateOrder,
        () => send(res, 200, {
          message: `Customer ${userId} was charged
            and purchase ${orderId} was NOT marked as paid.`,
        }),
        () => send(res, 200, {
          message: `Customer ${userId} was charged
            and purchase ${orderId} was marked as paid.`,
        })
      );
    },
    (err) => send(res, 400, {
      error: `Customer ${userId} could not be charged by Stripe.`,
    })
  );
}

function updateUnverified(orderId, onSuccess) {
  const updateData = `mutation {
    updateOrder(
      id: "${orderId}",
      isVerified: false
    ) {
      id
    }
  }`;
  return execGQLQuery(updateData, onSuccess,
    (err) => send(res, 400, {
      error: `Order ${orderId} could not be updated.`,
    })
  );
}

function updateVerified(orderId) {
  const updateData = `mutation {
    updateOrder(
      id: "${orderId}",
      adminStatus: UPDATED,
      isVerified: true
    ) {
      id
    }
  }`;
  return execGQLQuery(updateData,
    () => send(res, 200, {
      message: `Order ${orderId} has been updated.`,
    }),
    (err) => send(res, 400, {
      error: `Order ${orderId} could not be updated.`,
    })
  );
}

module.exports = {
  processOrderChargeAndRespond,
  updateUnverified,
  updateVerified,
};
