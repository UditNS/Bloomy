import React from "react";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form"; // Changed from useForm
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { User, User2, Mail, Lock } from 'lucide-react';

const LeftForm = ({ onToast, onProceed }) => {
  const {
    register,
    trigger,
    formState: { errors },
  } = useFormContext(); // Get form from context

  const handleFieldBlur = async (fieldName) => {
  const valid = await trigger(fieldName);
  // Add a small delay to ensure error state is updated
  setTimeout(() => {
    if (!valid && errors[fieldName]?.message) {
      onToast(errors[fieldName].message);
    }
  }, 0);
};

  const step1Fields = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter your first name",
      rules: {
        required: "First name is required",
        minLength: { value: 2, message: "Minimum 2 characters" },
      },
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter your last name",
      rules: {
        required: "Last name is required",
        minLength: { value: 2, message: "Minimum 2 characters" },
      },
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email address",
      rules: {
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Enter a valid email address",
        },
      },
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "••••••••",
      rules: {
        required: "Password is required",
        minLength: { value: 8, message: "Minimum 8 characters" },
        pattern: {
          value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
          message: "Must contain 1 uppercase, 1 number, and 1 special char",
        },
      },
    },
  ];

  return (
    <>
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <h3 className="font-bold text-3xl md:text-5xl mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Welcome!
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Join our community and connect with amazing people
        </p>
      </div>

      {/* Form Fields */}
      <FieldSet className="w-full">
        <FieldGroup>
          {step1Fields.map((field) => {
            const icons = {
                firstName: <User className="w-4 h-4 text-pink-500" />,
                lastName: <User2 className="w-4 h-4 text-pink-500" />,
                email: <Mail className="w-4 h-4 text-purple-500" />,
                password: <Lock className="w-4 h-4 text-fuchsia-500" />
            };
            return (<Field key={field.name}>
              <FieldLabel htmlFor={field.name}>
                {icons[field.name]}
                {field.label}
                <span className="text-red-500/90 -ml-1.5">*</span>
              </FieldLabel>
              <div className="relative group/input">
                <Input
                  id={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  {...register(field.name, field.rules)}
                  onBlur={() => handleFieldBlur(field.name)}
                  className={`border rounded-lg transition-all duration-300 
                    ${
                      errors[field.name]
                        ? "border-red-500 focus-visible:ring-2 focus-visible:ring-red-400 focus:border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                        : "border-input focus-visible:ring-2 focus-visible:ring-pink-400 focus:border-pink-500 hover:border-pink-400 hover:shadow-[0_0_12px_rgba(236,72,153,0.15)]"
                    } 
                    !bg-background text-foreground placeholder:text-muted-foreground
                  `}
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-600/10 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </Field>)
})}
        </FieldGroup>
      </FieldSet>

      {/* Proceed Button */}
      <Button
        onClick={onProceed}
        className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
      >
        Proceed →
      </Button>

      <div className="text-center mt-6 text-sm text-muted-foreground">
        Existing User?{" "}
        <Link
          className="font-medium text-pink-500 hover:text-pink-600 hover:underline transition-colors duration-200"
          to="/login"
        >
          Proceed to Login
        </Link>
      </div>
    </>
  );
};

export default LeftForm;
