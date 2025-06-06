import User from "../models/user.model.js";
import Driver from "../models/driver.model.js";
import { createError } from "../utils/error.utils.js";

export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;

   
    if (!firstName || !lastName || !email || !password || !phone || !role) {
      return next(createError(400, "Tous les champs sont obligatoires"));
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createError(400, "Un utilisateur avec cet email existe déjà"));
    }

   
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || "passenger",
    });

    await user.save();

  
    if (user.role === "driver") {
      const driver = new Driver({
        user: user._id,
      });
      await driver.save();
    }

    res.status(201).json({
      success: true,
      message: "Utilisateur enregistré avec succès. Veuillez vérifier votre email.",
    });
  } catch (error) {
    next(error);
  }
};
