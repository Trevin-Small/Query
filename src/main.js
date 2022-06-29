import { Database } from "./database_functions";

export const Worandle = (async () => {

  const COLOR_TABLE = {
    "gray": "#757575",
    "green": "#12a637",
    "yellow": "#d9d911"
  };

  const keyboard = "QWERTYUIOPASDFGHJKLZXCVBNM";
  const ALLOWED_GUESSES = 6;

  let daily_word = await Database.get_data('DAILY_WORD', true);
  let dictionary = await Database.get_data('DICTIONARY/DICT_' + daily_word["LENGTH"], false);
  let stats = await Database.get_data('STATS', true);

  let is_solved = false;
  let guess_counter = 0;
  let guess_arr = [];

  console.log("Word: " + daily_word["WORD"]);
  console.log(dictionary);

  function guess_str() {
    let guess_string = "";

    guess_arr.forEach((char) => {
      guess_string += char;
    });

    return guess_string;
  }

  function is_valid_guess() {

    let guess_string = guess_str();
    console.log("Guess str: " + guess_string);

    if (dictionary[guess_string] == "") {
      return true;
    }

    console.log("Invalid guess");
    return false;
  }

  function draw_table() {
    let table = document.getElementById("word-table");
    let parent_row = document.getElementById("row-0");
    let parent_col = document.getElementById("col-0");
    let clone;

    for (let i = 1; i < daily_word["LENGTH"]; i++) {
      clone = parent_col.cloneNode(true);
      clone.setAttribute('id', 'col-' + i);
      parent_row.appendChild(clone);
    }

    for (let j = 1; j < ALLOWED_GUESSES; j++) {
      clone = parent_row.cloneNode(true);
      clone.setAttribute('id', 'row-' + j);
      table.appendChild(clone);
    }
  }

  function keyboard_listener() {
    document.addEventListener('keydown', function(event) {

      if (!is_solved) {
        if (event.key == "Backspace") {
          guess_arr.pop();
        } else if (event.key.length == 1 && event.key.match(/[a-zA-Z]/).length > 0 && guess_arr.length < daily_word["LENGTH"]) {
          guess_arr.push(event.key.toUpperCase());
        } else if (event.key == "Enter" && guess_arr.length == daily_word["LENGTH"]) {
          if (is_valid_guess()) {
            update_table(true);
          } else {
            error_message("Sorry, '" + guess_str() + "' isn't in our dictionary!");
          }
        } else {
          return;
        }

        update_table();
      }
    });

    let key_button;

    for (let i = 1; i <= 26; i++) {
      key_button = document.getElementById(i);
      key_button.addEventListener("click", function(event) {
        if (!is_solved) {
          if (guess_arr.length < daily_word["LENGTH"]) {
            guess_arr.push(keyboard[i - 1]);
            update_table();
          }
        }
      });
    }

    document.getElementById("enter").addEventListener("click", function(event) {
      if (!is_solved) {
        if (guess_arr.length == daily_word["LENGTH"]) {
          if (is_valid_guess()) {
            update_table(true);
          } else {
            error_message("Sorry, '" + guess_str() + "' isn't in our dictionary!");
          }
        }
      }
    });

    document.getElementById("delete").addEventListener("click", function(event) {
      if (!is_solved) {
        if (guess_arr.length > 0) {
          guess_arr.pop();
          update_table();
        }
      }
    });
  }

  function update_table(enter_was_pressed = false) {

    let row = document.getElementById("row-" + guess_counter);
    let cols = row.children;

    if (!enter_was_pressed) {
      for (let i = 0; i < guess_arr.length; i++) {
        cols[i].querySelector('#letter').innerHTML = guess_arr[i]
      }

      for (let i = guess_arr.length; i < daily_word["LENGTH"]; i++) {
        cols[i].querySelector('#letter').innerHTML = '';
      }
    } else {

      let correct_counter = 0;

      for (let i = 0; i < daily_word["LENGTH"]; i++) {

        let color = "";
        let column = cols[i].querySelector('#letter-div');

        if (guess_arr[i] == daily_word["WORD"][i]) {
          color = "green";
          correct_counter++;
        } else if (daily_word["WORD"].includes(guess_arr[i])) {
          color = "yellow";
        } else {
          color = "gray";
        }

        column.setAttribute('style', "background-color: " + COLOR_TABLE[color] + "; border-color: " + COLOR_TABLE[color] + ";");
      }

      if (correct_counter < daily_word["LENGTH"]) {
        guess_counter++;
        guess_arr = [];
      } else {
        is_solved = true;
      }

    }

  }

  function error_message() {
    
  }

  draw_table();
  keyboard_listener();

})();