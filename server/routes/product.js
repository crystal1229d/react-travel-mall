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
 console.log(req.body)
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

module.exports = router;
