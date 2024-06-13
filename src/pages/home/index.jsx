import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../../components/Loader';
import './Index.css';  // Import the new CSS file

const Index = () => {
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState(localStorage.getItem('telegramUserId'));
    const [loading, setLoading] = useState(true);
    const [productCounts, setProductCounts] = useState({});
    const [selectedProducts, setSelectedProducts] = useState([]);
    const navigate = useNavigate();
    const tele = window.Telegram.WebApp;

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('user_id');
        if (userId) {
            setUserId(userId);
            localStorage.setItem('telegramUserId', userId);
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

    const handleOrder = (productId) => {
        const updatedCounts = { ...productCounts, [productId]: 1 };
        setProductCounts(updatedCounts);
        setSelectedProducts([...selectedProducts, { productId, count: 1 }]);
    };

    const handleIncrement = (productId) => {
        const updatedCounts = { ...productCounts, [productId]: (productCounts[productId] || 0) + 1 };
        setProductCounts(updatedCounts);
        if (!selectedProducts.some((item) => item.productId === productId)) {
            setSelectedProducts([...selectedProducts, { productId, count: updatedCounts[productId] }]);
        } else {
            setSelectedProducts(selectedProducts.map(item =>
                item.productId === productId ? { ...item, count: updatedCounts[productId] } : item
            ));
        }
    };

    const handleDecrement = (productId) => {
        const newCount = (productCounts[productId] || 0) - 1;
        if (newCount <= 0) {
            const { [productId]: _, ...restCounts } = productCounts;
            setProductCounts(restCounts);
            const updatedSelectedProducts = selectedProducts.filter((item) => item.productId !== productId);
            setSelectedProducts(updatedSelectedProducts);
        } else {
            const updatedCounts = { ...productCounts, [productId]: newCount };
            setProductCounts(updatedCounts);
            setSelectedProducts(selectedProducts.map(item =>
                item.productId === productId ? { ...item, count: updatedCounts[productId] } : item
            ));
        }
    };

    const showCheckoutButton = selectedProducts.some(item => item.count > 0);
    tele.MainButton.show();
    tele.MainButton.text = "Checkout";

    const handleCheckoutClick = () => {
        if (showCheckoutButton) {
            localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
            tele.MainButton.hide();
            navigate('/products');
        } else {
            toast.error('Please select at least one product to order.');
        }
    };

    tele.MainButton.onClick(handleCheckoutClick);
    showCheckoutButton ? tele.MainButton.show() : tele.MainButton.hide();

    return (
        <div className="container mt-5">
            {userId && <p>User ID: {userId}</p>}
            {loading ? (
                <Loader />
            ) : (
                <div className="row row-cols-2">
                    {products.map((product, index) => (
                        <div className="col-6 mb-4 rounded" key={index}>
                            <div className="card h-100 product-card">
                                {product.product_image && (
                                    <img src={`https://shohsulton.uz/webappbot/api/images/${product.product_image}`} className="card-img-top img-fluid product-image" alt={product.product_name} />
                                )}
                                <div className="card-body">
                                    <h5 className="card-title">{product.product_name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">Type: {product.product_category.category_name}</h6>
                                    <p className="card-text">Price: ${product.product_price.toFixed(2)}</p>
                                    {productCounts[product._id] ? (
                                        <div>
                                            <button className="btn btn-danger me-2" onClick={() => handleDecrement(product._id)}>-</button>
                                            <span className='m-2'>{productCounts[product._id]}</span>
                                            <button className="btn btn-success ms-2" onClick={() => handleIncrement(product._id)}>+</button>
                                        </div>
                                    ) : (
                                        <button className="btn btn-primary buttoncha" onClick={() => handleOrder(product._id)}>Order</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ToastContainer />
        </div>
    );
}

export default Index;
