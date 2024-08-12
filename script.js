// TODO: Find API to add thumbnails of book covers to cards based on title search. Use default cover not found.

// Book class
    // Private fields: #title, #firstName, #lastName, #genre, #readStatus
    // Constructor: accepts title, firstName, lastName, genre, readStatus
    // Getter methods for all fields
    // toggleReadStatus method: flips #readStatus

class Book {
  // Private fields
  #title;
  #firstName;
  #lastName;
  #genre;
  #readStatus;

  constructor({ title, firstName, lastName, genre, readStatus }) {
    this.#title = title;
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#genre = genre;
    this.#readStatus = readStatus;
  }

  // Getters and Setters
  get title() {
    return this.#title;
  }

  set title(newTitle) {
    if (!newTitle) {
      // TODO: MUST CATCH THESE ERRORS
      // like: try { const newBook = new Book({ title: '', firstName: 'Jane', ... })} catch (error) { console.error(error.message)}
      throw new Error('Title cannot be empty.');
    }
    this.#title = newTitle;
  }

  get firstName() {
    return this.#firstName;
  }

  set firstName(newFirstName) {
    if (!newFirstName) {
      throw new Error('First name cannot be empty.');
    }
    this.#firstName = newFirstName;
  }

  get lastName() {
    return this.#lastName;
  }

  set lastName(newLastName) {
    if (!newLastName) {
      throw new Error('Last name cannot be empty.');
    }
    this.#lastName = newLastName;
  }

  get genre() {
    return this.#genre;
  }

  set genre(newGenre) {
    this.#genre = newGenre;
  }

  get readStatus() {
    return this.#readStatus;
  }

  set readStatus(newReadStatus) {
    this.#readStatus = newReadStatus;
  }

  // Methods
  toggleReadStatus() {
    this.#readStatus = !this.#readStatus;
  }
}

// Library class
  // Private field: #books (array)
  // Constructor: initializes empty #books array
  // addBook method: accepts Book object, adds to #books
  // removeBook method: accepts index, removes book from #books
  // getBook method: accepts index, returns book
  // getIndex method: accepts book, returns index
  // getBooksCount method: returns length of #books
  // getReadBooksCount method: returns count of read books
  // getUnreadBooksCount method: returns count of unread books

class Library {
  // Private field
  #books;

  constructor() {
    this.#books = [];
  }

  // Public methods
  addBook(newBook) {
    this.#books.push(newBook);
  }

  removeBook(bookIndex) {
    this.#books.splice(bookIndex, 1);
  }

  getBookIndex(book) {
    return this.#books.indexOf(book);
  }

  getBookByIndex(index) {
    return this.#books[index];
  }

  // Getters
  get books() {
    return this.#books;
  }

  get bookCount() {
    return this.#books.length;
  }

  get readBooksCount() {
    // Using reduce to get a count of book elements with a truthy readStatus value is less readable but avoids creating an intermediate array like filter does
    return this.#books.reduce((acc, currBook) => acc + (currBook.readStatus ? 1 : 0), 0);
  }

  get unreadBooksCount() {
    // return this.#books.filter(book => !book.readStatus).length;
    return this.#books.reduce((acc, currBook) => acc + (currBook.readStatus ? 0 : 1), 0);
  }
}

// BookView class
  // Constructor: accepts Book object and an index value
  // render method: returns DOM element representing the book
      // Called by LibraryView when rendering books
      // Access #book's properties via getters
      // Use index to populate dataset.index on new card el
      // Create and return a DOM el "card"

class BookView {
  // Private field
  #book;
  #index;

  constructor(book, index) {
    this.#book = book;
    this.#index = index;
  }

  // Public methods
  createBookCard() {
    // Returns a DOM element with book instance's properties and a data-index attribute set to the book's index from the library array
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.dataset.index = this.#index;

    newCard.innerHTML = `
      <div class="book-text">
        <h3>${this.#book.title}</h3>
        <div class="book-details-wrapper">
          <p class="author">${this.#book.lastName}, ${this.#book.firstName}</p>
          <p>${this.#book.genre}</p>
          <div class="read-slider-wrapper">
            <label class="switch">
              <input type="checkbox" class="read-checkbox">
              <span class="slider ${this.#book.readStatus ? 'checked' : 'unchecked'}"></span>
            </label>
          <p class="read-para">${this.#book.readStatus ? 'Read' : 'Not read yet'}</p>
          </div>
        </div>
      </div>
      <button class="delete-card-btn pill">Delete Book</button>
    `;

    if (this.#book.readStatus) {
      newCard.querySelector('input[type="checkbox"]').checked = true;
    }

    return newCard;
  }
}

// BookCardHandler class
  // Private fields: #library, #libraryView, #cardContainer
  // Constructor: accepts library, libraryView, cardContainer
    // Sets up click event listener on cardContainer
  // handleCardClick method: delegates to appropriate method based on click target
  // handleDeleteClick method: removes book from library, updates LibraryView
  // handleToggleReadClick method: toggles book read status, updates card UI
  // updateCardUI method: updates card DOM to reflect book status
    // Called by handleToggleReadClick

class BookCardHandler {
  // Private fields
  #library;
  #libraryView;
  #cardElement;
  #bookIndex;

  constructor(library, libraryView, cardElement) {
    this.#library = library;
    this.#libraryView = libraryView;
    this.#cardElement = cardElement;
    this.#bookIndex = +cardElement.dataset.index;

    // Sets up click event listener on cardContainer
    this.#cardElement.addEventListener('click', this.handleCardClick);
  }

  // Public methods
  handleCardClick = (e) => {
    // delegates to appropriate method based on click target
    const target = e.target;
    if (target.classList.contains('delete-card-btn')) {
      this.handleDeleteClick();
    } else if (target.classList.contains('read-checkbox')) {
      this.handleToggleReadClick();
    }
  }

  handleDeleteClick() {
    // removes book from library, updates libraryView
    this.#library.removeBook(this.#bookIndex);
    this.#libraryView.displayLibrary();
  }

  handleToggleReadClick() {
    // toggles book's readStatus, updates card UI (calls it?)
    this.#library.getBookByIndex(this.#bookIndex).toggleReadStatus();
    this.updateCardUI();
  }

  updateCardUI() {
    // updates card DOM to reflect book's new property values/readStatus.
    const book = this.#library.getBookByIndex(this.#bookIndex);
    const slider = this.#cardElement.querySelector('.slider');
    const readPara = this.#cardElement.querySelector('.read-para');
    const checkbox = this.#cardElement.querySelector('.read-checkbox');

    slider.classList.toggle('checked', book.readStatus);
    slider.classList.toggle('unchecked', !book.readStatus);
    readPara.textContent = book.readStatus ? 'Read' : 'Not read yet';
    checkbox.checked = book.readStatus;
  }
}

// TODO:
// BookFormHandler class
  // Private fields: #form, #dialog, #library, #libraryView
  // Constructor: accepts library, libraryView
    // Gets form and dialog elements
    // Sets up submit event listener on form
    // Sets up click event listener on form close button
  // showForm method: shows dialog
    // Called by LibraryView when "New Book" button is clicked
  // closeForm method: hides dialog
  // handleFormSubmit method: creates Book, adds to library, updates LibraryView
  // resetForm method: clears form inputs

class BookFormHandler {
  // Private fields
  #form;
  #dialog;
  #closeBtn;
  #showFormBtn;
  #library;
  #libraryView;

  constructor(library, libraryView, newBookBtn) {
    this.#library = library;
    this.#libraryView = libraryView;
    this.#showFormBtn = newBookBtn;

    this.#dialog = document.querySelector('.new-book-dialog');
    this.#form = document.querySelector('.add-book-form');
    this.#closeBtn = document.querySelector('.close-dialog-btn');

    // Set up submit event listener on form
    this.#form.addEventListener('submit', this.handleFormSubmit);
    // Set up click event listener on form close button
    this.#closeBtn.addEventListener('click', this.closeForm);
  }

  // Public methods
  showForm() {
    this.#dialog.showModal();

    this.#dialog.addEventListener('click', (e) => {
      if (this.isClickOutsideDialog(e)) {
        this.closeForm(e);
        this.#showFormBtn.focus();
      }
    });
  }

  isClickOutsideDialog(e) {
    const dialogWrapper = this.#dialog.querySelector('.dialog-wrapper');
    return !dialogWrapper.contains(e.target);
  }

  closeForm = (e) => {
    e.preventDefault();
    this.#dialog.close();
  }

  resetForm() {
    this.#form.reset();
  }

  handleFormSubmit = (e) => {
    // Prevent default behavior since no backend right now
    e.preventDefault();

    const inputToDataModelMap = {
      title: 'title',
      last_name: 'lastName',
      first_name: 'firstName',
      genre: 'genre',
      read_status: 'readStatus'
    };

    const formData = new FormData(this.#form);
    const dataModel = {};

    // Iterate over every key/value pair in the formData object in order to map to property names
    for (let [key, value] of formData) {
      const modelKey = inputToDataModelMap[key];

      // If the current key is for the read_status select input...
      if (key === 'read_status') {
        // Set the value to a boolean based on what string was returned. Have to do this because radio type inputs return the value of the button that's checked, which will be either 'Read' or 'Unread'
        dataModel[modelKey] = value === 'Read';
      } else {
        // If the current key isn't a radio button, sanitize the input string:
        dataModel[modelKey] = DOMPurify.sanitize(value);
      }

    }
    // Make a new book object with the sanitized inputs that have been mapped to the appropriate property name formats that the Library class expects
    try {
      const newBook = new Book(dataModel);
  
      this.#library.addBook(newBook);
      this.#libraryView.displayLibrary();
    } catch (error) {
      console.error(error.message);
      // TODO: Display error to user
    }

    this.closeForm(e);
    this.resetForm();
  }
}

// TODO:
// StatisticsManager class
  // Constructor: accepts library
  // updateStatistics method: calculates stats, updates DOM
    // Called by LibraryView after library changes

class StatsManager {
  // Private field
  #library;

  constructor(library) {
    this.#library = library;
  }
}

// LibraryView class
    // Private fields: #library, #cardHandler, #formHandler, #statsManager
    // Constructor: accepts library
        // Creates instances of CardHandler, BookFormHandler, StatisticsManager
        // Sets up click event listener for "New Book" button
    // displayLibrary method: clears container, creates cards for all books (using BookView.createBookCard)
        // Called by App.init and after library changes
    // ???createCard method: uses BookView to create card
        // Called by displayLibrary for each book

class LibraryView {
  // Private fields
  #library;
  #libraryContainer;
  #formHandler;
  #statsManager;

  constructor(library, libraryContainer) {
    this.#library = library;
    this.#libraryContainer = libraryContainer;

    const newBookBtn = document.querySelector('.new-book-btn');
    this.#formHandler = new BookFormHandler(this.#library, this, newBookBtn);
    this.#statsManager = new StatsManager();

    // Set up click event listener for "New Book" button, cb should be showForm?
    // TODO: should this call an initForm() method instead of showForm()? or does creating a new instance of form handler do the same stuff you'd imagine an initForm method would do?
    newBookBtn.addEventListener('click', () => this.#formHandler.showForm());
  }

  // Public methods
  displayLibrary() {
    // clears container, creates cards for all books (using BookView.renderBookCard?), called by App.init and after library changes
    const fragment = new DocumentFragment();

    // for each book in the library instance's books array, creates a new instance of the BookView class, then adds it to the HTML fragment, then inserts it into the DOM, replacing any existing contents inside of the library container element
    this.#library.books.forEach((book, index) => {
      const newBookView = new BookView(book, index);
      const newCardElement = newBookView.createBookCard();
      
      // Create new instance of BookCardHandler for each new card
      new BookCardHandler(this.#library, this, newCardElement);

      // Add card to larger document fragment
      fragment.append(newCardElement);
    });
    
    // Update the card container's content
    this.#libraryContainer.replaceChildren(fragment);

    // Update stats
    // this.#library.updateStats();

    // called by App.init and after library changes
  }
}

// App class
// Private fields: #library, #libraryView
// Constructor: creates Library and LibraryView instances (be sure to pass document.querySelector('.cards') to LibraryView class as the 2nd argument)
    // init method: calls libraryView.displayLibrary
        // Called when DOMContentLoaded event fires

class App1 {
  // Private fields
  #library;
  #libraryView;

  constructor() {
    this.#library = new Library();
    this.#libraryView = new LibraryView(
      this.#library, 
      document.querySelector('.cards')
    );

    // Populate library with dummy book data on page load
    dummyBooks.forEach(dummyBook => {
      const newBook = new Book(dummyBook);
      this.#library.addBook(newBook);
    });
  }


  init() {
    this.#libraryView.displayLibrary();
  }
}

// Dummy data to init library display with on page load
const dummyBooks = [
  {
    title: 'And the Band Played On',
    firstName: 'Randy',
    lastName: 'Shilts',
    genre: 'History',
    readStatus: true,
  },
  {
    title: 'The Consipracy of Art',
    firstName: 'Jean',
    lastName: 'Baudrillard',
    genre: 'Art',
    readStatus: false,
  },
  {
    title: 'Dune',
    firstName: 'Frank',
    lastName: 'Herbert',
    genre: 'Sci-fi',
    readStatus: true,
  }
]

// Event Listener (at the bottom of the script or in a separate init file)
    // DOMContentLoaded: creates App instance, calls init method

document.addEventListener('DOMContentLoaded', () => {
  const app = new App1();
  app.init();
});