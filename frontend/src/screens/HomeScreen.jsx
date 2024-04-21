import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Row, Col, Container, Spinner } from 'react-bootstrap';
import Product from '../components/Product';
import axios from 'axios';


const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10; // Количество продуктов на странице
  const observer = useRef();
  const lastProductRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchProducts();
  }, [page, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const query = searchQuery ? `&search=${searchQuery}` : '';
      const { data } = await axios.get(`/api/products?page=${page}&limit=${limit}${query}`);
      setProducts((prevProducts) => (page === 1 ? data : [...prevProducts, ...data]));
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
    setPage(1);
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4">Популярные товары</h2>
      {/* <AutocompleteInput onSearch={handleSearch} className="mb-4" /> */}
      <Row>
        {products.map((product, index) => {
          const isLastProduct = products.length === index + 1;
          return (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3} ref={isLastProduct ? lastProductRef : null}>
              <Product product={product} />
            </Col>
          );
        })}
      </Row>
      {loading && (
        <div className="text-center mt-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
    </Container>
  );
};

export default HomeScreen;