import Axios from 'axios'
import React, { useState ,useEffect } from 'react'
import { Button, Icon, Col, Card, Row, Carousel }  from 'antd'
import Meta from 'antd/lib/card/Meta'
import ImageSlider from '../../utils/ImageSlider'
import Checkbox from './Sections/CheckBox'
import { continents } from './Sections/Datas'

function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })

    useEffect(() => {

        let body = {
            skip: Skip,
            limit: Limit
        }
    
        getProducts(body)

    }, [])

    const getProducts = (body) => {
    Axios.post('/api/product/products', body)
        .then(response => {
            if (response.data.success) {
                if (body.loadMore) {
                    setProducts([...Products, ...response.data.productInfo])
                } else {
                    setProducts(response.data.productInfo)
                }
                setPostSize(response.data.postSize)
            } else {
                alert('상품들을 가져오는데 실패했습니다');
            }
        })
    }

    const loadMoreHandler = () => {

        let skip = Skip + Limit

        let body = {
            skip: skip,
            limit: Limit,
            loadMore: true
        }

        getProducts(body)
        setSkip(skip)
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

    const showFilteredResults = (filters) => {
        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }

        getProducts(body)
        setSkip(0)
    }

    const handleFilters = (filters, category) => {
        const newFilters = { ...Filters }

        newFilters[category] = filters

        showFilteredResults(newFilters)
    }

    return (
        <div style={{ width:'75%', margin:'3rem auto' }}>
            
            <div style={{ textAlign:'center' }}>
                <h2>Let's Travel Anywhere</h2>
            </div>

            {/* Filter */}

            {/* CheckBox */}
            <Checkbox list={continents} handleFilters={filter => handleFilters(filter, "continents")} />

            {/* RadioBox */}

            {/* Search */}

            {/* Cards */}
            <Row gutter={[16, 16]}>
                { renderCards }
            </Row>

            {
                PostSize >= Limit &&
                <div style={{ justifyContent:'center' }}>
                    <Button onClick={loadMoreHandler}>더보기</Button>      
                </div>
            }

        </div>
    )
}

export default LandingPage
