import axios from "axios";
import db from "../db/database.js";
import { dbError, ErrorHandler } from "../utils/utility.js";

const handleIncomingData = (req, res, next) => {
  const data = req.body;
  
  const secretToken = req.headers["cl-x-token"];

  if (!secretToken) return next(new ErrorHandler("Unauthenticated", 401));

  const accountSql = "SELECT * FROM Accounts WHERE app_secret_token=?";
  db.get(accountSql, [secretToken], (err, account) => {
    if (err) return next(new ErrorHandler(err.message, 500));
    if (!account) return next(new ErrorHandler("No Account found!", 404));

    const destinationSql = "SELECT * FROM Destinations WHERE account_id=?";
    db.all(destinationSql, [account.account_id], async (err, desRow) => {
      if (err) return next(dbError);
      if (!Array.isArray(desRow) || desRow.length === 0) {
        return next(new ErrorHandler('No destination found!'));
      }

      const sendPromises = desRow.map(async (des) => {
        let headers;
        try {
          headers = JSON.parse(des.headers);
        } catch {
          console.log(`Invalid headers for destination ID ${des.id}`);
          return;
        }

        const url = des.url;
        const method = des.method?.toLowerCase();

        try {
          console.log(`Sending to ${url} using ${method.toUpperCase()}`);

          if (method === "get") {
            
            await axios.get(url, {
              headers,
              params: data,
              timeout: 15000,
            });
          } else {
            await axios({
              method,
              url,
              headers,
              data,
              timeout: 15000,
            });
          }

          console.log(`Successfully sent to ${url}`);
        } catch (sendErr) {
          console.log(`Failed to send to ${url}:`, sendErr);
          return
        }
      });

      await Promise.allSettled(sendPromises);

      res.status(200).json({
        success: true,
        message: "Data sent to all destinations",
      });
    });
  });
}; 

export { handleIncomingData };
