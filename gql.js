const request = require('request');

const Promise = require('promise');

const endpoint = process.env.ENDPOINT;
const graphcoolToken = `Bearer ${process.env.GC_PAT}`;

function execGQLQuery(query) {
  return new Promise((resolve, reject) => {
    request.post({
      url: endpoint,
      headers: {
        'Authorization': graphcoolToken,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })
    .on('error', (err) => reject(err))
    .on('response', (resp) => resolve());
  });
}

module.exports = {
  execGQLQuery,
};
