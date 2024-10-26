const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

const stripe = require("stripe")(
  "sk_test_51PlQyT07SwF5vSQMs70aoQNUMiMklX46UhHsbZI9Npqt4GXkpVQyJ2I5ZctLG2REFd9yQ2STZkFnDbK0YYurIyOR00QecqFmKj"
);

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { cartItems } = req.body;
    const params = {
      mode: "payment",
      submit_type: "pay",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      shipping_options: [
        {
          shipping_rate: "shr_1PlTa107SwF5vSQM4IXAeO3D",
        },
      ],
      customer_email: "sai@gmail.com",
      line_items: cartItems.map((item) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.title,
              images: [item.image],
              metadata: {
                productId: item.title,
              },
            },
            unit_amount: item.price * 100,
          },
          adjustable_quantity: {
            enabled: true,
            minimum: 1,
          },
          quantity: item.quantity,
        };
      }),
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    };

    const session = await stripe.checkout.sessions.create(params);
    res.status(303).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
