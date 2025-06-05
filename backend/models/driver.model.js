import mongoose from "mongoose";



const driverSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },

    licenseNumber : {
        type :String ,
        required : [true , "License number is required"],
        trim : true,
    },
    licenseExpiry :{
        type : Date ,
        required : [true , "License expiry date is required"],

    },

    idCard :{
        type : String ,
         required : [true , "ID card is required "],

    },

    vehicle :{
        type :{
            type : String,
            enum : ["standard" , "comfort" , "premium" , "van"],
            required : [true , "Vehicle type is required"],

        },
        make : {
            type : String ,
             required: [true , "Vehicle make is required "]
        },
        model : {
            type : String ,
            required : [true , "Vehicle model is required"]
        },
        year : {
            type : Number,
            required : [true , "Vehicle year is required"]

        },
        color: {
            type: String,
            required: [true, "Vehicle color is required"],
          },
          licensePlate: {
            type: String,
            required: [true, "License plate is required"],
            trim: true,
          },

          insuranceNumber: {
            type: String,
            required: [true, "Insurance number is required"],
          },

          insuranceExpiry: {
            type: Date,
            required: [true, "Insurance expiry date is required"],
          },
    },

    isVerified: {
        type: Boolean,
        default: false,
      },

      isAvailable: {
        type: Boolean,
        default: false,
      },







});

const Driver = mongoose.model("Driver", driverSchema)

export default Driver