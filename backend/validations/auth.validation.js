import { z } from "zod"


export const registerSchema = z.object({
  body: z
    .object({
      firstName: z
        .string({
          required_error: "Le prénom est obligatoire",
        })
        .min(2, "Le prénom doit contenir au moins 2 caractères")
        .max(50, "Le prénom ne peut pas dépasser 50 caractères")
        .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes"),

      lastName: z
        .string({
          required_error: "Le nom est obligatoire",
        })
        .min(2, "Le nom doit contenir au moins 2 caractères")
        .max(50, "Le nom ne peut pas dépasser 50 caractères")
        .regex(/^[a-zA-ZÀ-ÿ\s-']+$/, "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes"),

      email: z
        .string({
          required_error: "L'email est obligatoire",
        })
        .email("Format d'email invalide")
        .toLowerCase()
        .max(255, "L'email ne peut pas dépasser 255 caractères"),

      password: z
        .string({
          required_error: "Le mot de passe est obligatoire",
        })
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .max(128, "Le mot de passe ne peut pas dépasser 128 caractères")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial",
        ),

      phone: z
        .string({
          required_error: "Le numéro de téléphone est obligatoire",
        })
        .regex(/^(?:\+33|0)[1-9](?:[0-9]{8})$/, "Format de numéro de téléphone français invalide"),

      role: z
        .enum(["passenger", "driver"], {
          required_error: "Le rôle est obligatoire",
          invalid_type_error: "Le rôle doit être 'passenger' ou 'driver'",
        })
        .default("passenger"),

   
      licenseNumber: z
        .string()
        .min(5, "Le numéro de permis doit contenir au moins 5 caractères")
        .max(20, "Le numéro de permis ne peut pas dépasser 20 caractères")
        .optional(),

      licenseExpiry: z
        .string()
        .datetime("Format de date invalide")
        .refine((date) => new Date(date) > new Date(), "La date d'expiration du permis doit être dans le futur")
        .optional(),

      idCard: z
        .string()
        .min(5, "Le numéro de carte d'identité doit contenir au moins 5 caractères")
        .max(20, "Le numéro de carte d'identité ne peut pas dépasser 20 caractères")
        .optional(),

      vehicleType: z
        .enum(["standard", "comfort", "premium", "van"], {
          invalid_type_error: "Type de véhicule invalide",
        })
        .optional(),

      vehicleMake: z
        .string()
        .min(2, "La marque du véhicule doit contenir au moins 2 caractères")
        .max(50, "La marque du véhicule ne peut pas dépasser 50 caractères")
        .optional(),

      vehicleModel: z
        .string()
        .min(2, "Le modèle du véhicule doit contenir au moins 2 caractères")
        .max(50, "Le modèle du véhicule ne peut pas dépasser 50 caractères")
        .optional(),

      vehicleYear: z
        .number()
        .int("L'année doit être un nombre entier")
        .min(2000, "L'année du véhicule doit être supérieure à 2000")
        .max(new Date().getFullYear() + 1, "L'année du véhicule ne peut pas être dans le futur")
        .optional(),

      vehicleColor: z
        .string()
        .min(3, "La couleur du véhicule doit contenir au moins 3 caractères")
        .max(30, "La couleur du véhicule ne peut pas dépasser 30 caractères")
        .optional(),

      vehicleLicensePlate: z
        .string()
        .regex(
          /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$|^[0-9]{1,4}\s?[A-Z]{1,3}\s?[0-9]{2}$/,
          "Format de plaque d'immatriculation invalide",
        )
        .optional(),

      vehicleInsuranceNumber: z
        .string()
        .min(5, "Le numéro d'assurance doit contenir au moins 5 caractères")
        .max(50, "Le numéro d'assurance ne peut pas dépasser 50 caractères")
        .optional(),

      vehicleInsuranceExpiry: z
        .string()
        .datetime("Format de date invalide")
        .refine((date) => new Date(date) > new Date(), "La date d'expiration de l'assurance doit être dans le futur")
        .optional(),

 
      termsAccepted: z
        .boolean({
          required_error: "Vous devez accepter les conditions d'utilisation",
        })
        .refine((val) => val === true, "Vous devez accepter les conditions d'utilisation"),

      privacyAccepted: z
        .boolean({
          required_error: "Vous devez accepter la politique de confidentialité",
        })
        .refine((val) => val === true, "Vous devez accepter la politique de confidentialité"),
    })
    .refine(
      (data) => {
        if (data.role === "driver") {
          return (
            data.licenseNumber &&
            data.licenseExpiry &&
            data.idCard &&
            data.vehicleType &&
            data.vehicleMake &&
            data.vehicleModel &&
            data.vehicleYear &&
            data.vehicleColor &&
            data.vehicleLicensePlate &&
            data.vehicleInsuranceNumber &&
            data.vehicleInsuranceExpiry
          )
        }
        return true
      },
      {
        message: "Tous les champs du chauffeur et du véhicule sont obligatoires pour les chauffeurs",
        path: ["role"],
      },
    ),
})

export const loginSchema = z.object({
    body: z.object({
      email: z
        .string({
          required_error: "L'email est obligatoire",
        })
        .email("Format d'email invalide")
        .toLowerCase(),
  
      password: z
        .string({
          required_error: "Le mot de passe est obligatoire",
        })
        .min(1, "Le mot de passe est obligatoire"),
  
      rememberMe: z.boolean().optional().default(false),
    }),
  })

  export const emailSchema = z.object({
    body: z.object({
      email: z
        .string({
          required_error: "L'email est obligatoire",
        })
        .email("Format d'email invalide")
        .toLowerCase(),
    }),
  })



  export const resetPasswordSchema = z.object({
    body: z
      .object({
        password: z
          .string({
            required_error: "Le mot de passe est obligatoire",
          })
          .min(8, "Le mot de passe doit contenir au moins 8 caractères")
          .max(128, "Le mot de passe ne peut pas dépasser 128 caractères")
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial",
          ),
  
        confirmPassword: z.string({
          required_error: "La confirmation du mot de passe est obligatoire",
        }),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: "Les mots de passe ne correspondent pas",
        path: ["confirmPassword"],
      }),
  
    params: z.object({
      token: z
        .string({
          required_error: "Le token est obligatoire",
        })
        .min(1, "Token invalide"),
    }),
  })

  export const changePasswordSchema = z.object({
    body: z
      .object({
        currentPassword: z
          .string({
            required_error: "Le mot de passe actuel est obligatoire",
          })
          .min(1, "Le mot de passe actuel est obligatoire"),
  
        newPassword: z
          .string({
            required_error: "Le nouveau mot de passe est obligatoire",
          })
          .min(8, "Le nouveau mot de passe doit contenir au moins 8 caractères")
          .max(128, "Le nouveau mot de passe ne peut pas dépasser 128 caractères")
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            "Le nouveau mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial",
          ),
  
        confirmNewPassword: z.string({
          required_error: "La confirmation du nouveau mot de passe est obligatoire",
        }),
      })
      .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: "Les nouveaux mots de passe ne correspondent pas",
        path: ["confirmNewPassword"],
      })
      .refine((data) => data.currentPassword !== data.newPassword, {
        message: "Le nouveau mot de passe doit être différent de l'ancien",
        path: ["newPassword"],
      }),
  })


  export const socialLoginSchema = z.object({
    body: z.object({
      provider: z.enum(["google", "facebook", "apple"], {
        required_error: "Le fournisseur est obligatoire",
        invalid_type_error: "Fournisseur non supporté",
      }),
  
      token: z
        .string({
          required_error: "Le token est obligatoire",
        })
        .min(1, "Token invalide"),
  
      deviceInfo: z
        .object({
          deviceId: z.string().optional(),
          platform: z.enum(["web", "ios", "android"]).optional(),
          version: z.string().optional(),
        })
        .optional(),
    }),
  })
