import Axios from 'axios'
import React, { useState ,useEffect } from 'react'
import { Button, Icon, Col, Card, Row }  from 'antd'
import Meta from 'antd/lib/card/Meta'

function LandingPage() {

    const [Products, setProducts] = useState([])

    useEffect(() => {
    
        Axios.post('/api/product/products')
            .then(response => {
                if (response.data.success) {
                    setProducts(response.data.productInfo)
                } else {
                    alert('상품들을 가져오는데 실패했습니다');
                }
            })

    }, [])

    const renderCards = Products.map((product, index) => {
        console.log('product', product)
        console.log(product.images)
        return <Card
            cover={<img src={`http://localhost:5000/${product.images[0]}`} />}
            >
            <Meta
                title={product.title} 
                description={`${product.price}`}
            />
        </Card>
    })

    return (
        <div style={{ width:'75%', margin:'3rem auto' }}>
            
            <div style={{ textAlign:'center' }}>
                <h2>Let's Travel Anywhere</h2>
            </div>

            {/* Filter */}

            {/* Search */}

            { renderCards }

            <div style={{ justifyContent:'center' }}>
                <Button>더보기</Button>      
            </div>

        </div>
    )
}

export default LandingPage
