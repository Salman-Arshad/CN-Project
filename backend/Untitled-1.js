qcon.query(query, (err, result, col) => {
  // console.log(result);
  console.log(req.body.tableName);
  qcon.query("SHOW KEYS FROM " + req.body.tableName, (err, resultpk) => {
    if (err) {
      console.log(err);
      return;
    }
    var mprimaryKey = [];
    var muniqueKey = [];
    for (var i = 0; i < resultpk.length; i++) {
      if (resultpk[i].Key_name == "PRIMARY") {
        mprimaryKey.push(resultpk[i].Column_name);
      }
      if (resultpk[i].Key_name == resultpk[i].Column_name) {
        muniqueKey.push(resultpk[i].Column_name);
      }
    }

    webRes.json({
      data: result,
      column: col,
      uniqueKey: muniqueKey,
      primaryKey: mprimaryKey
    });
  });
});
