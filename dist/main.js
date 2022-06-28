const Worandle = ( () => {

  const COLOR_TABLE = {
    "gray": "#757575",
    "green": "#12a637",
    "yellow": "#d9d911"
  };

  const keyboard = "QWERTYUIOPASDFGHJKLZXCVBNM";
  const WORD_LENGTH_MIN = 5;
  const WORD_LENGTH_MAX = 9;
  const ALLOWED_GUESSES = 6;

  const word_length = Math.floor(Math.random() * (WORD_LENGTH_MAX - WORD_LENGTH_MIN)) + WORD_LENGTH_MIN;

  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const correct_answer = []

  for (let i = 0; i < word_length; i++) {
    let index = Math.random() * 24;
    correct_answer.push(possible.substring(index, index + 1));
  }

  console.log(correct_answer);

  let is_solved = false;
  let guess_counter = 0;
  let guess_string = [];

  function draw_table() {
    let table = document.getElementById("word-table");
    let parent_row = document.getElementById("row-0");
    let parent_col = document.getElementById("col-0");
    let clone;

    for (let i = 1; i < word_length; i++) {
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
          guess_string.pop();
        } else if (event.key.length == 1 && event.key.match(/[a-zA-Z]/).length > 0 && guess_string.length < word_length) {
          guess_string.push(event.key.toUpperCase());
        } else if (event.key == "Enter" && guess_string.length == word_length) {
          update_table(true);
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
          if (guess_string.length < word_length) {
            guess_string.push(keyboard[i - 1]);
            update_table();
          }
        }
      });
    }

    document.getElementById("enter").addEventListener("click", function(event) {
      if (!is_solved) {
        if (guess_string.length == word_length) {
          update_table(true);
        }
      }
    });

    document.getElementById("delete").addEventListener("click", function(event) {
      if (!is_solved) {
        if (guess_string.length > 0) {
          guess_string.pop();
          update_table();
        }
      }
    });
  }

  function update_table(enter_was_pressed = false) {

    let row = document.getElementById("row-" + guess_counter);
    let cols = row.children;

    if (!enter_was_pressed) {
      for (let i = 0; i < guess_string.length; i++) {
        cols[i].querySelector('#letter').innerHTML = guess_string[i]
      }

      for (let i = guess_string.length; i < word_length; i++) {
        cols[i].querySelector('#letter').innerHTML = '';
      }
    } else {

      let correct_counter = 0;

      for (let i = 0; i < word_length; i++) {

        let color = "";
        let column = cols[i].querySelector('#letter-div');

        if (guess_string[i] == correct_answer[i]) {
          color = "green";
          correct_counter++;
        } else if (correct_answer.includes(guess_string[i])) {
          color = "yellow";
        } else {
          color = "gray";
        }

        column.setAttribute('style', "background-color: " + COLOR_TABLE[color] + "; border-color: " + COLOR_TABLE[color] + ";");
      }

      if (correct_counter < word_length) {
        guess_counter++;
        guess_string = [];
      } else {
        is_solved = true;
      }

    }

  }

  function init() {
    draw_table();
    keyboard_listener();
  }

  return {
    init,
  }

})();

window.onload = (() => {
  Worandle.init();
});