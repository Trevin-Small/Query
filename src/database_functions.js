import { ref, get, set } from "firebase/database";
import { db } from './init.js';

export const Database = (() => {

  async function set_data(data_path, data) {
    set(ref(db, data_path), data);
  }

  async function get_data(data_path) {
    const data_ref = ref(db, data_path);
    const snapshot = await get(data_ref);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return undefined;
  }

  return {
    set_data,
    get_data,
  }

})();