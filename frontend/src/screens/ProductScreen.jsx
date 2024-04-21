import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Image, ListGroup, Card, Button, Container } from 'react-bootstrap';

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  const { id: medId } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${medId}`);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [medId]);

  const { med_name, description, price, qtty, images, med_id, country_name, vendor_name } = product;

  return (
    <Container className="py-5">
      <Link className="btn btn-light mb-4" to="/">
        <i className="fas fa-arrow-left me-2"></i>Назад
      </Link>
      <Row className="align-items-center">
        <Col md={6}>
          <div className="product-image mb-4">
            {images && typeof images === 'string' && (
              <Image
                src={JSON.parse(images)[0]}
                alt={med_name}
                fluid
                rounded
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            )}
          </div>
        </Col>
        <Col md={6}>
          <Card className="product-details h-100">
            <Card.Body>
              <Card.Title as="h2" className="mb-4">{med_name}</Card.Title>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="price-container">
                  <span className="price-label">Цена:</span>
                  <h3 className="price-value">{price} руб.</h3>
                </div>
                <Button
                  variant={qtty > 0 ? 'success' : 'danger'}
                  type="button"
                  disabled={qtty <= 0}
                  className="flex-grow-1 ms-3"
                >
                  {qtty > 0 ? 'Добавить в корзину' : 'Нет в наличии'}
                </Button>
              </div>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Артикул:</span>
                    <span className="fw-bold">{med_id}</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Страна:</span>
                    <span>{country_name}</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Производитель:</span>
                    <span>{vendor_name}</span>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Статус:</span>
                    <span className={`fw-bold ${qtty > 0 ? 'text-success' : 'text-danger'}`}>
                      {qtty > 0 ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </div>
                </ListGroup.Item>
              </ListGroup>
              <Card.Text className="mt-4">{description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductScreen;