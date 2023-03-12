const { Connection, Request } = require('tedious')
const { db } = require('./config')

const config = {
  server: db.server,
  options: {
    encrypt: true,
    trustServerCertificate: true
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
connection.on('connect', function(err) {
  if(err) {
    console.log('Error: ', err)
  }
  // If no error, then good to go...
  console.log("DB is connected")
  executeStatement();
});

// Initialize the connection.
connection.connect();


// ejecucion de consulta
function executeStatement() {
  const request = new Request("select 42, 'hello world'", function(err, rowCount) {
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

