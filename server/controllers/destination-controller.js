import db from "../db/database.js";
import { dbError, ErrorHandler } from "../utils/utility.js";

const createDestination = (req, res, next) => {
  const { account_id, url, method, headers } = req.body;

  if (
    !account_id ||
    !url ||
    !method ||
    !headers ||
    typeof headers !== "object"
  ) {
    return next(new ErrorHandler("Missing or Invalid fields", 400));
  }

  const checkSql = `SELECT * FROM Destinations WHERE account_id = ? AND url = ? AND method = ?`;

  db.get(checkSql, [account_id, url, method], (err, row) => {
    if (err) return next(dbError);

    if (row)
      return next(
        new ErrorHandler(
          `Destination with url:${url} and method:${method} already exists for the account`,
          400
        )
      );

    const insertSql = `INSERT INTO Destinations(account_id, url, method, headers) VALUES (?, ?, ?, ?)`;

    const headersString = JSON.stringify(headers);

    db.run(
      insertSql,
      [account_id, url, method, headersString],
      function (err) {
        if (err) return next(dbError);

        const {APP_SECRET,...header} = headers

        res.status(200).json({
          success: true,
          destination: {
            id: this.lastID,
            account_id,
            url,
            method,
            header,
          },
        });
      }
    );
  });
};

const getDestination = (req, res, next) => {
  const { account_id } = req.params;

  const sql = "SELECT * FROM destinations WHERE account_id = ?";

  db.all(sql, [account_id], (err, rows) => {
    if (err) return next(dbError);

    const destinations = rows.map((row) => {
      const parsedHeaders = JSON.parse(row.headers);

      delete parsedHeaders.APP_SECRET;

      return {
        ...row,
        headers: parsedHeaders,
      };
    });

    res.status(200).json({
      success: true,
      destinations,
    });
  });
};

const updateDestination = (req, res, next) => {
  const { id } = req.params;

  const { url, method, headers } = req.body;

  if (!url && !method && !headers)
    return next(new ErrorHandler("Nothing to update!", 400));

  let sql = "UPDATE Destinations SET ";

  const field = [];
  const values = [];

  if (url) {
    field.push("url=?");
    values.push(url);
  }

  if (method) {
    field.push("method=?");
    values.push(method);
  }

  if (headers) {
    field.push("headers=?");
    values.push(JSON.stringify(headers));
  }

  values.push(id);

  sql += field.join(", ") + " WHERE id=?";

  db.run(sql, values, function (err) {
    if (err) return next(dbError);

    if (this.changes === 0) {
      return next(new ErrorHandler("Destination not found!", 404));
    }

    res.status(200).json({
      success: true,
      message: "Destination updated successfully!",
    });
  });
};

const deleteDestination = (req, res, next) => {
  const { id } = req.params;

  const sql = "DELETE FROM Destinations WHERE id=?";

  db.run(sql, [id], function (err) {
    if (err) return next(dbError);

    if (this.changes === 0)
      return next(new ErrorHandler("Destination not found!", 404));

    res.status(200).json({
      success: true,
      message: "Destination deleted successfully!",
    });
  });
};

const getAllDestination = (req, res, next) => {
  const sql = "SELECT * FROM Destinations";

  db.all(sql, [], (err, rows) => {

    console.log(rows)
    const destinations = rows.map((row)=>{

      const parsedHeaders = JSON.parse(row.headers)
      delete parsedHeaders.APP_SECRET;
      return ({
        ...row,
        headers:parsedHeaders
      })
    })
    if (err) return next(dbError);

    res.status(200).json({
      success: true,
      destinations
    });
  });
};

export {
  createDestination,
  getDestination,
  updateDestination,
  deleteDestination,
  getAllDestination,
};
