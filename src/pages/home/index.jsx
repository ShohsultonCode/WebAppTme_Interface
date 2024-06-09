import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Index = () => {
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantities, setQuantities] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize the Telegram Web Apps SDK
        const tg = window.Telegram.WebApp;

        // Set the user ID from Telegram Web Apps initialization data
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            setUserId(tg.initDataUnsafe.user.id);
        }

        const fetchProducts = async () => {
            try {
                const response = await fetch('https://shohsulton.uz/webappbot/api/products');
                const data = await response.json();
                setProducts(data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleOrder = async (productId) => {
        const quantity = quantities[productId] || 1;
        try {
            const response = await fetch('https://shohsulton.uz/webappbot/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_telegram_id: userId,
                    order_product_id: productId,
                    order_quantity: quantity
                })
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Order placed successfully!');
                // Optionally, send data back to Telegram
                const tg = window.Telegram.WebApp;
                tg.sendData('Order placed successfully!');
            } else {
                toast.error(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order');
        }
    };

    const incrementQuantity = (productId) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: (prevQuantities[productId] || 1) + 1
        }));
    };

    const decrementQuantity = (productId) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: Math.max((prevQuantities[productId] || 1) - 1, 1)
        }));
    };


    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="titlecha">Products: </h3>
                <button onClick={() => navigate("/orders")} className='btn btn-outline-success'>Orders</button>
            </div>
            {userId && <p>User ID: {userId}</p>}
            {loading ? (
                <Loader />
            ) : (
                <div className="row row-cols-2">
                    {products.map((product, index) => (
                        <div className="col-6 mb-4 rounded" key={index}>
                            <div className="card h-100">
                                {product.product_image && (
                                    <img src={`https://shohsulton.uz/webappbot/api/images/${product.product_image}`} className="card-img-top img-fluid product-image" alt={product.product_name} />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{product.product_name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Type: {product.product_category.category_name}</h6>
                                    <p className="card-text">Price: ${product.product_price.toFixed(2)}</p>
                                    <div className="d-flex align-items-center">
                                        <button className="btn btn-secondary me-2" onClick={() => decrementQuantity(product._id)}>-</button>
                                        <span>{quantities[product._id] || 1}</span>
                                        <button className="btn btn-secondary ms-2" onClick={() => incrementQuantity(product._id)}>+</button>
                                    </div>
                                    <button className="btn btn-primary buttoncha mt-3" onClick={() => handleOrder(product._id)}>Order</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default Index;
