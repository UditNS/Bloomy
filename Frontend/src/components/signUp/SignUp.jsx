import React, { useState, useRef } from "react";
import axios from "axios";
import Sign1 from "../../assets/sign1.png";
import Sign2 from "../../assets/sign2.png";
import Sign4 from "../../assets/sign4.png";
import Avatar1 from '../../assets/Avatar1.png'
import Avatar2 from '../../assets/Avatar2.png'
import { Sparkles, User, Mail, Lock, Cake, Users } from 'lucide-react';
import { Toaster, toast } from "sonner";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { addUser } from "../../utils/userSlice";
import { Link } from "react-router";
import SkillsEditor from "../profile/SkillsEditor";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { BASE_URL } from "../../utils/constant";
import { Spinner } from "@/components/ui/spinner";
import { useForm } from "react-hook-form";

function SignUp() {

  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);

  const { register, handleSubmit, trigger, formState: { errors } } = useForm({ mode: "onBlur" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [proceed, setProceed] = useState(false);
  const container = useRef();

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


  // on blue checks every field when we leave the input field
  const handleFieldBlur = async (fieldName) => {
    const valid = await trigger(fieldName);
    if (!valid) {
      const errorMessage = errors[fieldName]?.message;
      if (errorMessage) toast.error(errorMessage);
    }
  };

  // Handle proceed to step 2
  const handleProceed = async () => {
    // Validate step 1 fields
    const valid = await trigger(["firstName", "lastName", "email", "password"]);
    if (!valid) {
      toast.error("Please fix the errors before proceeding");
      return;
    }


    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut", duration: 0.8 },
    });

    // Fade OUT step 1 (rightImg and leftForm)
    tl.to(".rightImg", { opacity: 0, x: 200, scale: 0.8 }, 0).to(
      ".leftForm",
      { opacity: 0, x: -200, scale: 0.8 },
      0
    );

    // Switch to step 2
    tl.add(() => {
      setProceed(true);
    }, "+=0.2");

    // Fade IN step 2 (leftImg and rightForm)
    tl.fromTo(
      ".leftImg",
      { opacity: 0, x: -200, scale: 0.8 },
      { opacity: 1, x: 0, scale: 1, duration: 0.7 },
      "-=0.3"
    );

    tl.fromTo(
      ".rightForm",
      { opacity: 0, x: 200, scale: 0.8 },
      { opacity: 1, x: 0, scale: 1, duration: 0.7 },
      "-=0.7"
    );
  };

  // Handle final signup
 const handleSignUp = async (data) => {
  setLoading(true);
  try {
    const res = await axios.post(
      BASE_URL + "/signup",
      {
        "firstName": data.firstName,
        "lastName": data.lastName,
        "email": data.email,
        "password": data.password,
        "age": data.age,
        "gender": data.gender,
        description,
        skill: skills,
      },
      { withCredentials: true }
    );
    
    toast.success("Woohoo! 🎊 Your account is ready. Let’s get started!")
    
    // Add a small delay to let the toast be visible before navigating
    setTimeout(() => {
      navigate("/login");
    }, 1500); // 1.5 second delay
    
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong");
    setLoading(false); // Only reset loading on error
  }
};
  useGSAP(
    () => {
      // Initial animation on page load
      gsap.fromTo(
        ".rightImg",
        {
          opacity: 0,
          x: 100,
          scale: 0.9,
        },
        {
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        }
      );

      gsap.fromTo(
        ".leftForm",
        {
          opacity: 0,
          x: -100,
          scale: 0.9,
        },
        {
          x: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        }
      );
    },
    { scope: container }
  );

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Toaster className='hidden md:block' position="bottom-right" richColors />
      <Toaster className='block md:hidden' position="top-center" richColors />
      {/* Card with glow effect */}
      <div className="relative group">
        {/* Animated glow border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-purple-700 via-fuchsia-600 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition duration-300 mt-12 ease-in-out"></div>

        {/* Main content container */}
        <div
          ref={container}
          className="relative mt-12 flex flex-col md:flex-row bg-background rounded-xl over shadow-2xl mx-2 overflow-hidden"
        >
          {/* Step 1: Basic Info Form - LEFT */}
          <div
            className={`${
              proceed ? "hidden" : "block"
            } w-full md:w-96 lg:w-[550px] p-8 md:p-10 flex flex-col justify-center leftForm`}
          >
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
                {step1Fields.map((field) => (
                  <Field key={field.name}>
                    <FieldLabel htmlFor={field.name}>
                      {field.label}
                      <span className="text-red-500 -ml-1.5">*</span>
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
                            bg-background text-foreground placeholder:text-muted-foreground
                        `}
                      />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-600/10 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none"></div>
                    </div>
                  </Field>
                ))}
              </FieldGroup>
            </FieldSet>


            {/* Error Alert */}

            {/* Proceed Button */}
            <Button
              onClick={handleProceed}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              Proceed →
            </Button>
            
            <div className="text-center mt-6 text-sm text-muted-foreground">
              Existing User?{" "}
              <Link className="font-medium text-pink-500 hover:text-pink-600 hover:underline transition-colors duration-200" to="/login">
                Proceed to Login
              </Link>
            </div>
          </div>

          {/* Step 1: Image - RIGHT */}
          <div
            className={`${
              proceed ? "hidden" : "hidden md:block"
            } md:w-96 lg:w-[550px] rightImg relative overflow-`}
          >
            <img
              className="absolute  bottom-1/4 left-32 w-20 h-20"
              src={Sign1}
              alt="Sign Up"
            />
            <img
              className="absolute top-12 left-12 w-20 h-20 group-hover:rotate-12 duration-300"
              src={Sign2}
              alt="Sign Up"
            />
            
            <img
              className="absolute bottom-1 group-hover:rotate-3 -right-1.5 duration-300 w-20 h-20 "
              src={Sign4}
              alt="Sign Up"
            />
            <img
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:-right-3.5 w-[500px] h-[500px] "
              src={Avatar1}
              alt="Sign Up"
            />
            <div className="absolute inset-0 bg-gradient-to-t blur-xs from-black/20 to-transparent"></div>
          </div>

          {/* Step 2: Image - LEFT */}
          <div
            className={`${
              proceed ? "hidden md:block" : "hidden"
            } md:w-96 lg:w-[550px] leftImg relative overflow-hidden`}
          >
            <img
              className="absolute top-12 left-12 w-20 h-20 group-hover:rotate-12 duration-300"
              src={Sign2}
              alt="Sign Up"
            />
            
            <img
              className="absolute bottom-1 group-hover:rotate-3 -right-1.5 duration-300 w-20 h-20 "
              src={Sign4}
              alt="Sign Up"
            />
            <img
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 group-hover:-right-3.5 w-[100vw] h-auto"
              src={Avatar2}
              alt="Sign Up"
            />
            <div className="absolute inset-0 blur-xs bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Step 2: Additional Info Form - RIGHT */}
          <div
            className={`${
              proceed ? "block" : "hidden"
            } w-full md:w-96 lg:w-[550px] p-8 md:p-10 flex flex-col justify-center rightForm`}
          >
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <h3 className="font-bold text-3xl md:text-4xl mb-2 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Tell us more!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Help others get to know you better
              </p>
            </div>
            <form onSubmit={handleSubmit(handleSignUp)}>
            <FieldSet className="w-full ">
              <FieldGroup>
                <Field className="-mb-2">
                  <FieldLabel htmlFor="age">
                    Age<span className="text-red-500 -ml-1.5">*</span>
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
                    bg-background text-foreground placeholder:text-muted-foreground
                    `}
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500/10 to-purple-600/10 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none"></div> 
                  </div>
                </Field>
                {/* Gender */}
                <Field className="-mb-2">
                  <FieldLabel htmlFor="gender">Gender<span className="text-red-500 -ml-1.5">*</span></FieldLabel>
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
                <Field className="md:col-span-2 -mb-2">
                  <FieldLabel htmlFor="description">Bio</FieldLabel>
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
                <div className="md:col-span-2 -mb-2">
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
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Complete Sign Up"}
            </Button>
            </form>


            <div className="text-center mt-6 text-sm text-muted-foreground">
              Existing User?{" "}
              <Link className="font-medium text-pink-500 hover:text-pink-600 hover:underline transition-colors duration-200" to="/login">
                Proceed to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;