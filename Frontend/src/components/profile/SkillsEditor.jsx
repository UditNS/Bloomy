import React from "react";
import { useState } from "react";
import { X, Award } from "lucide-react";

const FieldLabel = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium">
    {children}
  </label>
);

const Input = (props) => (
  <input
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    {...props}
  />
);

function SkillsEditor({ skills, setSkills, isEditing }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Check if user typed a comma or pressed Enter
    if (value.endsWith(",") || value.endsWith("\n")) {
      const newSkill = value.slice(0, -1).trim();
      if (newSkill && !skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
      }
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    // Handle Enter or comma key
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newSkill = inputValue.trim();
      if (newSkill && !skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
        setInputValue("");
      }
    }

    // Handle Backspace when input is empty to remove last skill
    if (e.key === "Backspace" && inputValue === "" && skills.length > 0) {
      setSkills(skills.slice(0, -1));
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  return (
    <div className="space-y-2">
      <FieldLabel ><div className="flex items-center gap-2 mb-2">
    <Award className="w-4 h-4 text-pink-500" />
    <span className="text-sm font-medium">Skills</span>
    </div></FieldLabel>

      {/* Combined Input with Skills Display */}
      <div
        className={`flex flex-wrap gap-2 min-h-[40px] p-2  rounded-md border ${
          isEditing ? "border-input" : "border-input/60"
        } ${
          isEditing ? "bg-background" : "bg-background/40"
        } focus-within:ring-2 focus-within:ring-ring`}
      >
        {/* Display existing skills */}
        {skills?.map((skill, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 h-8"
          >
            {skill}
            {isEditing && (
              <button
                onClick={() => removeSkill(skill)}
                className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-md p-0.5 ml-1"
                type="button"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}

        {/* Input field */}
        {isEditing && (
          <input
            type="text"
            placeholder={
              skills.length === 0
                ? "Type skills and press Enter or comma"
                : "Add more..."
            }
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-[120px] h-8 outline-none bg-transparent text-sm px-1"
          />
        )}
      </div>

      {/* Helper text */}
      {isEditing && (
        <p className="text-xs text-muted-foreground">
          Press{" "}
          <kbd className="px-1.5 py-0.5 text-xs font-semibold border rounded">
            Enter
          </kbd>{" "}
          or{" "}
          <kbd className="px-1.5 py-0.5 text-xs font-semibold border rounded">
            ,
          </kbd>{" "}
          to add a skill
        </p>
      )}
    </div>
  );
}

export default SkillsEditor;
