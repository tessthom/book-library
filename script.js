const myLibrary = [];

// Book constructor
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
myLibrary.push(new Book('The Conspiracy of Art', { firstName: 'Jean', lastName: 'Baudrillard' }, 'Art', true));
myLibrary.push(new Book('Dune', { firstName: 'Frank', lastName: 'Herbert' }, 'Sci-fi', true));


// Make and return new book object
function createBookObj(inputs) {
  const title = inputs['title'].value;
  const author = { firstName: inputs['first_name'].value, lastName: inputs['last_name'].value };
  const category = inputs['category'].value;
  const read = inputs['read'].checked;
  
  const book = new Book(title, author, category, read);
  
  return book;
}

function addBookToLibrary(newBook) {
  myLibrary.push(newBook);
}

function deleteBook(bookIndex) {
   myLibrary.splice(bookIndex, 1);
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
        <div class="read-slider-wrapper">
          <label class="switch">
            <input type="checkbox">
            <span class="slider"></span>
          </label>
        <p class="read-para">${read ? 'Read' : 'Not read yet'}</p>
        </div>
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

  cardContainer.replaceChildren(fragment);
}

// TODO: Sanitize form input
let dirty = '<p>Hello, <script>alert("world");</script></p>';
let clean = DOMPurify.sanitize(dirty);
console.log(clean);

console.log(myLibrary[0])

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

window.onload = displayLibrary();

// Add Book Form Submit handler
document.querySelector('.add-book-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const inputs = this.elements;
  console.log(inputs);
  const newBook = createBookObj(inputs);
  addBookToLibrary(newBook);
  displayLibrary();
  updateStats();
  // this.reset();
});

// Card buttons handler
document.querySelector('.cards').addEventListener('click', function(e) {
  const index = e.target.closest('.card').dataset.index;

  const isDeleteBtn = e.target.classList.contains('delete-card-btn');
  if (isDeleteBtn) {
    deleteBook(index);
    displayLibrary();
  }

  const isToggleReadBtn = e.target.classList.contains('slider');
  if (isToggleReadBtn) { 
    const readPara = e.target.closest('.card').querySelector('.read-para');
    myLibrary[index].toggleRead(readPara);
  }
});