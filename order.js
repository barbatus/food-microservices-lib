const { json, send } = require('micro');

const { createCharge } = require('./stripe');

const { execGQLQuery } = require('./gql');

async function processOrderChargeAndRespond(
  totalCost, userId, orderId,
  userStripeId, cardStripeId
) {
  try {
    console.log(`Order ${orderId} is about to be charged.`);
    const charge = await createCharge(
      totalCost * 100, userStripeId, cardStripeId);

    const updateOrder = `mutation {
      updateOrder(
        id: "${orderId}",
        isPaid: true,
        chargeId: "${charge.id}",
      ) {
        id
      }
    }`;
    await execGQLQuery(updateOrder);
    console.log(`Order ${orderId} charged successfully.`);

    send(res, 200, {
      message: `Customer ${userId} was charged
        and purchase ${orderId} was marked as paid.`,
    });
  } catch (error) {
    send(res, 400, { error: error.message });
  }
}

async function updateUnverified(orderId, onSuccess) {
  try {
    const updateData = `mutation {
      updateOrder(
        id: "${orderId}",
        isVerified: false
      ) {
        id
      }
    }`;
    await execGQLQuery(updateData);
  } catch(error) {
    send(res, 400, { error: error.message });
  }
}

async function updateVerified(orderId) {
  try {
    const updateData = `mutation {
      updateOrder(
        id: "${orderId}",
        adminStatus: UPDATED,
        isVerified: true
      ) {
        id
      }
    }`;
    await execGQLQuery(updateData);
  } catch(error) {
    send(res, 400, { error: error.message });
  }
}

module.exports = {
  processOrderChargeAndRespond,
  updateUnverified,
  updateVerified,
};
