import { Database } from "./database_functions";

export const Worandle = (async () => {

  /* Color codes for letter correctness indication */
  const COLOR_TABLE = {
    "gray": "#636363",
    "green": "#12a637",
    "yellow": "#d9d911"
  };

  /* Messages displayed to the user based on performance */
  const MESSAGES = [
    "Hole in one! 🤩",
    "Just two takes! 🎉",
    "Excellent work! 💡",
    "Solid solve! 👍",
    "Late solve! 😬",
    "Close one! 😅",
    "You lose! 💩"
  ]

  /* The order (left to right, top to bottom) of the onscreen keyboard */
  const keyboard = "QWERTYUIOPASDFGHJKLZXCVBNM";

  /* Number of allowed guesses */
  const ALLOWED_GUESSES = 6;

  /* Retrieve the daily word from the database */
  let daily_word = await Database.get_data('DAILY_WORD', true);

  /* Retrieve the correct dictionary subset from the database */
  let dictionary = await Database.get_data('DICTIONARY/DICT_' + daily_word["LENGTH"], false);

  /* Retrieve the solution statistics from the database */
  let stats = await Database.get_data('STATS', true);

  /* Tracks whether the puzzle has been completed or not */
  let is_completed = false;

  /* Tracks the win state of the game */
  let win_state = false;

  /* Number of guesses counter */
  let guess_counter = 0;

  /* Array for storing user-input characters */
  let guess_arr = [];

  console.log("Word: " + daily_word["WORD"]);
  console.log(dictionary);

  /* Takes the guess_arr[] and returns a string form */
  function guess_str() {
    let guess_string = "";

    guess_arr.forEach((char) => {
      guess_string += char;
    });

    return guess_string;
  }

  /* Checks whether the user input word is in the dictionary */
  function is_valid_guess() {
    let guess_string = guess_str();

    if (dictionary[guess_string] == "") {
      return true;
    }

    return false;
  }

  /*
   * Based on the daily word's length, create the
   * rows and column divs that need to be displayed
   */
  function draw_table() {
    let table = [];
    let table_container = document.getElementById("word-table");
    let parent_row = document.getElementById("row-0");
    let parent_col = document.getElementById("col-0");
    let clone;

    table.push(parent_row);

    for (let i = 1; i < daily_word["LENGTH"]; i++) {
      clone = parent_col.cloneNode(true);
      clone.setAttribute('id', 'col-' + i);
      parent_row.appendChild(clone);
    }

    for (let j = 1; j < ALLOWED_GUESSES; j++) {
      clone = parent_row.cloneNode(true);
      clone.setAttribute('id', 'row-' + j);
      table_container.appendChild(clone);
      table.push(clone);
    }

    resize_table(table, table_container);
  }

  function resize_table(table) {
    // 28rem is max width, times 16px conversion rate (rem -> px)
    const MAX_WIDTH = 28 * 16;
    const MARGIN = 1;

    function resize() {
      let remaining_height = document.getElementById("main-container").offsetHeight - document.getElementById("keyboard-container").offsetHeight - document.getElementById("message-tag").offsetHeight;
      let remaining_width = document.getElementById("table-container").offsetWidth;

      if (remaining_width > MAX_WIDTH) { remaining_width = MAX_WIDTH; }

      console.log("Height: " + remaining_height);
      console.log("Width: " + remaining_width);

      table.forEach((row) => {
        let y_height = (remaining_height / ALLOWED_GUESSES) - (2 * MARGIN * ALLOWED_GUESSES);
        let x_width = (remaining_width / daily_word["LENGTH"]) - (2 * MARGIN * daily_word["LENGTH"]);
        let table_dim = Math.min(x_width, y_height) + "px";
        row.style.height = table_dim;

        console.log("Cell Dim: " + table_dim);

        for (let col = 0; col < daily_word["LENGTH"]; col++) {
          row.children[col].style.width = table_dim;
        }
      });
    }

    resize();

    window.addEventListener('resize', resize);

  }

  /*
   * Create eventListeners on all on-screen keys, and listen for a hardware
   * keyboard input (on a computer). call update_table() to display inputs
   */
  function keyboard_listener() {
    document.addEventListener('keydown', function(event) {

      if (!is_completed) {
        if (event.key == "Backspace") {
          guess_arr.pop();
        } else if (event.key.length == 1 && event.key.match(/[a-zA-Z]/).length > 0 && guess_arr.length < daily_word["LENGTH"]) {
          guess_arr.push(event.key.toUpperCase());
        } else if (event.key == "Enter" && guess_arr.length == daily_word["LENGTH"]) {
          if (is_valid_guess()) {
            update_table(true);
          } else {
            message_tag("'" + guess_str() + "' isn't in our dictionary!");
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
        if (!is_completed) {
          if (guess_arr.length < daily_word["LENGTH"]) {
            guess_arr.push(keyboard[i - 1]);
            update_table();
          }
        }
      });
    }

    document.getElementById("enter").addEventListener("click", function(event) {
      if (!is_completed) {
        if (guess_arr.length == daily_word["LENGTH"]) {
          if (is_valid_guess()) {
            update_table(true);
          } else {
            message_tag("'" + guess_str() + "' isn't in our dictionary!");
          }
        }
      }
    });

    document.getElementById("delete").addEventListener("click", function(event) {
      if (!is_completed) {
        if (guess_arr.length > 0) {
          guess_arr.pop();
          update_table();
        }
      }
    });
  }

  /*
   * Update the table to display user-entered letters, and change the
   * color of letters to indicate their correctness.
   */
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

      /*
       * Count number of correct letters. If word is 5 letters long
       * with 5 correct letters, the game has been won.
      */
      let correct_counter = 0;

      /*
       * Iterate through the entered letters and change their colors
       * to their correct value (green, yellow, or gray)
       */
      for (let i = 0; i < daily_word["LENGTH"]; i++) {

        let color = "";
        let column = cols[i].querySelector('#letter-div');

        /* If letter is in the final word and correct position: green */
        if (guess_arr[i] == daily_word["WORD"][i]) {
          color = "green";

          /* Keep track of how many letters are correct */
          correct_counter++;

        /* If the letter is in the final word but wrong position: yellow */
        } else if (daily_word["WORD"].includes(guess_arr[i])) {
          color = "yellow";

        /* If letter is not in the final word: gray */
        } else {
          color = "gray";
        }

        /* Set background and border color of cell to correct color */
        column.setAttribute('style', "background-color: " + COLOR_TABLE[color] + "; border-color: " + COLOR_TABLE[color] + ";");
      }

      console.log("Count: " + guess_counter);

      /* WIN: If num correct letters = num of word letters */
      if (correct_counter == daily_word["LENGTH"]) {
        is_completed = true;
        win_state = true;
        message_tag(MESSAGES[guess_counter], true);
        display_popup();

       /* LOSE: If player reaches maximum number of guesses */
      }  else if (guess_counter == ALLOWED_GUESSES - 1) {
        is_completed = true;
        message_tag(MESSAGES[guess_counter + 1], true);
        display_popup();

      /* CONTINUE: If num correct letters < num of word letters */
      } else if (correct_counter < daily_word["LENGTH"]) {
        guess_counter++;
        guess_arr = [];
      }

    }

  }

  /*
   * Displays the popup window with the daily word and stats
   */
  function display_popup() {
    let popup = document.getElementById("popup");
    let success_div = document.getElementById("success-div");
    let success_caption = document.getElementById("success-caption");
    let word_caption = document.getElementById("word-caption");
    let guess_caption = document.getElementById("guess-caption");
    let solves_today = document.getElementById("solves-caption");
    let solve_graph = [];
    let solve_percents = [];

    for (let i = 1; i <= ALLOWED_GUESSES; i++) {
      solve_graph.push(document.getElementById(i + "-guess"));
      solve_percents.push(document.getElementById(i + "-%"));
    }

    popup.style.display = "block";
    success_div.style.backgroundColor = win_state ? "green" : "red";
    success_caption.innerHTML = win_state ? "COMPLETED" : "FAILED";
    word_caption.innerHTML = "WORD: " + daily_word["WORD"];
    guess_caption.innerHTML = "GUESSES: " + (guess_counter + 1);
    solves_today.innerHTML = stats["SOLVES_TODAY"] + " SOLVES TODAY";

    for (let i = 0; i < ALLOWED_GUESSES; i++) {
      let percent = stats["SOLVES_TODAY"] > 0 ? stats["GUESS_DISTRIBUTIONS"][i] * 100 / stats["SOLVES_TODAY"] : 0;
      solve_graph[i].style.width = Math.floor((percent / 100) * (document.getElementById("graph-div").offsetWidth - 5)) + 5 + "px";
      solve_percents[i].innerHTML = percent + "%";
    }
  }

  /*
   * Display a given message string to the user
   */
  function message_tag(text, stay_visible = false) {
    /* Get the message box div */
    const message = document.getElementById('message-tag');

    /* Get the message label */
    const message_text = document.getElementById('message-text');

    /* Set the message label text */
    message_text.innerHTML = text;

    /* Show the message */
    message.style.visibility = "visible";

    /* If stay_visible is false, set a timer to hide the message */
    if (!stay_visible) {
      setTimeout(() => {
        /* Hide the message */
        message.style.visibility = "hidden";
      }, 2500);
    }
  }

  /* Required functions to run the game */
  draw_table();
  keyboard_listener();

})();