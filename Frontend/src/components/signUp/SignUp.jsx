import React, { useState, useRef } from "react";
import axios from "axios";
import Avatar1 from '../../assets/Avatar1.png'
import Avatar2 from '../../assets/Avatar2.png'
import { Sparkles, User, Mail, Lock, Cake, Users } from 'lucide-react';
import { Toaster, toast } from "sonner";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useNavigate } from "react-router";
import { BASE_URL } from "../../utils/constant";
import { useForm, FormProvider } from "react-hook-form";

import LeftForm from "./LeftForm";
import RightForm from "./RightForm";
import Image from "./Image";

function SignUp() {
  const glowRef = useRef(null);
  const headerRef = useRef(null);
  const step1FormRef = useRef(null);
  const step2FormRef = useRef(null);

  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);
  const methods = useForm({ mode: "onBlur" }); // Change this line
  const { register, handleSubmit, trigger, formState: { errors } } = methods;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [proceed, setProceed] = useState(false);
  const container = useRef();

  //animations
  useGSAP(
  () => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Animate glow effect
    tl.from(glowRef.current, {
      scale: 1,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    })
    
    // Initial animation on page load
    
    .fromTo(
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
      },
      "-=0.8"
    );

    // Animate form fields with stagger
    tl.from('.leftForm .field-animate', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out"
    }, "-=0.4");

    // Continuous glow pulse animation
    gsap.to(glowRef.current, {
      opacity: 0.75,
      scale: 1.05,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

  },
  { scope: container }
);

  const handleToast = (message) => {
    toast.error(message);
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
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden relative">
      <Toaster className='hidden md:block' position="bottom-right" richColors />
      <Toaster className='block md:hidden' position="top-center" richColors />
      
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-[10%] w-2 h-2 bg-pink-500 rounded-full blur-sm opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-[15%] w-3 h-3 bg-purple-500 rounded-full blur-sm opacity-50 animate-pulse" style={{animationDelay: '0.3s'}}></div>
        <div className="absolute bottom-32 left-[20%] w-2 h-2 bg-fuchsia-500 rounded-full blur-sm opacity-70 animate-pulse" style={{animationDelay: '0.6s'}}></div>
        <div className="absolute bottom-48 right-[25%] w-2.5 h-2.5 bg-pink-400 rounded-full blur-sm opacity-60 animate-pulse" style={{animationDelay: '0.9s'}}></div>
      </div>
      {/* Card with glow effect */}
      <div className="relative group">
        {/* Animated glow border */}
        <div 
          ref={glowRef}
          className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-fuchsia-600 to-purple-700 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500 mt-12"
        ></div>

        {/* Main content container */}
        <div
          ref={container}
          className="relative mt-12 flex flex-col md:flex-row bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl overflow-hidden shadow-2xl mx-2"
        >
          {/* Step 1: Basic Info Form - LEFT */}
          <div
            className={`${
              proceed ? "hidden" : "block"
            } w-full md:w-96 lg:w-[600px] p-8 md:p-10 flex flex-col justify-center leftForm`}
          >
            {/* Header */}
            <FormProvider {...methods}>
              <LeftForm 
                onToast={handleToast} 
                onProceed={handleProceed}
              />
            </FormProvider>

            
          </div>

          {/* Step 1: Image - RIGHT */}
          <div
            className={`${
              proceed ? "hidden" : "hidden md:block"
            } md:w-96 lg:w-[550px] rightImg relative overflow-hidden`}
          >
            <Image 
              Avatar={Avatar1}
              showImg = {true}
            />
          </div>

          {/* Step 2: Image - LEFT */}
          <div
            className={`${
              proceed ? "hidden md:block" : "hidden"
            } md:w-96 lg:w-[550px] leftImg relative overflow-hidden`}
          >
            <Image 
              Avatar={Avatar2}
              showImg = {false}
            />
          </div>

          {/* Step 2: Additional Info Form - RIGHT */}
          <div
            className={`${
              proceed ? "block" : "hidden"
            } w-full md:w-96 lg:w-[600px] p-8 md:p-10 flex flex-col justify-center rightForm`}
          >
            {/* Header */}
            <FormProvider {...methods}>

            <RightForm 
              onToast={handleToast} 
              onSubmit={handleSignUp}
              description = {description}
              setDescription = {setDescription}
              skills = {skills}
              setSkills = {setSkills}
              loading = {loading}
              />
              </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;