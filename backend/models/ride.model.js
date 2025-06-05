import mongoose from "mongoose";
import { type } from "os";


const rideSchema = new mongoose.Schema({
    passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
      },
      pickup: {
        address: {
          type: String,
          required: [true, "Pickup address is required"],
        },
        location: {
          type: {
            type: String,
            enum: ["Point"],
            default: "Point",
          },
          coordinates: {
            type: [Number],
            required: [true, "Pickup coordinates are required"],
          },
        },
      },
      destination: {
        address: {
          type: String,
          required: [true, "Destination address is required"],
        },
        location: {
          type: {
            type: String,
            enum: ["Point"],
            default: "Point",
          },
          coordinates: {
            type: [Number],
            required: [true, "Destination coordinates are required"],
          },
        },
      },


      
})