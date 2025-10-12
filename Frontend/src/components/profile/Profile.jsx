import React, { useState } from 'react'
import { X, Plus, Edit2, Save, XCircle } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { BASE_URL } from '../../utils/constant'
import { addUser } from '../../utils/userSlice'
import { toast } from "sonner"
import { Toaster } from "sonner"

// Mock components
const Field = ({ children, className }) => <div className={`space-y-2 ${className}`}>{children}</div>
const FieldLabel = ({ children, htmlFor }) => <label htmlFor={htmlFor} className="text-sm font-medium">{children}</label>

const Input = (props) => <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" {...props} />
const Button = ({ children, variant = "default", ...props }) => {
  const baseClass = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2"
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    gradient:"border border-input bg-gradient-to-r from-pink-600 to-purple-600 shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:hover:bg-input/50",
  }
  return <button className={`${baseClass} ${variants[variant]}`} {...props}>{children}</button>
}

// Skills Component
function SkillsEditor({ skills, setSkills, isEditing }) {
  const [newSkill, setNewSkill] = useState('')

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(skill => skill !== skillToRemove))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-3">
      <FieldLabel>Skills</FieldLabel>
      
      {/* Skills Display */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-3 rounded-md border border-input bg-background">
        {skills?.length === 0 ? (
          <span className="text-sm text-muted-foreground">No skills added yet</span>
        ) : (
          skills?.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
            >
              {skill}
              {isEditing && (
                <button
                  onClick={() => removeSkill(skill)}
                  className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-md p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))
        )}
      </div>

      {/* Add Skill Input (only in edit mode) */}
      {isEditing && (
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a skill (e.g., React, Node.js)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={addSkill} variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      )}
    </div>
  )
}

// Main Profile Component
function Profile() {
  // Mock user data
  const User = useSelector((store) =>store.user)

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(User)
  const [skill, setSkill] = useState(User?.skill)
  const dispatch = useDispatch()
  // Update formData and skills when User changes (e.g., after refresh/reload)
  React.useEffect(() => {
    if (User) {
      setFormData(User)
      setSkill(User?.skill || [])
    }
  }, [User])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    const {firstName, lastName, photo, age, gender, description} = formData
    try{
      const res = await axios.patch(BASE_URL + '/profile/edit', {
        firstName,
        lastName,
        gender,
        age,
        photo,
        skill,
        description
      }, {withCredentials: true})
      dispatch(addUser(res.data.user))
      toast.success("Changes saved successfully")
      setIsEditing(false)
    }catch(error){
      console.log(error.message)
    }
    
  }

  const handleCancel = () => {
    setFormData(User)
    setSkill(User?.skill)
    setIsEditing(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full pt-20 pb-8 px-4  ">
      
      <div className="w-full relative max-w-4xl rounded-2xl shadow-xl overflow-hidden">
        <Toaster position="bottom-right" richColors />

        {/* Header Section */}
        <div className="relative h-32 bg-gradient-to-r from-purple-500 to-pink-500">
          
          <div className="absolute -bottom-16 left-8">
            <div className="relative z-10">
              <img
                src={formData?.photo}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover shadow-lg"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700">
                  <Edit2 className="w-4 h-4"/>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 px-8 relative bg-card">
          {!isEditing ? (
            <Button onClick={handleEdit} variant="outline">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className='flex flex-col items-center space-y-2 md:flex md:flex-row md:space-x-4 md:space-y-0'>
              <Button onClick={handleCancel} variant="outline">
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} variant="gradient">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Form Section */}
        <div className="p-8 pt-16 relative bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            
            {/* First Name */}
            <Field>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={formData?.firstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Field>

            {/* Last Name */}
            <Field>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                value={formData?.lastName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Field>

            

            {/* Age */}
            <Field>
              <FieldLabel htmlFor="age">Age</FieldLabel>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={formData?.age}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </Field>

            {/* Gender */}
            <Field>
              <FieldLabel htmlFor="gender">Gender</FieldLabel>
              <select
                id="gender"
                value={formData?.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>

            {/* Bio - Full Width */}
            <Field className="md:col-span-2">
              <FieldLabel htmlFor="description">Bio</FieldLabel>
              <textarea
                id="description"
                placeholder="Let other people know about you"
                value={formData?.description}
                onChange={handleChange}
                disabled={!isEditing}
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </Field>

            {/* Skills - Full Width */}
            <div className="md:col-span-2">
              <SkillsEditor 
                skills={skill} 
                setSkills={setSkill} 
                isEditing={isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile