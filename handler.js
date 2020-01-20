'use strict';

const dbConnect = require('./db_connect');
const SCHOOLS_TABLE = 'seda_schools';
const DISTRICTS_TABLE = 'seda_districts';
const COUNTIES_TABLE = 'seda_counties'
const VALID_COLS = [
  'id',
  'name',
  'state',
  'state_name',
  'city',
  'all_frl',
  'all_sz',
  'all_grd',
  'all_coh',
  'all_avg',
  'i_pct',
  'b_pct',
  'a_pct',
  'b_pct',
  'w_pct',
  'h_pct'
];

/**
 * returns a query string for the provided table and options
 * @param {string} table 
 * @param {object} options 
 */
const getQueryString = (table, { 
  columns = ['*'], 
  where = null, 
  orderColumn = 'id',
  direction = 'DESC', 
  limit = 100 
}) => {
  let queryString = `SELECT ${columns.join(',')} FROM public.${table} `;
  // add conditions
  if (where && typeof where === 'object') {
    const keys = Object.keys(where);
    keys.forEach((k, i) => {
      queryString += `WHERE ${k} = '${where[k]}' `
      if (i !== (keys.length - 1))
        queryString += `AND `
    })
  }
  // add sorting
  queryString += `ORDER BY ${orderColumn} ${direction} LIMIT ${limit}`;
  return queryString;
}

/**
 * Map the URL query parameters to SQL query parameters
 * @param {object} params 
 */
const getSqlParamsFromQueryParams = (params = {}) => {
  const sqlParams = {}
  if (params.state) {
    sqlParams['where'] = {}
  }
  if (params.state && params.state !== 'US') {
    sqlParams['where']['state'] = params.state;
  }
  if (params.limit) {
    sqlParams['limit'] = params.limit;
  }
  if (params.sort) {
    sqlParams['orderColumn'] = params.sort;
  }
  if (params.asc) {
    sqlParams['direction'] = parseInt(params.asc) === 1 ? 'ASC' : 'DESC';
  }
  if (params.columns) {
    sqlParams['columns'] = params.columns.split(',');
  }
  return sqlParams;
}

/**
 * Runs an SQL query for the given queryString and executes
 * callback on success / fail
 * @param {string} queryString 
 * @param {function} callback 
 */
const runQuery = (queryString, callback) => {
  return dbConnect()
    .then((db) => {
      return db.query(queryString)
        .then(res => {
          callback(null, {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(res)
          })
        })
        .catch(e => {
          console.log(e);
          callback(null, {
            statusCode: e.statusCode || 500,
            body: 'Error: Could not find: ' + e
          })
        })
    });
}

const runQueryById = (table, id, callback) => {
  return dbConnect()
    .then((db) => {
      return db.getById(table, id)
        .then(res => {
          callback(null,{
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(res)
          })
        })
        .catch(e => {
          callback(null,{
            statusCode: e.statusCode || 500,
            body: `Could not find in ${table}: ` + e
          })
        })
      });
}

/**
 * Lambda function to get an individual school
 */
module.exports.getSchool = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  runQueryById(SCHOOLS_TABLE, event.pathParameters.id, callback);
};

/**
 * Lambda function to retrieve schools
 */
module.exports.getSchools = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;  
  const params = getSqlParamsFromQueryParams(event.queryStringParameters);
  const queryString = getQueryString(SCHOOLS_TABLE, params);
  runQuery(queryString, callback);
};


/**
 * Lambda function to get an individual district
 */
module.exports.getDistrict = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  runQueryById(DISTRICTS_TABLE, event.pathParameters.id, callback);
};

/**
 * Lambda function to retrieve districts
 */
module.exports.getDistricts = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;  
  const params = getSqlParamsFromQueryParams(event.queryStringParameters);
  const queryString = getQueryString(DISTRICTS_TABLE, params);
  runQuery(queryString, callback);
};


/**
 * Lambda function to get an individual county
 */
module.exports.getCounty = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  runQueryById(COUNTIES_TABLE, event.pathParameters.id, callback);
};

/**
 * Lambda function to retrieve counties
 */
module.exports.getCounties = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;  
  const params = getSqlParamsFromQueryParams(event.queryStringParameters);
  const queryString = getQueryString(COUNTIES_TABLE, params);
  runQuery(queryString, callback);
};

