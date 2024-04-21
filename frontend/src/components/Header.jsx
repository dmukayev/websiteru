import React, { useState } from 'react';
import { Navbar, Nav, Container, Form } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import logo from '../logo.png';
import { LinkContainer } from 'react-router-bootstrap';
import AutocompleteInput from './AutocompleteInput';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Здесь можно выполнить действия, связанные с поиском
  };

  return (
    <header>
      <Navbar bg="light" variant="light" expand="lg" className="py-3 shadow-sm">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="d-flex align-items-center">
              <img src={logo} alt="AptekaLandysh" className="mr-2" style={{ width: '50px', height: '50px' }} />
              <span className="brand-text">aptekaLandysh</span>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="navbarSearch" />
          <Navbar.Collapse id="navbarSearch" className="flex-grow-1">
            <Form className="d-flex w-100 search-form">
              <AutocompleteInput
                onSearch={handleSearch}
                className="flex-grow-1 "
                placeholder="Найти лекарство..."
              />
              <button type="button" className="btn btn-success search-button">
                <FaSearch />
              </button>
            </Form>
            <Nav className="ml-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart /> Корзина
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to="/login">
                <Nav.Link>
                  <FaUser /> Войти
                </Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;