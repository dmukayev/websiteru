import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  const defaultImage = '../../images/product-no-photo.png';

  // Попытка парсить images, предполагая что это JSON-строка
  let images = [];
  if (product.images && typeof product.images === 'string') {
    try {
      images = JSON.parse(product.images);
    } catch (e) {
      console.error('Ошибка при разборе JSON:', e);
    }
  }

  // Определяем, какое изображение использовать
  const imageUrl = images.length > 0 ? images[0] : defaultImage;

  return (
    <Card className="my-3 p-3 rounded product-card">
      <Link to={`/product/${product.med_id}`}>
        <Card.Img
          src={imageUrl}
          variant="top"
          className="product-img rounded"
        />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.med_id}`}>
          <Card.Title as="div" className="product-title">
            <strong>{product.med_name}</strong>
          </Card.Title>
        </Link>
        <Card.Text as="div" className="vendor-name mb-2">
          {product.vendor_name}
        </Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Text as="h4" className="product-price">
            {product.price} руб.
          </Card.Text>
          {product.qtty > 0 ? (
            <Badge bg="success">В наличии</Badge>
          ) : (
            <Badge bg="danger">Нет в наличии</Badge>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default Product;