const mongoose = require('mongoose');
const cartScema=mongoose.Schema({
    userId:{
      type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    items:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product',
                required:true
            },
            quantity:{type:Number,required:true}
        },

    ]
    
},
{
    timestamps:true
}

)
const Cart = mongoose.model('cartScema', cartScema);
module.exports = Cart;
