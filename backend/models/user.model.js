import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["passenger", "driver", "admin"],
      default: "passenger",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    rating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    favoriteAddresses: [
      {
        name: String,
        address: String,
        lat: Number,
        lng: Number,
      },
    ],
    paymentMethods: [
      {
        type: {
          type: String,
          enum: ["card", "paypal"],
        },
        details: {
          cardNumber: String,
          cardHolder: String,
          expiryDate: String,
          paypalEmail: String,
        },
        isDefault: Boolean,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  },
)

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})


userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}


userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}


userSchema.methods.getFullName = function () {
  return `${this.firstName} ${this.lastName}`
}

const User = mongoose.model("User", userSchema)

export default User
