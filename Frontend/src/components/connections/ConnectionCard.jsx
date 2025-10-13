import React from 'react'
import { Button } from '../ui/button'
import { MessageCircle, UserX } from 'lucide-react'


function ConnectionCard({ connection, onMessage, onRemove }) {
  return (
    <div className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-border">
      <div className="flex flex-col sm:flex-row items-center sm:items-start p-4 gap-4">
        {/* Profile Image */}
        <div className="relative flex-shrink-0">
          <img
            src={connection.photo}
            alt={connection.firstName}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-purple-100 dark:border-purple-900"
          />
          <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white truncate">
              {connection.firstName} {connection.lastName}
            </h3>
            {connection.age && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {connection.age} years old
              </p>
            )}
          </div>

          {connection.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
              {connection.description}
            </p>
          )}

          {/* Skills */}
          {connection.skill && connection.skill.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              {connection.skill.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded-full"
                >
                  {skill}
                </span>
              ))}
              {connection.skill.length > 3 && (
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full">
                  +{connection.skill.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex sm:flex-col gap-2 w-full sm:w-auto justify-center">
          <Button
            onClick={() => onMessage(connection)}
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            <MessageCircle className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Message</span>
          </Button>
          <Button
            onClick={() => onRemove(connection)}
            variant="destructive"
            className="flex-1 sm:flex-none"
          >
            <UserX className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ConnectionCard