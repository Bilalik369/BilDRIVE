import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { Mail, ArrowLeft, Send } from "lucide-react"
import { toast } from "react-hot-toast"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Card from "../ui/Card"
import { authApi } from "../../redux/api/authApi"

const ForgotPasswordForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await authApi.forgotPassword(data.email)
      setIsSubmitted(true)
      toast.success("Instructions de réinitialisation envoyées à votre email !")
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec de l'envoi des instructions de réinitialisation")
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    const email = getValues("email")
    if (!email) return

    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      toast.success("Email envoyé à nouveau !")
    } catch (error) {
      toast.error("Échec de la réexpédition de l'email")
    } finally {
      setLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-text-dark">Vérifiez votre email</h2>
            <p className="mt-2 text-text-secondary">Nous avons envoyé les instructions de réinitialisation à votre adresse email.</p>
          </div>

          <Card className="p-8">
            <div className="text-center space-y-4">
              <p className="text-text-secondary">
                Vous n'avez pas reçu l'email ? Vérifiez votre dossier spam ou cliquez ci-dessous pour renvoyer.
              </p>

              <Button onClick={handleResendEmail} loading={loading} variant="outline" className="w-full bg-transparent">
                Renvoyer l'email
              </Button>

              <div className="pt-4 border-t border-border-color">
                <Link
                  to="/auth/login"
                  className="flex items-center justify-center gap-2 text-primary hover:text-text-primary font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-dark">Mot de passe oublié ?</h2>
          <p className="mt-2 text-text-secondary">
            Pas de souci ! Entrez votre email et nous vous enverrons les instructions de réinitialisation.
          </p>
        </div>

        <Card className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Adresse email"
              type="email"
              placeholder="Entrez votre adresse email"
              icon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register("email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresse email invalide",
                },
              })}
            />

            <Button type="submit" loading={loading} className="w-full" size="lg" icon={<Send className="w-4 h-4" />}>
              Envoyer les instructions
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Vous vous souvenez de votre mot de passe ?{" "}
              <Link to="/auth/login" className="font-medium text-primary hover:text-text-primary">
                Connectez-vous ici
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
