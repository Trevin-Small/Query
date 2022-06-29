import { ref, set, onValue } from "firebase/database";
import { db } from './index.js';

export const Database = (() => {

  let daily_word = {};
  let dictionary = {};
  let stats = {};

  // set(ref(db, 'users/' + userId), {
  //   username: name,
  //   email: email,
  //   profile_picture : imageUrl
  // });

  function get_data(field, data_path, only_once = false) {
    const data_ref = ref(db, data_path);
    onValue(data_ref, (snapshot) => {
      field = snapshot.val();
    }, {
      onlyOnce: only_once
    });

    return field;
  }

  function get_daily_word() {
    return get_data(daily_word, 'daily_word', true);
  }

  function get_dictionary(word_length) {
    return get_data(dictionary, 'dictionary/dict_' + word_length, false);
  }

  function get_stats() {
    return get_data(stats, 'stats', true);
  }

  return {
    daily_word,
    dictionary,
    stats,
    get_data,
    get_daily_word,
    get_dictionary,
    get_stats,
  }

})();