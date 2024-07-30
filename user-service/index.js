const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3001;

// Load OpenAPI documentation
const swaggerDocument = yaml.load(fs.readFileSync('./api-docs.yml', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mock database
let users = {};

// Endpoints
app.post('/users', (req, res) => {
    const { id, name } = req.body;
    if (users[id]) {
        return res.status(400).json({ message: 'User already exists' });
    }
    users[id] = { id, name };
    res.status(201).json(users[id]);
});

app.get('/users/:id', (req, res) => {
    const user = users[req.params.id];
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
});

app.listen(port, () => {
    console.log(`User Service listening on port ${port}`);
});
