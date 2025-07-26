import mongoose from "mongoose"

const driverSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    licenseNumber: {
      type: String,
      required: [true, "License number is required"],
      trim: true,
    },
    licenseExpiry: {
      type: Date,
      required: [true, "License expiry date is required"],
    },
    idCard: {
      type: String,
      required: [true, "ID card is required"],
    },
    vehicle: {
      type: {
        type: String,
        enum: ["standard", "comfort", "premium", "van"],
        required: [true, "Vehicle type is required"],
      },
      make: {
        type: String,
        required: [true, "Vehicle make is required"],
      },
      model: {
        type: String,
        required: [true, "Vehicle model is required"],
      },
      year: {
        type: Number,
        required: [true, "Vehicle year is required"],
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
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    services: {
      rides: {
        type: Boolean,
        default: true,
      },
      deliveries: {
        type: Boolean,
        default: true,
      },
    },
    balance: {
      type: Number,
      default: 0,
    },
    completedRides: {
      type: Number,
      default: 0,
    },
    completedDeliveries: {
      type: Number,
      default: 0,
    },
    bankInfo: {
      accountHolder: String,
      accountNumber: String,
      bankName: String,
      iban: String,
    },
    documents: [
      {
        type: {
          type: String,
          enum: ["license", "idCard", "insurance", "vehicleRegistration", "other"],
        },
        url: String,
        verified: {
          type: Boolean,
          default: false,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
    rejectionReason: String,
  },
  {
    timestamps: true,
  },
)


driverSchema.index({ currentLocation: "2dsphere" })

const Driver = mongoose.model("Driver", driverSchema)

export default Driver


// import mongoose from "mongoose"

// const driverSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     licenseNumber: {
//       type: String,
//       required: [true, "License number is required"],
//       trim: true,
//     },
//     licenseExpiry: {
//       type: Date,
//       required: [true, "License expiry date is required"],
//     },
//     idCard: {
//       type: String,
//       required: [true, "ID card is required"],
//     },
//     vehicle: {
//       type: {
//         type: String,
//         enum: ["standard", "comfort", "premium", "van"],
//         required: [true, "Vehicle type is required"],
//       },
//       make: {
//         type: String,
//         required: [true, "Vehicle make is required"],
//       },
//       model: {
//         type: String,
//         required: [true, "Vehicle model is required"],
//       },
//       year: {
//         type: Number,
//         required: [true, "Vehicle year is required"],
//       },
//       color: {
//         type: String,
//         required: [true, "Vehicle color is required"],
//       },
//       licensePlate: {
//         type: String,
//         required: [true, "License plate is required"],
//         trim: true,
//       },
//       insuranceNumber: {
//         type: String,
//         required: [true, "Insurance number is required"],
//       },
//       insuranceExpiry: {
//         type: Date,
//         required: [true, "Insurance expiry date is required"],
//       },
//     },
//     isVerified: {
//       type: Boolean,
//       default: false,
//     },
//     isAvailable: {
//       type: Boolean,
//       default: false,
//     },
//     currentLocation: {
//       type: {
//         type: String,
//         enum: ["Point"],
//         default: "Point",
//       },
//       coordinates: {
//         type: [Number],
        
//         validate: {
//           validator: function(coordinates) {
           
//             if (coordinates && coordinates.length === 2) {
//               return !(coordinates[0] === 0 && coordinates[1] === 0);
//             }
//             return true; 
//           },
//           message: 'Invalid location: [0,0] coordinates are not allowed'
//         }
//       },
//     },
//     services: {
//       rides: {
//         type: Boolean,
//         default: true,
//       },
//       deliveries: {
//         type: Boolean,
//         default: true,
//       },
//     },
//     balance: {
//       type: Number,
//       default: 0,
//     },
//     completedRides: {
//       type: Number,
//       default: 0,
//     },
//     completedDeliveries: {
//       type: Number,
//       default: 0,
//     },
//     bankInfo: {
//       accountHolder: String,
//       accountNumber: String,
//       bankName: String,
//       iban: String,
//     },
//     documents: [
//       {
//         type: {
//           type: String,
//           enum: ["license", "idCard", "insurance", "vehicleRegistration", "other"],
//         },
//         url: String,
//         verified: {
//           type: Boolean,
//           default: false,
//         },
//         uploadedAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     status: {
//       type: String,
//       enum: ["pending", "approved", "rejected", "suspended"],
//       default: "pending",
//     },
//     rejectionReason: String,
//   },
//   {
//     timestamps: true,
//   },
// )

// driverSchema.index({ currentLocation: "2dsphere" })

// driverSchema.methods.hasValidLocation = function() {
//   return this.currentLocation && 
//          this.currentLocation.coordinates && 
//          this.currentLocation.coordinates.length === 2 &&
//          !(this.currentLocation.coordinates[0] === 0 && this.currentLocation.coordinates[1] === 0);
// }

// driverSchema.methods.setLocation = function(longitude, latitude) {
//   if (longitude === 0 && latitude === 0) {
//     throw new Error('Invalid location: [0,0] coordinates are not allowed');
//   }
  
//   if (Math.abs(longitude) > 180 || Math.abs(latitude) > 90) {
//     throw new Error('Coordinates out of valid range');
//   }
  
//   this.currentLocation = {
//     type: "Point",
//     coordinates: [longitude, latitude]
//   };
// }


// driverSchema.pre('save', function(next) {
  
//   if (this.currentLocation && 
//       this.currentLocation.coordinates && 
//       this.currentLocation.coordinates[0] === 0 && 
//       this.currentLocation.coordinates[1] === 0) {
    
//     console.warn(`⚠️  Driver ${this._id}: Removing invalid [0,0] location`);
//     this.currentLocation = undefined;
//   }
//   next();
// });

// const Driver = mongoose.model("Driver", driverSchema)

// export default Driver