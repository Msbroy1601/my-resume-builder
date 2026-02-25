export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  try {
    const keyId = process.env.VITE_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET

    if (!keyId || !keySecret) {
      return res.status(500).json({ error: 'Missing Razorpay credentials' })
    }

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
    
    if (!response.ok) {
      return res.status(500).json({ error: 'Razorpay API error', details: order })
    }
    
    return res.status(200).json(order)
    
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
```

**Step 3: Save the file**

**Step 4: In your terminal, run:**
```
cd /Users/baishaliroy/my-resume-builder
git add .
git commit -m "fix: better error handling in razorpay checkout"
git push