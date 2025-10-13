import React from 'react'
import { useState } from 'react'
import { X, Plus } from 'lucide-react'

const FieldLabel = ({ children, htmlFor }) => <label htmlFor={htmlFor} className="text-sm font-medium">{children}</label>

const Input = (props) => <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" {...props} />

const Button = ({ children, variant = "default", ...props }) => {
  const baseClass = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 px-4 py-2"
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    gradient:"border border-input bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xs hover:from-pink-700 hover:to-purple-700",
  }
  return <button className={`${baseClass} ${variants[variant]}`} {...props}>{children}</button>
}


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

export default SkillsEditor