const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3002;

// Load OpenAPI documentation
const swaggerDocument = yaml.load(fs.readFileSync('./api-docs.yml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mock database
let products = {};

// Endpoints
app.post('/products', (req, res) => {
    const { id, name, userId } = req.body;
    if (products[id]) {
        return res.status(400).json({ message: 'Product already exists' });
    }
    products[id] = { id, name, userId };
    res.status(201).json(products[id]);
});

app.get('/products/:id', (req, res) => {
    const product = products[req.params.id];
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
});

app.get('/products/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    // Fetch user details from User Service
    try {
        const userResponse = await axios.get(`http://localhost:3001/users/${userId}`);
        if (userResponse.status !== 200) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userResponse.data;
        const userProducts = Object.values(products).filter(product => product.userId === userId);
        res.status(200).json(userProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

app.listen(port, () => {
    console.log(`Product Service listening on port ${port}`);
});
