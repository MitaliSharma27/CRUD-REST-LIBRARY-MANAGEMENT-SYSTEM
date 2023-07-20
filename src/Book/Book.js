import axios from 'axios';
import { useEffect, useState } from "react";

function Book() {
  const [id, setId] = useState('');
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("");

  const [books, setBooks] = useState([]);

  useEffect(() => {
    (async () => await load())();
  }, []);

  async function load() {
    try {
      const result = await axios.get("http://localhost:8088/api/books");
      setBooks(result.data);
    } catch (error) {
      console.log("Error fetching books:", error);
    }
  }

  async function save(event) {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8088/api/book/add", {
        title: title,
        category: category,
        department: department
      });
      alert("Registration Successful");
      load();
      setId(''); // Reset id after successful registration
    } catch (err) {
      console.error("Error registering book:", err);
      if (err.response) {
        console.log("Error response data:", err.response.data);
      }
      alert("Book Registration Failed");
    }
  }

  async function editBook(book) {
    setTitle(book.title);
    setCategory(book.category);
    setDepartment(book.department);
    setId(book.id);
  }

  async function deleteBook(id) {
    try {
      await axios.delete("http://localhost:8088/api/book/delete/" + id);
      alert("Book deleted Successfully");
      load();
    } catch (err) {
      alert("Book Deletion Failed");
    }
  }

  async function update(event) {
    event.preventDefault();
    try {
      await axios.put("http://localhost:8088/api/book/update/" + (books.find(u => u.id === id)?.id || id), {
        id: id,
        title: title,
        category: category,
        department: department
      });
      alert("Registration Updated");
      load();
      setId(''); // Reset id after successful update
    } catch (err) {
      console.error("Error updating book:", err);
      if (err.response) {
        console.log("Error response data:", err.response.data);
      }
      alert("Registration Update Failed");
    }
  }

  return (
    <div>
      <h1>Book Details</h1>
      <div className="container mt-4">
        <form>
          <div className="form-group">
            <input  type="text" className="form-control" id="book_id" hidden
            value={id}
            onChange={(event) => setId(event.target.value)}
            />
            <label>Book Name</label>
            <input  type="text" className="form-control" id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input  type="text" className="form-control" id="category" 
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input type="text" className="form-control" id="department" 
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            />
          </div>

          <div>
            <button className="btn btn-primary mt-4" onClick={save}>Register</button>
            <button className="btn btn-warning mt-4" onClick={update}>Update</button>
          </div>
        </form>
      </div>

      <table className="table table-dark" align="center">
        <thead>
          <tr>
            <th scope="col">Book Id</th>
            <th scope="col">Book Title</th>
            <th scope="col">Category</th>
            <th scope="col">Department</th>
            <th scope="col">Option</th>
          </tr>
        </thead>
        {books.map(book => (
          <tbody key={book.id}>
            <tr>
              <th scope="row">{book.id}</th>
              <td>{book.title}</td>
              <td>{book.category}</td>
              <td>{book.department}</td>
              <td>
                <button type="button" className="btn btn-warning" onClick={() => editBook(book)}>Edit</button>
                <button type="button" className="btn btn-danger" onClick={() => deleteBook(book.id)}>Delete</button>
              </td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
}

export default Book;
