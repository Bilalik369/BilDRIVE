import User from "../models/user.model.js";
import Driver from "../models/driver.model.js";
import { createError } from "../utils/error.utils.js";
import crypto from "crypto";
import { sendVerificationEmail } from "../utils/email.utils.js";
export const register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      licenseNumber,
      licenseExpiry,
      idCard,
      vehicleType,
      vehicleMake,
      vehicleModel,
      vehicleYear,
      vehicleColor,
      vehicleLicensePlate,
      vehicleInsuranceNumber,
      vehicleInsuranceExpiry,
    } = req.body;

    
    if (!firstName || !lastName || !email || !password || !phone || !role) {
      return next(createError(400, "Tous les champs sont obligatoires"));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, "Un utilisateur avec cet email existe déjà"));
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); 

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || "passenger",
      verificationToken,
      verificationTokenExpires,
    });

    await user.save();

    
    if (user.role === "driver") {
      if (
        !licenseNumber ||
        !licenseExpiry ||
        !idCard ||
        !vehicleType ||
        !vehicleMake ||
        !vehicleModel ||
        !vehicleYear ||
        !vehicleColor ||
        !vehicleLicensePlate ||
        !vehicleInsuranceNumber ||
        !vehicleInsuranceExpiry
      ) {
        return next(
          createError(400, "Tous les champs du conducteur sont obligatoires")
        );
      }

      const driver = new Driver({
        user: user._id,
        licenseNumber,
        licenseExpiry,
        idCard,
        vehicle: {
          type: vehicleType,
          make: vehicleMake,
          model: vehicleModel,
          year: vehicleYear,
          color: vehicleColor,
          licensePlate: vehicleLicensePlate,
          insuranceNumber: vehicleInsuranceNumber,
          insuranceExpiry: vehicleInsuranceExpiry,
        },
      });

      await driver.save();
    }

    await sendVerificationEmail(user.email , verificationToken)

    const token = user.generateAuthToken();
    
    const userWithoutPassword = { ...user.toObject() }
    delete userWithoutPassword.password
    delete userWithoutPassword.verificationToken
    delete userWithoutPassword.verificationTokenExpires


    res.status(201).json({
      success: true,
      message: "Utilisateur enregistré avec succès. Veuillez vérifier votre email.",
      token, 
      userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};
