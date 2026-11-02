const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({

    title:{

        type:String,

        required:true,

        trim:true

    },

    amount:{

        type:Number,

        required:true,

        min:0

    },

    type: {
        type: String,
        required: true,
        enum: ["Income", "Expense"]
    },


    category:{

        type:String,

        required:true,

        enum:[
            "Food",
            "Travel",
            "Shopping",
            "Bills",
            "Entertainment",
            "Education",
            "Health",
            "Salary",
            "Other"
        ]

    },

    description:{ type:String, default:"", maxlength:2000 },
    notes:{ type:String, default:"", maxlength:2000 },

    receiptUrl: { type: String, default: "" },
    location: {
        latitude: { type: Number, min: -90, max: 90 },
        longitude: { type: Number, min: -180, max: 180 },
        label: { type: String, maxlength: 300, default: "" }
    },

    date:{

        type:Date,

        default:Date.now

    },

    user:{

        type:mongoose.Schema.Types.ObjectId,

        ref:"User",

        required:true

    }

},
{
    timestamps:true
});


const Expense = mongoose.model("Expense",expenseSchema);

module.exports = Expense;