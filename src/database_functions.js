import { ref, get, set, onValue } from "firebase/database";
import { db } from './init.js';

export const Database = (() => {

  // set(ref(db, 'users/' + userId), {
  //   username: name,
  //   email: email,
  //   profile_picture : imageUrl
  // });

  async function get_data(data_path) {
    const data_ref = ref(db, data_path);
    const snapshot = await get(data_ref);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return undefined;
  }

  return {
    get_data,
  }

})();