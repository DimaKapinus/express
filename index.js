const express = require('express');
const moment = require('moment');

const app = express();
const PORT = 3000;

app.use(express.json());

const products = [
    {
        id: 1,
        name: 'Laptop',
        price: 2000,
        category: 'electronics'
    },
    {
        id: 2,
        name: 'Smartphone',
        price: 12300,
        category: 'electronics'
    },
    {
        id: 3,
        name: 'Mouse',
        price: 1200,
        category: 'electronics'
    },
    {
        id: 4,
        name: 'Rug',
        price: 800,
        category: 'furniture'
    },
    {
        id: 5,
        name: 'Headphones',
        price: 3400,
        category: 'electronics'
    }
];

function addProduct(newProduct, shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error('Failed to save product'));
                return;
            }

            products.push(newProduct);
            resolve(newProduct);
        }, 100);
    });
}

app.get('/timestamp', (req, res) => {
    res.json({
        timestamp: moment().format()
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'ok'
    });
});

app.get('/stats', (req, res) => {
    res.json({
        uptime: process.uptime(),
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
    });
});

app.get('/products', (req, res) => {
    let result = [...products];

    if (req.query.category) {
        result = result.filter(
            product => product.category === req.query.category
        );
    }

    if (req.query.take !== undefined) {
        const take = Number(req.query.take);

        if (!Number.isInteger(take) || take < 0) {
            return res.status(400).json({
                error: 'take must be a non-negative integer'
            });
        }

        result = result.slice(0, take);
    }

    res.json(result);
});

app.get('/products/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            error: 'id must be a number'
        });
    }

    const product = products.find(product => product.id === id);

    if (!product) {
        return res.status(404).json({
            error: 'Product not found'
        });
    }

    res.json(product);
});

app.post('/products', async (req, res) => {
    const { name, price, category, image = '' } = req.body;

    if (
        typeof name !== 'string' ||
        name.trim() === '' ||
        typeof price !== 'number' ||
        price <= 0 ||
        typeof category !== 'string' ||
        category.trim() === ''
    ) {
        return res.status(422).json({
            error: 'Invalid product data'
        });
    }

    const productExists = products.some(
        product => product.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (productExists) {
        return res.status(409).json({
            error: 'Product with this name already exists'
        });
    }

    const newProduct = {
        id: products.length > 0
            ? Math.max(...products.map(product => product.id)) + 1
            : 1,
        name: name.trim(),
        price,
        category: category.trim(),
        image: typeof image === 'string' ? image : ''
    };

    try {
        const shouldFail = req.query.fail === 'true';

        const product = await addProduct(newProduct, shouldFail);

        return res.status(201).json(product);
    } catch (error) {
        return res.status(500).json({
            error: 'Failed to save product'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
