import appConfig from "../index.js";

const {stripe, clientUrl} = appConfig;

export const createCheckoutSession = async(req, res)=>{
    const { checkoutItems }= req.body;
    const session = await stripe.checkout.sessions.create({
        billing_address_collection: "required",
        shipping_address_collection: {
            allowed_countries: ["IN"]
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 0,
                        currency: 'usd',
                    },
                    display_name: 'Free shipping',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 2,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 3,
                        },
                    },
                },
            },
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 1500,
                        currency: 'usd',
                    },
                    display_name: 'Next day air',
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: 1,
                        },
                        maximum: {
                            unit: 'business_day',
                            value: 1,
                        },
                    },
                },
            },
        ],
        phone_number_collection: {
            enabled: true
        },
        line_items: checkoutItems,
        mode: 'payment',
        success_url: `${clientUrl}/checkout/success`,
        cancel_url: `${clientUrl}/cart`,
    });

    res.status(200).json({
        url: session.url
    });
}