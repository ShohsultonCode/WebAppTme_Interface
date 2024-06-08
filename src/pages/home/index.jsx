import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Index = () => {
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user_id');

        if (userId) {
            setUserId(userId);
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
        try {
            const response = await fetch('https://shohsulton.uz/webappbot/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    order_telegram_id: userId,
                    order_product_id: productId
                })
            });
            const data = await response.json();
            if (response.ok) {
                toast.success('Order placed successfully!');
            } else {
                toast.error(data.message || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order');
        }
    };

    return (
        <div className="container mt-5">
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
                                    <button className="btn btn-primary buttoncha" onClick={() => handleOrder(product._id)}>Order</button>
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
