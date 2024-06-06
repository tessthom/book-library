const myLibrary = [
  // some object literals just to see the display working as it's built
  {
    title: 'And the Band Played On',
    author: { firstName: 'Randy', lastName: 'Shilts' },
    category: 'History',
    read: true,
  },
  {
    title: 'The Conspiracy of Art',
    author: { firstName: 'Jean', lastName: 'Baudrillard' },
    category: 'Art',
    read: true,
  },
  {
    title: 'Dune',
    author: { firstName: 'Frank', lastName: 'Herbert' },
    category: 'Sci-fi',
    read: true,
  },
];

// Book constructor
function Book(title, author, category, read) {
  this.title = title;
  this.author = author;
  this.category = category;
  this.read = read;
}

// Shared method on prototype that returns sentence with all book info
Book.prototype.info = function () {
  return this.read 
    ? `${this.title} by ${this.author}, ${this.pages} pages, have read.` 
    : `${this.title} by ${this.author}, ${this.pages} pages, not read yet.`;
};

// Toggle read status
Book.prototype.toggleRead = function () {
  return !this.read;
}

// Takes a book object as arg, adds to Library
function addBookToLibrary(newBook) {
  // this fn should take user's input and store the new book objects into the array
  myLibrary.push(newBook);
}

// Make and return new book object
function createBookObj(inputs) {
  const title = inputs['title'].value;
  const author = { firstName: inputs['first_name'].value, lastName: inputs['last_name'].value };
  const category = inputs['category'].value;
  const read = inputs['read'].checked;

  const book = new Book(title, author, category, read);
  
  return book;
}

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
      <p>${read ? 'Read' : 'Not read yet'}</p>
    </div>
    </div>
    <button class="delete-card-btn">Delete Book</button>
  `;

  return newCard;
}

// Fn that loops through the library and displays each book on the page
function displayLibrary() {
  const cardContainer = document.querySelector('.cards');
  const fragment = new DocumentFragment();

  myLibrary.forEach((book, index) => {
    fragment.append(createCard(book, index));
  });

  // cardContainer.append(fragment);
  cardContainer.replaceChildren(fragment);
}

let dirty = '<p>Hello, <script>alert("world");</script></p>';
let clean = DOMPurify.sanitize(dirty);
console.log(clean);

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
  myLibrary.forEach();
}

// In the event handler that calls displayLibrary, when checking what card's delete button got clicked, can check the dataset-index value on the parent div.card to determine which card to delete
window.onload = displayLibrary();

// Add Book Form Submit handler
const addBookForm = document.querySelector('.add-book-form');
addBookForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const inputs = addBookForm.elements;
  const newBook = createBookObj(inputs);
  addBookToLibrary(newBook);
  displayLibrary();
  updateStats();
  this.reset();
});