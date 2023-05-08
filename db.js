import {openDatabase} from 'react-native-sqlite-storage';

export function getDBConnection() {
  return openDatabase({name: 'budget-data.db', location: 'default'});
}

export async function createTables(db) {
  const query_table_lookup =
    "SELECT name FROM sqlite_master WHERE type='table' AND name='Wallets'";

  const query_entry = `CREATE TABLE IF NOT EXISTS Entries(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount INTEGER NOT NULL,
    wallet_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL

  )`;

  const query_drop_entries = 'DROP TABLE Entries';
  const query_drop_wallets = 'DROP TABLE Wallets';
  const query_drop_categories = 'DROP TABLE Categories';

  const query_wallet = `CREATE TABLE Wallets(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    icon_source TEXT NOT NULL
)`;

  const query_wallet_insert =
    'INSERT INTO Wallets (id, title, icon_name, icon_source) VALUES (?,?,?,?)';

  const query_category = `CREATE TABLE IF NOT EXISTS Categories(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    icon_source TEXT NOT NULL,
    default_wallet_id INTEGER NOT NULL
)`;

  db.transaction(function (txn) {
    txn.executeSql(query_table_lookup, [], function (tx, res) {
      if (res.rows.length == 0) {
        console.log('Creating Tables');

        tx.executeSql(query_drop_entries);
        tx.executeSql(query_drop_wallets);
        tx.executeSql(query_drop_categories);

        tx.executeSql(query_entry);
        tx.executeSql(query_wallet);
        tx.executeSql(query_category);

        tx.executeSql(query_wallet_insert, [
          1,
          'DefaultWallet',
          'wallet',
          'ant',
        ]);
      }
    });
  });
}

export function getWallets(db, setter) {
  db.transaction(tx => {
    getWalletsFromTransaction(tx, setter);
  });
}

function getWalletsFromTransaction(tx, setter) {
  const query_get_wallets = 'SELECT * FROM Wallets';
  tx.executeSql(query_get_wallets, [], (tx, results) => {
    let tmp = [];
    for (let i = 0; i < results.rows.length; i++) {
      tmp.push(results.rows.item(i));
    }
    setter(tmp);
  });
}

export function addWallet(item, db) {
  let hasId = Object.keys(item).includes('id');
  const query_insert_wallet =
    'INSERT INTO Wallets (' +
    (hasId ? 'id' : '') +
    'title, icon_name, icon_source) VALUES (' +
    (hasId ? '?,' : '') +
    '?,?,?)';
  db.transaction(tx => {
    tx.executeSql(query_insert_wallet, [
      item.title,
      item.icon_name,
      item.icon_source,
    ]);
  });
}

export function removeWallet(id, db) {
  const query_delete_wallet = 'DELETE FROM Wallets WHERE id=?';
  db.transaction(tx => {
    tx.executeSql(query_delete_wallet, [id]);
  });
}

export function editWallet(item, db) {
  const query_edit_wallet = `UPDATE Wallets SET 
    title=?,
    icon_name=?,
    icon_source=?
  WHERE
    id=?`;
  db.transaction(tx => {
    tx.executeSql(
      query_edit_wallet,
      [item.title, item.icon_name, item.icon_source, item.id],
      (txn, res) => {},
      error => {
        console.log('Error editing a Wallet item. Error: ' + error.message);
      },
    );
  });
}
