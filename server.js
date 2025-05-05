const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const PRODUCTS_FILE = path.join(__dirname, 'src/data/products.json');

// Read products from JSON file
const readProducts = async () => {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading products:', error);
    return [];
  }
};

// Write products to JSON file
const writeProducts = async (products) => {
  try {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing products:', error);
    throw error;
  }
};

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add a new product
app.post('/api/products', async (req, res) => {
  try {
    const products = await readProducts();
    const newProduct = {
      ...req.body,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    
    products.push(newProduct);
    await writeProducts(products);
    
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update a product
app.put('/api/products/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    products[index] = { ...products[index], ...req.body };
    await writeProducts(products);
    
    res.json(products[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const products = await readProducts();
    const id = parseInt(req.params.id);
    const filteredProducts = products.filter(p => p.id !== id);
    
    if (filteredProducts.length === products.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    await writeProducts(filteredProducts);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
