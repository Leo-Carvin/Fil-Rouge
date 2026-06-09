const productModel = require('../models/productModel')

exports.getProducts = async (req, res) => {
  try {
    const products = await productModel.findAll(req.query)
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.updateProduct = async (req, res) => {
  try {
    await productModel.updateById(req.params.id, req.body)
    res.json({ message: 'Produit mis a jour' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
