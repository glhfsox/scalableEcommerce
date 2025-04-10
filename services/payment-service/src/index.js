const express = require('express');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');

const app = express();

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => logger.info('Connected to MongoDB'))
.catch(err => logger.error('MongoDB connection error:', err));

// Payment Schema
const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'usd' },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: { type: String, required: true },
  stripePaymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

// Validation middleware
const validatePayment = [
  body('orderId').isMongoId(),
  body('userId').isMongoId(),
  body('amount').isFloat({ min: 0 }),
  body('paymentMethod').notEmpty()
];

// Routes
app.post('/payments/create-payment-intent', validatePayment, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, currency, paymentMethod } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: [paymentMethod],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    logger.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/payments/confirm', async (req, res) => {
  try {
    const { paymentIntentId, orderId, userId, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const payment = new Payment({
        orderId,
        userId,
        amount,
        status: 'completed',
        paymentMethod: paymentIntent.payment_method_types[0],
        stripePaymentId: paymentIntent.id
      });

      await payment.save();
      logger.info(`Payment completed: ${payment._id}`);

      // Here you would typically emit an event to notify other services
      // about the successful payment

      res.json({ status: 'success', payment });
    } else {
      res.status(400).json({ status: 'failed', message: 'Payment failed' });
    }
  } catch (error) {
    logger.error('Confirm payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/payments/refund', async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Only completed payments can be refunded' });
    }

    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentId
    });

    if (refund.status === 'succeeded') {
      payment.status = 'refunded';
      payment.updatedAt = Date.now();
      await payment.save();

      logger.info(`Payment refunded: ${payment._id}`);
      res.json({ status: 'success', payment });
    } else {
      res.status(400).json({ status: 'failed', message: 'Refund failed' });
    }
  } catch (error) {
    logger.error('Refund payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/payments/:paymentId', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.json(payment);
  } catch (error) {
    logger.error('Get payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/payments/user/:userId', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    logger.error('Get user payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  logger.info(`Payment Service running on port ${PORT}`);
}); 