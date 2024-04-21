import express from "express";
import db from "../data/db.js";

const router = express.Router();

// Асинхронная функция для загрузки данных из базы данных
// Модифицированная функция для загрузки продуктов с поддержкой пагинации
async function loadProducts(page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return new Promise((resolve, reject) => {
        const query = `
            SELECT stock.med_id, stock.med_name, stock.vendor_name, stock.country_name, stock.price, stock.qtty, zelenka.images
            FROM stock
            LEFT JOIN zelenka ON zelenka.med_id = stock.med_id
            WHERE stock.pharma = 4
            LIMIT ? OFFSET ?;
        `;
        db.query(query, [limit, offset], (err, results) => {
            if (err) {
                console.error('Error fetching data from stock table:', err);
                reject(err);
            } else {
                resolve(results); // Прямое использование results для MySQL
            }
        });
    });
}
async function loadSuggestions(search) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT stock.med_id, stock.med_name, stock.vendor_name, stock.country_name, stock.price, stock.qtty, zelenka.images
        FROM stock
        LEFT JOIN zelenka ON zelenka.med_id = stock.med_id
        WHERE stock.pharma = 4 AND stock.med_name LIKE CONCAT('%', ?, '%')
        LIMIT 5;
      `;
      db.query(query, [search], (err, results) => {
        if (err) {
          console.error('Error fetching suggestions from stock table:', err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }
  
  // Маршрут для автокомплита по имени продукта
router.get('/autocomplete', async (req, res) => {
    const { search } = req.query;
    if (search.length < 3) {
      return res.status(400).json({ message: 'Поиск требует минимум 3 символов' });
    }
    try {
      const suggestions = await loadSuggestions(search);
      res.json(suggestions);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      res.status(500).send({ error: 'Database error' });
    }
  });
// Маршрут для получения всех продуктов с пагинацией
router.get('/', async (req, res) => {
    const { page, limit } = req.query;
    try {
        const products = await loadProducts(parseInt(page) || 1, parseInt(limit) || 10);
        console.log(products);
        res.send(products);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        res.status(500).send({ error: 'Database error' });
    }
});
const getProductByMedId = (medId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT
        stock.med_id,
        stock.med_name,
        stock.vendor_name,
        stock.country_name,
        stock.price,
        stock.qtty,
        zelenka.images
      FROM stock
      LEFT JOIN zelenka ON zelenka.med_id = stock.med_id
      WHERE stock.med_id = ?;
    `;

    db.query(query, [medId], (err, results) => {
      if (err) {
        return reject(new Error('Database error'));
      }

      resolve(results[0]); // Вернуть первый элемент, так как предполагается, что med_id уникален
    });
  });
};

router.get('/:medId', async (req, res) => {
  try {
    const product = await getProductByMedId(parseInt(req.params.medId));
    console.log(product, "HI");

    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  } catch (error) {
    if (error.message === 'Database error') {
      res.status(500).send({ error: error.message });
    } else {
      res.status(400).send({ error: 'Invalid product ID' });
    }
  }
});


export default router;
