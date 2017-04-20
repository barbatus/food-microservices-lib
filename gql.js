const request = require('request');

const endpoint = process.env.ENDPOINT;
const graphcoolToken = `Bearer ${process.env.GC_PAT}`;

function execGQLQuery(query, onSuccess, onError) {
  return request.post({
    url: endpoint,
    headers: {
      'Authorization': graphcoolToken,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ query }),
  }).on('error', (err) => {
    onError && onError(err);
  }).on('response', (resp) => {
    onSuccess && onSuccess(resp);
  });
}

module.exports = {
  execGQLQuery,
}
