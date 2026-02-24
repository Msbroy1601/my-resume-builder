module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const keyId = process.env.VITE_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    const credentials = Buffer.from(`${keyId}:${keySecret}`).toString('base64')

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 9900,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      }),
    })

    const order = await response.json()
    return res.status(200).json(order)

  } catch (error) {
    console.error('Razorpay order error:', error)
    return res.status(500).json({ error: 'Failed to create order' })
  }
}