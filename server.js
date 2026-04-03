require('dotenv').config();
const express = require('express');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ============================================
// STRIPE CHECKOUT SESSION
// ============================================

app.post('/create-checkout-session', async (req, res) => {
    try {
        const { product, price } = req.body;

        if (!product || !price || typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: 'Invalid product or price' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: product,
                    },
                    unit_amount: Math.round(price * 100),
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.protocol}://${req.get('host')}/index.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.protocol}://${req.get('host')}/index.html`,
        });

        res.json({ id: session.id });
    } catch (err) {
        console.error('Stripe error:', err.message);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

// ============================================
// COINBASE COMMERCE CRYPTO CHARGE
// ============================================

app.post('/create-crypto-charge', async (req, res) => {
    try {
        const { product, price } = req.body;

        if (!product || !price || typeof price !== 'number' || price <= 0) {
            return res.status(400).json({ error: 'Invalid product or price' });
        }

        const response = await fetch('https://api.commerce.coinbase.com/charges', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CC-Api-Key': process.env.COINBASE_API_KEY,
                'X-CC-Version': '2018-03-22',
            },
            body: JSON.stringify({
                name: product,
                description: `Purchase: ${product}`,
                pricing_type: 'fixed_price',
                local_price: {
                    amount: price.toFixed(2),
                    currency: 'EUR',
                },
                redirect_url: `${req.protocol}://${req.get('host')}/index.html`,
                cancel_url: `${req.protocol}://${req.get('host')}/index.html`,
            }),
        });

        const data = await response.json();

        if (data.data && data.data.hosted_url) {
            res.json({ url: data.data.hosted_url });
        } else {
            console.error('Coinbase error:', data);
            res.status(500).json({ error: 'Failed to create crypto charge' });
        }
    } catch (err) {
        console.error('Coinbase error:', err.message);
        res.status(500).json({ error: 'Failed to create crypto charge' });
    }
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log(`Vandal Store server running on http://localhost:${PORT}`);
});
