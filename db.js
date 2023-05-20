import {openDatabase} from 'react-native-sqlite-storage';

export function getDBConnection() {
  return openDatabase({name: 'budget-data.db', location: 'default'});
}

const tableNames = {
  entry: 'Entries',
  wallet: 'Wallets',
  category: 'Categories',
};

export async function createTables(db) {
  const query_table_lookup =
    "SELECT name FROM sqlite_master WHERE type='table' AND name='Entries'";

  const query_drop_entries = 'DROP TABLE IF EXISTS Entries';
  const query_drop_wallets = 'DROP TABLE IF EXISTS Wallets';
  const query_drop_categories = 'DROP TABLE IF EXISTS Categories';

  const query_entry = `CREATE TABLE Entries(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    amount INTEGER NOT NULL,
    wallet_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    dateAdded TEXT DEFAULT CURRENT_TIMESTAMP
  )`;

  const query_wallet = `CREATE TABLE Wallets(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    icon_source TEXT NOT NULL,
    dateAdded TEXT DEFAULT CURRENT_TIMESTAMP
)`;

  const query_wallet_insert =
    'INSERT INTO Wallets (id, title, icon_name, icon_source) VALUES (?,?,?,?)';

  const query_cat_insert =
    'INSERT INTO Categories (id, title, icon_name, icon_source) VALUES (?,?,?,?)';

  const query_category = `CREATE TABLE Categories(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    icon_source TEXT NOT NULL,
    dateAdded TEXT DEFAULT CURRENT_TIMESTAMP
)`;

  db.transaction(function (txn) {
    txn.executeSql(
      query_table_lookup,
      [],
      function (tx, res) {
        if (res.rows.length == 0) {
          console.log('Creating Tables');
          tx.executeSql(
            query_drop_entries,
            [],
            () => {},
            err => console.log(err),
          );
          tx.executeSql(query_drop_wallets);
          tx.executeSql(query_drop_categories);
          tx.executeSql(query_entry);
          tx.executeSql(query_wallet);
          tx.executeSql(query_category);

          tx.executeSql(query_wallet_insert, [
            1,
            'Default Wallet',
            'wallet',
            'ant',
          ]);
          tx.executeSql(query_cat_insert, [
            1,
            'Default Category',
            'shopping-bag',
            'feather',
          ]);
        }
      },
      error => console.log(error),
    );
  });
}

export function getItems(db, setter, itemType) {
  db.transaction(tx => {
    getItemsFromTransaction(tx, setter, itemType);
  });
}

function getItemsFromTransaction(tx, setter, itemType) {
  const query_get = 'SELECT * FROM ' + tableNames[itemType];
  tx.executeSql(query_get, [], (tx, results) => {
    let tmp = [];
    for (let i = 0; i < results.rows.length; i++) {
      let nextItem = {...results.rows.item(i)};
      if (Object.keys(nextItem).includes('dateAdded')) {
        nextItem.dateAdded = new Date(nextItem.dateAdded);
      }
      tmp.push(nextItem);
    }
    setter(tmp);
  });
}

export function getItem(db, setter, id, itemType) {
  const query_get = 'SELECT * FROM ' + tableNames[itemType] + ' WHERE id=?';
  db.transaction(tx => {
    tx.executeSql(query_get, [id], (tx, results) => {
      setter(results.rows.item(0));
    });
  });
}

export function addItem(item, db, itemType) {
  const itemKeys = Object.keys(item);

  const query_prefix = 'INSERT INTO ';
  const brackets = '(' + itemKeys.join(', ') + ')';
  const unknonws = '(' + '?,'.repeat(itemKeys.length - 1) + '?)';

  db.transaction(tx => {
    tx.executeSql(
      query_prefix +
        tableNames[itemType] +
        ' ' +
        brackets +
        ' VALUES ' +
        unknonws,
      getItemArray(item, itemKeys),
    );
  });
}

export function removeItem(id, db, itemType) {
  const query_delete_wallet =
    'DELETE FROM ' + tableNames[itemType] + ' WHERE id=?';
  db.transaction(tx => {
    tx.executeSql(query_delete_wallet, [id]);
  });
}

export function editItem(item, db, itemType) {
  var itemKeys = Object.keys(item);

  if (!itemKeys.includes('id')) {
    throw 'No ID Supplied';
  }
  itemKeys = itemKeys.filter(value => value != 'id');

  const query_set = itemKeys.join('=?, ') + '=?';
  itemKeys.push('id');

  db.transaction(tx => {
    tx.executeSql(
      'UPDATE ' + tableNames[itemType] + ' SET ' + query_set + ' WHERE id=?',
      getItemArray(item, itemKeys),
      (txn, res) => {},
      error => {
        console.log('Error editing an item. Error: ' + error.message);
      },
    );
  });
}

function getItemArray(item, itemKeys) {
  let out = [];
  itemKeys.forEach(key => out.push(item[key]));
  return out;
}
