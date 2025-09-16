'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Bell, Shield, Crown, Users, Plus, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [users, setUsers] = useState([
    { id: '1', name: 'Sir Knight', email: 'knight@castle.com', isActive: true },
    { id: '2', name: 'Lady Warrior', email: 'warrior@castle.com', isActive: true }
  ])
  const [newUser, setNewUser] = useState({ name: '', email: '' })
  const [showAddUser, setShowAddUser] = useState(false)
  const [emailSettings, setEmailSettings] = useState({
    dailyReminders: true,
    weeklyReports: true,
    bingoCelebrations: true,
    reminderTime: '09:00'
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account', icon: Shield }
  ]

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      const user = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        isActive: true
      }
      setUsers([...users, user])
      setNewUser({ name: '', email: '' })
      setShowAddUser(false)
      toast.success('User added successfully! ⚔️')
    }
  }

  const handleRemoveUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId))
    toast.success('User removed from the realm! 🗡️')
  }

  const handleEmailSettingsChange = (setting: string, value: any) => {
    setEmailSettings(prev => ({ ...prev, [setting]: value }))
    toast.success('Settings updated! ⚙️')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-medieval-800 font-medieval">Profile Settings</h3>
            
            <div className="medieval-card p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-knight-500 to-wizard-500 rounded-full flex items-center justify-center">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-medieval-800">Sir Knight</h4>
                  <p className="text-medieval-600">knight@castle.com</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-medieval-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue="Sir Knight"
                    className="w-full px-4 py-3 border-2 border-medieval-200 rounded-lg focus:border-knight-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-medieval-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    defaultValue="knight@castle.com"
                    className="w-full px-4 py-3 border-2 border-medieval-200 rounded-lg focus:border-knight-500 focus:outline-none"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <button className="knight-button">
                  <Edit className="h-5 w-5 mr-2" />
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        )

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-medieval-800 font-medieval">Manage Users</h3>
              <button
                onClick={() => setShowAddUser(true)}
                className="wizard-button"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add User
              </button>
            </div>

            <div className="space-y-4">
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="medieval-card p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-knight-500 to-wizard-500 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-medieval-800">{user.name}</h4>
                        <p className="text-medieval-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {showAddUser && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="medieval-card p-6"
              >
                <h4 className="text-lg font-bold text-medieval-800 mb-4">Add New User</h4>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-medieval-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-medieval-200 rounded-lg focus:border-knight-500 focus:outline-none"
                      placeholder="Enter user's name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-medieval-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-medieval-200 rounded-lg focus:border-knight-500 focus:outline-none"
                      placeholder="Enter user's email"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleAddUser}
                    className="knight-button"
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => setShowAddUser(false)}
                    className="px-4 py-3 border-2 border-medieval-200 text-medieval-700 rounded-lg hover:border-medieval-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-medieval-800 font-medieval">Notification Settings</h3>
            
            <div className="medieval-card p-6">
              <h4 className="text-lg font-bold text-medieval-800 mb-4">Email Notifications</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-medieval-800">Daily Reminders</h5>
                    <p className="text-sm text-medieval-600">Get daily encouragement and progress updates</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailSettings.dailyReminders}
                      onChange={(e) => handleEmailSettingsChange('dailyReminders', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-knight-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-knight-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-medieval-800">Weekly Reports</h5>
                    <p className="text-sm text-medieval-600">Receive weekly progress summaries</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailSettings.weeklyReports}
                      onChange={(e) => handleEmailSettingsChange('weeklyReports', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-knight-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-knight-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-medieval-800">Bingo Celebrations</h5>
                    <p className="text-sm text-medieval-600">Get notified when you complete a bingo</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emailSettings.bingoCelebrations}
                      onChange={(e) => handleEmailSettingsChange('bingoCelebrations', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-knight-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-knight-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-medieval-800">Reminder Time</h5>
                    <p className="text-sm text-medieval-600">When to send daily reminders</p>
                  </div>
                  <input
                    type="time"
                    value={emailSettings.reminderTime}
                    onChange={(e) => handleEmailSettingsChange('reminderTime', e.target.value)}
                    className="px-3 py-2 border-2 border-medieval-200 rounded-lg focus:border-knight-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'account':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-medieval-800 font-medieval">Account Settings</h3>
            
            <div className="medieval-card p-6">
              <h4 className="text-lg font-bold text-medieval-800 mb-4">Account Information</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-medieval-700 mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    defaultValue="The Smith Family"
                    className="w-full px-4 py-3 border-2 border-medieval-200 rounded-lg focus:border-knight-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-medieval-700 mb-2">
                    Created
                  </label>
                  <input
                    type="text"
                    value="December 2024"
                    disabled
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                  />
                </div>
              </div>
            </div>

            <div className="medieval-card p-6 border-red-200">
              <h4 className="text-lg font-bold text-red-800 mb-4">Danger Zone</h4>
              <p className="text-red-600 mb-4">
                These actions are permanent and cannot be undone.
              </p>
              <button className="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medieval-50 via-knight-50 to-wizard-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-medieval-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Settings className="h-8 w-8 text-medieval-600" />
              <div>
                <h1 className="text-2xl font-bold text-medieval-800 font-medieval">
                  Settings
                </h1>
                <p className="text-medieval-600">Manage your quest configuration</p>
              </div>
            </div>
            <Link href="/dashboard" className="knight-button">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="medieval-card p-6 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-knight-100 text-knight-800 border-2 border-knight-300'
                          : 'text-medieval-600 hover:bg-medieval-50 hover:text-medieval-800'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
