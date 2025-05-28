import sqldb from 'sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const dbPath = path.join(path.dirname(fileURLToPath(import.meta.url)),'data.db')

const db = new sqldb.Database(dbPath,(err)=>{
    if(err) return console.error('DB connection error',err.message)
    console.log('Connected to DB!')
})

db.serialize(()=>{
    db.run('PRAGMA foreign_keys = ON;');
    db.run(`
        CREATE TABLE IF NOT EXISTS Accounts(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email_id TEXT UNIQUE NOT NULL,
            account_id TEXT UNIQUE NOT NULL,
            account_name TEXT NOT NULL ,
            app_secret_token TEXT UNIQUE NOT NULL,
            website TEXT
        )    
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Destinations(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            account_id TEXT NOT NULL,
            url TEXT NOT NULL,
            method TEXT NOT NULL,
            headers TEXT NOT NULL,
            FOREIGN KEY (account_id) REFERENCES Accounts(account_id) ON DELETE CASCADE
        )
    `)
})

export default db
