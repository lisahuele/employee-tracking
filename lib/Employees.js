const db = require('../db/connection');

var rolesArr = [];
function role() {
  db.query("SELECT * FROM roles", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      rolesArr.push(res[i].title);
    }

  })
  return roleArr;
}

var managersArr = [];
function manager() {
  db.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
}

module.exports = {manager, role};
module.exports = [rolesArr, managersArr];
