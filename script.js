const myLibrary = [];

// Book constructor fn (will refactor using class later)
function Book(title, author, category, read) {
  this.title = title;
  this.author = author;
  this.category = category;
  this.read = read;
}

// Toggle read status
Book.prototype.toggleRead = function (readPara) {
  this.read = !this.read;
  readPara.innerText = this.read ? 'Read' : 'Not read yet!';
}

// Make 3 example cards using the Book constructor in order to show the card UI during dev and still have access to the methods defined on the prototype:
myLibrary.push(new Book('And the Band Played On', { firstName: 'Randy', lastName: 'Shilts' }, 'History', true));
myLibrary.push(new Book('The Conspiracy of Art', { firstName: 'Jean', lastName: 'Baudrillard' }, 'Art', false));
myLibrary.push(new Book('Dune', { firstName: 'Frank', lastName: 'Herbert' }, 'Sci-fi', true));


// Make and return new book object
function createBookObj(inputs) {
  const title = inputs['title'];
  const author = { firstName: inputs['first_name'], lastName: inputs['last_name'] };
  const category = inputs['category'];
  const read = inputs['read_status'];
  
  const book = new Book(title, author, category, read);
  
  return book;
}

function addBookToLibrary(newBook) {
  myLibrary.push(newBook);
}

function deleteBook(bookIndex) {
  myLibrary.splice(bookIndex, 1);
}

// Takes book object and its index value in the Library array, returns a card element populated with data from args
function createCard({ title, author, category, read }, index) {
  const newCard = document.createElement('div');
  newCard.classList.add('card');
  newCard.dataset.index = index;

  newCard.innerHTML = `
    <div class="book-text">
      <h3>${title}</h3>
      <div class="book-details-wrapper">
        <p>${author.lastName}, ${author.firstName}</p>
        <p>${category}</p>
        <div class="read-slider-wrapper">
          <label class="switch">
            <input type="checkbox">
            <span class="slider"></span>
          </label>
        <p class="read-para">${read ? 'Read' : 'Not read yet'}</p>
        </div>
      </div>
    </div>
    <button class="delete-card-btn pill">Delete Book</button>
  `;

  if (read) {
    newCard.querySelector('input[type="checkbox"]').checked = true;
  }

  return newCard;
}

// Loop through the library and display each book on the page
function displayLibrary() {
  const cardContainer = document.querySelector('.cards');
  const fragment = new DocumentFragment();

  myLibrary.forEach((book, index) => {
    // Add card to larger document fragment
    fragment.append(createCard(book, index));
  });
  // Update the card container's content
  cardContainer.replaceChildren(fragment);
}

// TODO: Write a fn that updates the stats after new book added.
function updateStats() {
  // iterate through library accumulating values (USE REDUCE??)
  // then update UI with new values
  const stats = {
    read: 0,
    unread: 0,
    totalFiction: 0,
    totalNonFiction: 0,
    categories: {
      art: 0,
      biography: 0,
      history: 0,
      politics: 0,
      science: 0,
      selfhelp: 0,
      adventure: 0,
      fantasy: 0,
      mystery: 0,
      romance: 0,
      scifi: 0,
      western: 0,
      ya: 0,
    }
  };
  // TODO: should i use reduce() to create totals for each?
  // myLibrary.forEach();
}

// Initial display of cards:
window.onload = displayLibrary();

// Open New Book dialog
(() => {
  const dialog = document.querySelector('.new-book-dialog');
  const dialogWrapper = dialog.querySelector('.dialog-wrapper');
  const openDialogBtn = document.querySelector('.new-book-btn');
  
  openDialogBtn.addEventListener('click', function(e) {
    dialog.showModal();
  });
  
  dialog.addEventListener('click', function(e) {
    if (!dialogWrapper.contains(e.target)) {
      dialog.close();
      openDialogBtn.focus();
    }
  });
  
  document.querySelector('.close-dialog-btn').addEventListener('click', function(e) {
    // TODO: UNCOMMENT THIS LINE BEFORE PROD
    // e.preventDefault();
    dialog.close();
    openDialogBtn.focus();
  });
})();

// Add Book Form Submit handler
document.querySelector('.add-book-form').addEventListener('submit', function(e) {
  // Prevent default form behavior since doing this all client side right now
  e.preventDefault();

  // Make new instance of FormData object to get input data. Passing `this` means we're passing in the element that triggered the event, because we're inside of the addEventListener method, which means `this` refers to whatever we invoked it on, in this case the form :)
  const formData = new FormData(this);
  // The FormData object gets populated with the form's current keys/vals. The keys are the name properties of each element and their values are the submitted values.
  console.log(formData);
  // Make empty object to hold sanitized inputs
  const cleanInputs = {};

  // Loop over every key/value pair in the formData object for this submission
  for (let [name, value] of formData) {
    // If the current key is for the read_status select input...
    if (name === 'read_status') {
      // Set the value to a boolean based on if the 'Read' radio button was returned, because radio type inputs return the val of the radio button that's checked, which will either be 'Read' or 'Unread' on this form
      cleanInputs[name] = value === 'Read' ? true : false;
    } else {
      // If the current key is not a radio button, sanitize it:
      cleanInputs[name] = DOMPurify.sanitize(value);
    }
  }
  // console.log(cleanInputs);

  // Make a new book object with the sanitized inputs
  const newBook = createBookObj(cleanInputs);
  console.log(newBook);

  addBookToLibrary(newBook);
  displayLibrary();
  updateStats();
  // TODO: Uncomment this line after dev session to clear form after submission:
  // this.reset();
});

// Card buttons handler
document.querySelector('.cards').addEventListener('click', function(e) {
  // Get the index data attribute from the card containing the click
  const index = e.target.closest('.card').dataset.index;

  // Determine if click was for delete button
  const isDeleteBtn = e.target.classList.contains('delete-card-btn');
  if (isDeleteBtn) {
    deleteBook(index);
    displayLibrary();
  }

  // Determine if click was for the read status toggle slider
  const isToggleReadBtn = e.target.classList.contains('slider');
  if (isToggleReadBtn) { 
    // Use index to target the book object in the Library array that the parent card represents, and pass the new display text to the toggleRead() method for that card, thus updating the card's label for the toggle slider 
    const readPara = e.target.closest('.card').querySelector('.read-para');
    myLibrary[index].toggleRead(readPara);
  }
}); 