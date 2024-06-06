import React, { useState, useEffect } from 'react';

const Index = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://shohsulton.uz/webappbot/api/products');
                const data = await response.json();
                setProducts(data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Products:</h1>
            <div className="row">
                {products.map((product, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card h-100">
                            {product.product_image && (
                                <img src={`https://shohsulton.uz/webappbot/api/images/${product.product_image}`} className="card-img-top img-fluid" alt={product.product_name} />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{product.product_name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">Type: {product.product_category.category_name}</h6>
                                <p className="card-text">{product.product_description}</p>
                                <p className="card-text">Price: ${product.product_price.toFixed(2)}</p>
                                <button className="btn btn-primary">Order</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Index;
