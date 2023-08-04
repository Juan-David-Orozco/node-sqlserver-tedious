const { Connection, Request, TYPES } = require('tedious')
const { db } = require('./config')

const config = {
  server: db.server,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    database: db.dbName,
  },
  authentication: {
    type: "default",
    options: {
      userName: db.user,
      password: db.password
    }
  }
};

const connection = new Connection(config);

// Setup event handler when the connection is established. 
function connectDB () {
  connection.on('connect', function(err) {
    if(err) {
      console.log('Error: ', err)
    }
    // If no error, then good to go...
    console.log("DB is connected")
    //executeStatement();
    //executeProcedure();
    //executeProcedureParameter()
    executeQuery()
  });
  // Initialize the connection.
  connection.connect();
}


// ejecucion de consula DB
function executeStatement() {
  const request = new Request("SELECT DB_NAME()", function(err, rowCount) {
    if (err) {
      console.log(err);
    } else {
      console.log(rowCount + ' rows');
      // and we close the connection
      connection.close()
    }
  });
  
  request.on('row', function(columns) {
    columns.forEach(function(column) {
      console.log(column.value);
    });
  });
  
  connection.execSql(request);
}

// ejecucion sp - sin parametros
function executeProcedure() {
  const sp = '[Sales].[uspGetCreditCardExpiredApril]'
  //const sp = '[dbo].[What_DB_is_this]'
  const request = new Request(sp, function(err, rowCount, rows) {
    if (err) {
      console.log(err);
    } else {
      console.log(rowCount + ' rows');
      console.log(rows)
      // and we close the connection
      connection.close()
    }
  });

  connection.callProcedure(request);
}

// ejecucion sp - con parametros de entrada
function executeProcedureParameter() {
  const sp = '[Sales].[uspGetCreditCardExpiredByMonth]'
  const request = new Request(sp, function(err, rowCount, rows) {
    if (err) {
      console.log(err);
    } else {
      console.log(rowCount + ' rows');
      console.log(rows)
      // and we close the connection
      connection.close()
    }
  })

  request.addParameter('i_month', TYPES.Int, 1);
  request.addParameter('i_cardType', TYPES.VarChar, 'SuperiorCard');

  connection.callProcedure(request);
}

// ejecucion query - con parametros de salida
function executeQuery() {
  const request = new Request("select @number=42, @string='qaz'", function(err, rowCount, rows) {
    if (err) {
      console.log(err);
    } else {
      console.log(rowCount + ' rows');
      console.log(rows)
      // and we close the connection
      connection.close()
    }
  });

  request.on('returnValue', function (parameterName, value, metadata) {
    console.log(parameterName + ' = ' + value)
  }) 

  request.addOutputParameter('number', TYPES.Int);
  request.addOutputParameter('string', TYPES.VarChar);

  connection.execSql(request);
}

module.exports = { connectDB }