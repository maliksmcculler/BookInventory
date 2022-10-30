class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');
    // Create tr element 
    const row = document.createElement('tr');
    // insert into table 
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a class="delete" href="#">X</a></td>
    `;
    list.appendChild(row);
  }

  showAlert(message, className) {
    // Create div
    const div = document.createElement('div');
    // add class
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.container');
    // get form
    const form = document.querySelector('#book-form');
    // insert alert
    container.insertBefore(div, form);

    // Timeout after 
    setTimeout(function () {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  deleteBook(target) {
    if (target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }

  clearFields() {
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('isbn').value = '';
  }
}

// Local Storage Class
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach(function (book) {
      const ui = new UI;

      // Add book to ui
      ui.addBookToList(book)

    })
  }

  static addBook(book) {
    const books = Store.getBooks();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach(function (book, index) {
      if (book.isbn === isbn) {
        books.splice(index, 1)
      }
    })

    localStorage.setItem('books', JSON.stringify(books));

  }
}
// Dom load event
document.addEventListener('DOMContentLoaded', Store.displayBooks)
// Event Listeners
document.getElementById('book-form').addEventListener('submit',
  function (e) {
    // get form values
    const title = document.getElementById('title').value,
      author = document.getElementById('author').value,
      isbn = document.getElementById('isbn').value
    // Instantiate a Book
    const book = new Book(title, author, isbn);

    // Instantiate UI
    const ui = new UI();

    // Validate
    if (title === '' || author === '' || isbn === '') {
      // Error Alert
      ui.showAlert('Please fill in all required fields', 'error');
    } else {
      // Add book to UI 
      ui.addBookToList(book);

      // Add to local storage
      Store.addBook(book);

      // Add Book to list
      ui.showAlert('Book Added!', 'success');

      // clear fields
      ui.clearFields();
    }
    e.preventDefault();
  });

// Event Listener for delete
document.getElementById('book-list').addEventListener('click', function (e) {
  // Instantiate New UI
  const ui = new UI();

  // Delete Book
  ui.deleteBook(e.target);

  // remove from local storage
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  // show message
  ui.showAlert('Book Removed!', 'success');



  e.preventDefault();
});