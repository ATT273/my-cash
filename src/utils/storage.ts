// Save DB to IndexedDB
export async function saveToIndexedDB(db: any, key = "moneyAppDB") {
  const data = db.export(); // returns Uint8Array
  const blob = new Blob([data]);

  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open("MoneyAppStorage", 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore("databases");
    };

    request.onsuccess = () => {
      const tx = request.result.transaction("databases", "readwrite");
      tx.objectStore("databases").put(blob, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    };

    request.onerror = () => reject(request.error);
  });
}

// Load DB from IndexedDB
export async function loadFromIndexedDB(SQL: any, key = "moneyAppDB") {
  return new Promise<any>((resolve, reject) => {
    const request = indexedDB.open("MoneyAppStorage", 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore("databases");
    };

    request.onsuccess = () => {
      const tx = request.result.transaction("databases", "readonly");
      const getReq = tx.objectStore("databases").get(key);

      getReq.onsuccess = () => {
        if (getReq.result) {
          const reader = new FileReader();
          reader.onload = () => {
            const uInt = new Uint8Array(reader.result as ArrayBuffer);
            const db = new SQL.Database(uInt);
            resolve(db);
          };
          reader.readAsArrayBuffer(getReq.result);
        } else {
          resolve(null); // no db saved yet
        }
      };

      getReq.onerror = () => reject(getReq.error);
    };

    request.onerror = () => reject(request.error);
  });
}
