const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema( {
    id: String,
    name: String,
    price: mongoose.Schema.Types.Decimal128,
});

mongoose.model('Product', ProductSchema);