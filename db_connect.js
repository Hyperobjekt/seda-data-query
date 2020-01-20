const PgConnection = require('postgresql-easy');

// Load the AWS SDK
var AWS = require('aws-sdk'),
    region = "us-east-1";

// Create a Secrets Manager client
var client = new AWS.SecretsManager({
    region: region
});

// Call the AWS API and return a Promise
function getAwsSecret(secretName) {
  return client.getSecretValue({ SecretId: secretName }).promise();
}

// Create a async function to use the Promise
// Top level await is a proposal
function getConnection (secretName) {
  return getAwsSecret(secretName)
    .then((data) => {
      if ('SecretString' in data) {
        const secret = JSON.parse(data.SecretString);
        const config = {
          database: secret.engine,
          host: secret.host,
          port: secret.port,
          user: secret.username,
          password: secret.password
        }
        return new PgConnection(config);
      }
    })
    .catch((err) => { console.log(err) });
}

function getDbConnection () {
  const secretName = "prod/Seda/Postgres";
  return getConnection(secretName)
}; 

module.exports = getDbConnection;