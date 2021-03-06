const express = require('express');
const multer = require('multer');
const { Product } = require('../models/Product');
const router = express.Router();

//=================================
//             Product
//=================================

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})
  
const upload = multer({ storage: storage }).single("file")

router.post('/products', (req, res) => {

    // products collection 에 들어 있는 모든 상품 정보 가져오기

    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let term = req.body.searchTerm

    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {

            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0], // greater than equal
                    $lte: req.body.filters[key][1] // less than equal 
                }
            } else {
                findArgs[key] = req.body.filters[key]
            }
            
        }
    }

    if (term) {
  
        Product
        .find(findArgs)
        .find({ $text: { $search: term } })
        .populate("writer") // writer 에 대한 모든 정보 가져오기
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({ 
                success: true, 
                productInfo,
                postSize: productInfo.length
            })
        })

    } else {
         
        Product
        .find(findArgs)
        .populate("writer") // writer 에 대한 모든 정보 가져오기
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
            if (err) return res.status(400).json({ success: false, err })
            return res.status(200).json({ 
                success: true, 
                productInfo,
                postSize: productInfo.length
            })
        })

    }

    

})

router.post('/image', (req, res) => {

    // 가져온 이미지 저장
    upload(req, res, err => {
        if (err) {
            return req.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })

})

router.post('/', (req, res) => {

    // 받아온 정보들을 DB에 넣어준다 
    const product = new Product(req.body)

    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json( { success: true })
    })

})

router.get('/products_by_id', (req, res) => {

    let type = req.query.type
    let productIds = req.query.id

    if (type === "array") {
        // id=123123,333333,666777 를
        // productIds= [ '123123', '333333', '666777' ] 이런 형태로 바꿔주기 
        let ids = req.query.id.split(',')
        productIds = ids.map(item => {
            return item
        })
    }

    // productId 를 이용해서 DB 에서 productId 와 같은 상품의 정보를 가져온다.
    Product.find({ _id: { $in: productIds } })
        .populate("writer")
        .exec((err, product) => {
            if (err) return res.status(400).send(err)
            // return res.status(200).json({ success: true, product })
            return res.status(200).send(product)
        })
    
})

module.exports = router;
