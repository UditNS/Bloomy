import React from 'react'
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import SkillsEditor from "../profile/SkillsEditor";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import { useFormContext } from "react-hook-form"; // Changed from useForm
import { Cake, Users, FileText, Award, Sparkles } from 'lucide-react';

const RightForm = ({onToast, onSubmit, description, setDescription, skills, setSkills, loading}) => {
    const { register, trigger, handleSubmit, formState: { errors } } = useFormContext(); // Get form from context

    const handleFieldBlur = async (fieldName) => {
        const valid = await trigger(fieldName);
        // Add a small delay to ensure error state is updated
        setTimeout(() => {
            if (!valid && errors[fieldName]?.message) {
                onToast(errors[fieldName].message);
            }
        }, 0);
    };

  return (
    <>
    <div className="flex flex-col items-center text-center mb-6">
    <div className="mb-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 blur-2xl opacity-50 rounded-full"></div>
    </div>
    <h3 className="font-bold text-4xl md:text-4xl mb-3 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent flex items-center justify-center">
        <Users className="relative w-8 h-8 text-purple-500 animate-pulse" /><span>&nbsp;</span> Tell us more!
    </h3>
    <p className="text-muted-foreground text-sm">
        Help others get to know you better
    </p>
    </div>
        <form onSubmit={handleSubmit(onSubmit)}>
        <FieldSet className="w-full ">
            <FieldGroup>
            <Field className="-mb-2 field-animate">
            <FieldLabel htmlFor="age" className="flex items-center gap-2 text-foreground">
                <Cake className="w-4 h-4 text-pink-500" />
                Age<span className="text-red-500">*</span>
            </FieldLabel>
                <div className="relative group/input">
                <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                {...register("age", {
                    required: "Age is required",
                    min: {
                    value: 18,
                    message: "You must be at least 18 years old",
                    },
                })}
                onBlur={() => handleFieldBlur("age")}
                    
                className={`border rounded-lg transition-all duration-300 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none
                    ${
                errors.age
                ? "border-red-500 focus-visible:ring-2 focus-visible:ring-red-400 focus:border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                : "border-input focus-visible:ring-2 focus-visible:ring-pink-400 focus:border-pink-500 hover:border-pink-400 hover:shadow-[0_0_12px_rgba(236,72,153,0.15)]"
                } 
                !bg-background text-foreground placeholder:text-muted-foreground
                `}
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-600/10 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none"></div> 
                </div>
            </Field>
            {/* Gender */}
            <Field className="-mb-2 field-animate">
                <FieldLabel htmlFor="gender" className="flex items-center gap-2 text-foreground">
                    <Users className="w-4 h-4 text-purple-500" />
                    Gender<span className="text-red-500">*</span>
                </FieldLabel>
                <select
                id="gender"
                {...register("gender", { required: "Gender is required" })}
                onBlur={() => handleFieldBlur("gender")}
                className={`border rounded-md w-full p-2 transition-all duration-300 ${
                    errors.gender
                    ? "border-red-500 focus-visible:ring-2 focus-visible:ring-red-400"
                    : "border-input focus-visible:ring-2 focus-visible:ring-pink-400 hover:border-pink-400"
                } bg-background text-foreground flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50`}
                >

                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                </select>

            </Field>

            {/* Bio - Full Width */}
            <Field className="md:col-span-2 -mb-2 field-animate">
                <FieldLabel htmlFor="description" className="flex items-center gap-2 text-foreground">
                    <FileText className="w-4 h-4 text-fuchsia-500" />
                    Bio
                </FieldLabel>
                <div className="relative group/input">
                <textarea
                id="description"
                placeholder="Tell us about yourself..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`flex w-full border rounded-lg transition-all duration-300 border-input px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-pink-400 focus:border-pink-500 hover:border-pink-400 hover:shadow-[0_0_12px_rgba(236,72,153,0.15)]
                        bg-background text-foreground 
                    `}
                    />
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-600/10 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none"></div>
                </div>
            </Field>

            {/* Skills - Full Width */}
            <div className="md:col-span-2 -mb-2 field-animate">
                <SkillsEditor
                skills={skills}
                setSkills={setSkills}
                isEditing={true}
                />
            </div>
            </FieldGroup>
        </FieldSet>
        {/* Sign Up Button */}
        <Button
            type="submit"
            className="field-animate w-full mt-6 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 hover:from-pink-600 hover:via-fuchsia-600 hover:to-purple-700 text-white font-semibold py-6 rounded-lg shadow-lg hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={loading}
            >
            {loading ? (
                <span className="flex items-center gap-2">
                <Spinner />
                <span>Creating Account...</span>
                </span>
            ) : (
                <span className="flex items-center gap-2">
                <span>Complete Sign Up</span>
                <Sparkles className="w-4 h-4" />
                </span>
            )}
            </Button>
        </form>


        <div className="text-center mt-6 text-sm text-muted-foreground">
            Existing User?{" "}
            <Link className="font-medium text-pink-500 hover:text-pink-600 hover:underline transition-colors duration-200" to="/login">
            Proceed to Login
            </Link>
        </div>   
    </>
  )
}

export default RightForm