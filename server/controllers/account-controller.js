import db from "../db/database.js";
import { generateAccountId, generateToken } from "../utils/features.js";
import { dbError, ErrorHandler } from "../utils/utility.js";

const createAccount = (req, res, next) => {
  console.log("hello", req.body);
  const { account_name, email_id, website } = req.body;

  console.log(account_name);

  if (!email_id || !account_name)
    return next(new ErrorHandler("Email and Name are required!"));

  const account_id = generateAccountId();
  const app_secret_token = generateToken();

  const sql = `INSERT INTO accounts(email_id, account_name, account_id, app_secret_token, website) VALUES(?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [email_id, account_name, account_id, app_secret_token, website],
    function (err) {
      if (err) {
        if (err.message.includes("UNIQUE constraint")) {
          return next(new ErrorHandler("Email already exists", 409));
        }
        return next(dbError);
      }

      res.status(200).json({
        success: true,
        message: "Account created successfully!",
        account: {
          id: this.lastID,
          email: email_id,
          name: account_name,
          account_id,
          secret_token: app_secret_token,
          website,
        },
      });
    }
  );
};

const getAccount = (req, res, next) => {
  const { account_id } = req.params;

  const sql = `SELECT * FROM Accounts WHERE account_id=?`;

  db.get(sql, [account_id], (err, rows) => {
    if (err) return next(dbError);

    if (!rows) return next(new ErrorHandler("Account not found", 404));

    const account = {
      id: rows.id,
      email_id: rows.email_id,
      account_id: rows.account_id,
      account_name: rows.account_name,
      website: rows.website,
    };

    res.status(200).json({
      success: true,
      account,
    });
  });
};

const updateAccount = (req, res, next) => {
  const { account_id } = req.params;
  console.log("update");

  const { account_name, website } = req.body;

  if (!account_name || website === undefined)
    return next(new ErrorHandler("Nothing to update!", 400));

  let sql = "UPDATE accounts SET ";

  const fields = [];
  const values = [];

  if (account_name) {
    fields.push("account_name=?");
    values.push(account_name);
  }

  if (website) {
    fields.push("website=?");
    values.push(website);
  }

  sql += fields.join(", ") + " WHERE account_id=?";
  values.push(account_id);

  console.log(sql);
  db.run(sql, values, function (err) {
    if (err) return next(dbError);

    if (this.changes === 0) {
      return next(new ErrorHandler("Account not found!"));
    }

    res.status(200).json({
      success: true,
      message: "Account updated successfully",
    });
  });
};

const deleteAccount = (req, res, next) => {
  const { account_id } = req.params;

  const sql = `DELETE FROM Accounts WHERE account_id=?`;

  db.run(sql, [account_id], function (err) {
    if (err) return next(dbError);

    if (this.changes === 0)
      return next(new ErrorHandler("Account not found!", 404));

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  });
};

const getAllAccounts = (req, res, next) => {
  const sql = "SELECT * FROM Accounts";

  db.all(sql, [], function (err, rows) {
    console.log(rows);
    if (err) return next(dbError);

    const accounts = rows.map((row) => ({
      id: row.id,
      email_id: row.email_id,
      account_id: row.account_id,
      account_name: row.account_name,
      website: row.website,
    }));

    res.status(200).json({
      success: true,
      accounts,
    });
  });
};

export {
  createAccount,
  getAccount,
  updateAccount,
  deleteAccount,
  getAllAccounts,
};
