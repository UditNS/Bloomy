import React, { useState, useRef } from "react";
import axios from "axios";
import Sign1 from "../../assets/sign1.png";
import Sign2 from "../../assets/sign2.png";

import Sign4 from "../../assets/sign4.png";
import Avatar1 from '../../assets/Avatar1.png'
import Avatar2 from '../../assets/Avatar2.png'

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

function SignUp() {
  // Step 1 form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2 form data
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState([]);

  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [proceed, setProceed] = useState(false);
  const container = useRef();

  // Handle proceed to step 2
  const handleProceed = () => {
    // Validate step 1 fields
    if (!firstName || !lastName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");

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
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          email,
          password,
          age: age ? parseInt(age) : undefined,
          gender,
          description,
          skill: skills,
        },
        { withCredentials: true }
      );

      setLoading(false);
      dispatch(addUser(res.data));
      setError("");
      navigate("/login");
    } catch (error) {
      setLoading(false);
      setError(error?.response?.data?.message || "Something went wrong");
      console.log(error);
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
      {/* Card with glow effect */}
      <div className="relative group">
        {/* Animated glow border */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition duration-300 mt-12 ease-in-out"></div>

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
                <Field>
                  <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    placeholder="Enter your first name"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    placeholder="Enter your last name"
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    placeholder="Enter your email address"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>
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
            <div className="text-center mt-4 font-light text-foreground/60">
              Existing User?{" "}
              <Link className="hover:underline" to="/login">
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

            <FieldSet className="w-full ">
              <FieldGroup>
                <Field className="-mb-2">
                  <FieldLabel htmlFor="age">Age</FieldLabel>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </Field>

                {/* Gender */}
                <Field className="-mb-2">
                  <FieldLabel htmlFor="gender">Gender</FieldLabel>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
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
                  <textarea
                    id="description"
                    placeholder="Tell us about yourself..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
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
              onClick={handleSignUp}
              className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              disabled={loading}
            >
              {loading ? <Spinner /> : "Complete Sign Up"}
            </Button>
            <div className="text-center mt-4 font-light text-foreground/60">
              Existing User?{" "}
              <Link className="hover:underline" to="/login">
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
