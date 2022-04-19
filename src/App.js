import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import './App.css';
import BestsellersPage from './components/BestsellersPage';
import SearchProductsPage from './components/SearchProductsPage';
import TestPage from './components/TestPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark">
          <Container>
            <Nav className="me-auto">
              <Nav.Link
                as={Link}
                to="/"
              >
                Home
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/bestsellers"
              >
                Bestsellers
              </Nav.Link>

              <Nav.Link
                as={Link}
                to="/search-products"
              >
                Search Products
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>

        <Routes>
          <Route
            exact
            path='/'
            element={<TestPage />}
          />
          <Route
            path='/bestsellers'
            element={<BestsellersPage />}
          />
          <Route
            path="/search-products"
            element={<SearchProductsPage />}
          />
        </Routes>

      </div>
    </Router >
  );
}

export default App;
