import User from "../models/user.model.js";
import Driver from "../models/driver.model.js";
import { createError } from "../utils/error.utils.js";
import crypto from "crypto";
import { sendVerificationEmail , sendPasswordResetEmail } from "../utils/email.utils.js";
import {OAuth2Client} from "google-auth-library" ;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 

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
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async(req , res , next)=>{
  try{
    const {email , password} = req.body;
    if(!email || !password){
      return next(createError(401, "toute le champ oblogatoire"))
    }

    const user = await User.findOne({email}).select("+password")
    if(!user){
      return next(createError(401 , "Invalid email or password"))
    }

    const isPasswordValide = await user.comparePassword(password)
    if(!isPasswordValide){

      return next(createError(401 , "Invalid email or password"))

    }

    user.lastLogin = Date.now();

    await user.save();

    const token = user.generateAuthToken();

    const userWithoutPassword = { ...user.toObject() }
    delete userWithoutPassword.password
    delete userWithoutPassword.verificationToken
    delete userWithoutPassword.verificationTokenExpires


    res.status(201).json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    })


  }catch(error){
  next(error)
  }
  
}


export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params

    
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: new Date()},
    })

    if (!user) {
      return next(createError(400, "Invalid or expired verification token"))
    }

    user.isVerified = true
    user.verificationToken = undefined
    user.verificationTokenExpires = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    })
  } catch (error) {
    next(error)
  }
}

export const resendVerificationEmail = async(req , res , next)=>{

  try {
    const {email} = req.body;

    if (!email) {
      return next(createError(400, "Email is required"))
    }
    const user = await User.findOne({email})
    if(!user){
      return next(createError(404 , "User not find"))
    }
    if(user.isVerified){
      return next(createError(404 , "User already verfied"))
    }


    const verificationToken = crypto.randomBytes(32).toString("hex")
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) 

    user.verificationToken = verificationToken
    user.verificationTokenExpires= verificationTokenExpires
    await user.save();

    await sendVerificationEmail(user.email , verificationToken)
    
    res.status(201).json({
      success: true,
      message: "Verification email sent successfully",
    })
  } catch (error) {
    next(error)
  }

}

export const forgotPassword = async(req , res , next)=>{
  try{
    const {email} = req.body;
    if(!email){
      return next(createError(400 , "Email is required "))

    }

    const user = await User.findOne({email})
    if(!user){
      return next(createError(404 , "User not fond"))

    }

    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000)


    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = resetTokenExpires
    await user.save();


    await sendPasswordResetEmail(user.email , resetToken);


    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    })
  }catch(error){
    next(error)

  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params
    const { password } = req.body

    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })

    if (!user) {
      return next(createError(400, "Invalid or expired reset token"))
    }

 
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    })
  } catch (error) {
    next(error)
  }
}


export const socialLogin = async(req , res , next)=>{
  try{
    const {provider , token} = req.body;

    let verifiedData ;
    if( provider === "google"){
      const ticket = await client.verifyIdToken({
        idToken:token,
        audience: process.env.GOOGLE_CLIENT_ID
      })
      const payload = ticket.getPayload();

      verifiedData= {
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        picture: payload.picture,
      }

    }else{
      return next(createError(400, "Provider not supported yet"));
    }

    let user = await User.findOne({ email: verifiedData.email });

    if(!user){
      user = new User({
        firstName: verifiedData.firstName,
        lastName: verifiedData.lastName,
        email: verifiedData.email,
        password: crypto.randomBytes(16).toString("hex"), 
        profilePicture: verifiedData.picture,
        isVerified: true,
      })
      await user.save(); 

    }

    const jwtToken  = user.generateAuthToken();
    

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: jwtToken,
      user,
    });


  }catch(error){
    next(error);
  }

}

