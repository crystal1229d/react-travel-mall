import Axios from 'axios'
import React, { useState ,useEffect } from 'react'
import { Button, Icon, Col, Card, Row, Carousel }  from 'antd'
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSlider'

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)

    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit
        }
    
        Axios.post('/api/product/products', body)
            .then(response => {
                if (response.data.success) {
                    setProducts(response.data.productInfo)
                } else {
                    alert('상품들을 가져오는데 실패했습니다');
                }
            })

    }, [])

    const loadMoreHandler = () => {
        
    }

    const renderCards = Products.map((product, index) => {
        return <Col key={index} lg={6} md={8} xs={24}>
            <Card
                cover={<ImageSlider images={product.images} />}>
            <Meta
                title={product.title} 
                description={`${product.price}`}
            />
        </Card>
        </Col> 
    })

    return (
        <div style={{ width:'75%', margin:'3rem auto' }}>
            
            <div style={{ textAlign:'center' }}>
                <h2>Let's Travel Anywhere</h2>
            </div>

            {/* Filter */}

            {/* Search */}
            <Row gutter={[16, 16]}>
                { renderCards }
            </Row>

            <div style={{ justifyContent:'center' }}>
                <Button oncllick={loadMoreHandler}>더보기</Button>      
            </div>

        </div>
    )
}

export default LandingPage
