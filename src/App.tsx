/**
 * ReferralFlow - A secure LinkedIn connections tracker for managing referrals
 * 
 * This application helps users manage their professional network contacts,
 * track referral requests, and maintain encrypted contact information.
 * Built with React, TypeScript, and TailwindCSS.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';
import CryptoJS from 'crypto-js';

// Security configuration
// TODO: In production, this should be stored in environment variables
const ENCRYPTION_KEY = 'your-secure-key-2024';

// Type definitions
interface Contact {
  name: string;
  company: string;
  stage: string;
  referralStatus: string;
  contactDetails: string;
  referralMessage: string;
  tags: string[];
}

// Application constants
const STAGES = ['Connection Sent', 'Accepted', 'Referral Asked'];
const REFERRAL_STATUSES = ['Pending', 'Will Refer', 'Won\'t Refer'];
const TAGS = ['SJSU Alum', 'Hiring Manager', 'Fast Responder', 'High Priority', 'Tech Lead', 'Referred Before'];

// Default template for referral messages
const DEFAULT_REFERRAL_MESSAGE = `Hi [Hiring Manager],

I'd like to refer [Name] for [Position] at [Company]. They have demonstrated strong skills in [Skills] and I believe they would be a great addition to the team.

[Name] has [X] years of experience in [Field] and has previously worked at [Previous Companies].

You can reach them at [Contact Details].

Best regards,
[Your Name]`;

/**
 * Utility function to get the appropriate color class for a stage
 * @param stage - The current stage of the referral process
 * @returns Tailwind CSS classes for styling
 */
const getStageColor = (stage: string): string => {
  switch (stage) {
    case 'Connection Sent':
      return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    case 'Accepted':
      return 'bg-neutral-200 text-neutral-900 border-neutral-300';
    case 'Referral Asked':
      return 'bg-neutral-300 text-neutral-900 border-neutral-400';
    default:
      return 'bg-neutral-100 text-neutral-800 border-neutral-200';
  }
};

/**
 * Utility function to get the appropriate color class for a referral status
 * @param status - The current referral status
 * @returns Tailwind CSS classes for styling
 */
const getReferralStatusColor = (status: string): string => {
  switch (status) {
    case 'Will Refer':
      return 'bg-neutral-200 text-neutral-900 border-neutral-300';
    case 'Won\'t Refer':
      return 'bg-neutral-900 text-white border-neutral-700';
    default:
      return 'bg-neutral-100 text-neutral-800 border-neutral-200';
  }
};

/**
 * Utility function to get the appropriate color class for a tag
 * @param tag - The tag name
 * @returns Tailwind CSS classes for styling
 */
const getTagColor = (tag: string): string => {
  switch (tag) {
    case 'SJSU Alum':
      return 'bg-neutral-900 text-white';
    case 'Hiring Manager':
      return 'bg-neutral-800 text-white';
    case 'Fast Responder':
      return 'bg-neutral-700 text-white';
    case 'High Priority':
      return 'bg-neutral-200 text-neutral-900 border border-neutral-400';
    case 'Tech Lead':
      return 'bg-neutral-300 text-neutral-900';
    case 'Referred Before':
      return 'bg-neutral-100 text-neutral-900 border border-neutral-300';
    default:
      return 'bg-neutral-100 text-neutral-800';
  }
};

/**
 * Encryption utilities for secure data storage
 */
const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const decryptData = (encryptedData: string): any => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

/**
 * Main Application Component
 */
function App() {
  // State management
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [stage, setStage] = useState(STAGES[0]);
  const [referralStatus, setReferralStatus] = useState(REFERRAL_STATUSES[0]);
  const [contactDetails, setContactDetails] = useState('');
  const [referralMessage, setReferralMessage] = useState(DEFAULT_REFERRAL_MESSAGE);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showReferralTemplate, setShowReferralTemplate] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  
  // Filter state
  const [nameFilter, setNameFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Load encrypted data from localStorage on initial mount
  useEffect(() => {
    const storedData = localStorage.getItem('referralflow-contacts');
    if (storedData) {
      const decryptedContacts = decryptData(storedData);
      if (decryptedContacts) {
        setContacts(decryptedContacts);
      }
    }
  }, []);

  // Save encrypted data to localStorage when contacts change
  useEffect(() => {
    if (contacts.length > 0) {
      const encryptedData = encryptData(contacts);
      localStorage.setItem('referralflow-contacts', encryptedData);
    }
  }, [contacts]);

  /**
   * Display a temporary notification message
   * @param message - The message to display
   * @param duration - How long to show the message (in ms)
   */
  const showNotification = (message: string, duration = 3000): void => {
    setNotification(message);
    setTimeout(() => setNotification(null), duration);
  };

  /**
   * Filter contacts based on current filter criteria
   */
  const filteredContacts = contacts.filter(contact => {
    const nameMatch = contact.name.toLowerCase().includes(nameFilter.toLowerCase());
    const companyMatch = contact.company.toLowerCase().includes(companyFilter.toLowerCase());
    const stageMatch = !stageFilter || contact.stage === stageFilter;
    const statusMatch = !statusFilter || contact.referralStatus === statusFilter;
    const tagMatch = !tagFilter || contact.tags.includes(tagFilter);

    return nameMatch && companyMatch && stageMatch && statusMatch && tagMatch;
  });

  /**
   * Reset form state to default values
   */
  const resetForm = (): void => {
    setName('');
    setCompany('');
    setStage(STAGES[0]);
    setReferralStatus(REFERRAL_STATUSES[0]);
    setContactDetails('');
    setReferralMessage(DEFAULT_REFERRAL_MESSAGE);
    setSelectedTags([]);
    setEditIndex(null);
    setShowAddForm(false);
  };

  /**
   * Add a new contact or update an existing one
   */
  const addOrUpdateContact = (): void => {
    if (!name || !company) {
      showNotification('❌ Please enter both name and company.');
      return;
    }

    const contactData = {
      name,
      company,
      stage,
      referralStatus,
      contactDetails,
      referralMessage,
      tags: selectedTags,
    };

    if (editIndex !== null) {
      const updated = [...contacts];
      updated[editIndex] = contactData;
      setContacts(updated);
      showNotification('✅ Contact updated successfully.');
    } else {
      setContacts([...contacts, contactData]);
      showNotification('✅ Contact added successfully.');
    }

    resetForm();
  };

  /**
   * Start editing an existing contact
   * @param index - The index of the contact to edit
   */
  const startEdit = (index: number): void => {
    const contact = contacts[index];
    setName(contact.name);
    setCompany(contact.company);
    setStage(contact.stage);
    setReferralStatus(contact.referralStatus);
    setContactDetails(contact.contactDetails);
    setReferralMessage(contact.referralMessage);
    setSelectedTags(contact.tags);
    setEditIndex(index);
    setShowAddForm(true);
  };

  /**
   * Toggle a tag selection
   * @param tag - The tag to toggle
   */
  const toggleTag = (tag: string): void => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  /**
   * Delete a contact
   * @param index - The index of the contact to delete
   */
  const deleteContact = (index: number): void => {
    const updatedContacts = [...contacts];
    updatedContacts.splice(index, 1);
    setContacts(updatedContacts);
    showNotification('🗑️ Contact deleted successfully');
  };

  return (
    <div className="min-h-screen bg-white px-4 py-6 text-neutral-900">
      <div className="max-w-7xl mx-auto">
        {/* App Header with Description */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">ReferralFlow</h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Your LinkedIn connections tracker for managing referrals. Keep track of your professional network and manage referral requests efficiently.
          </p>
        </div>

        {/* Notification System */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white text-sm font-medium px-6 py-3 rounded-lg shadow-lg z-50"
            >
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Header with Add Contact Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-3xl font-bold text-neutral-900">
            ReferralFlow
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg shadow-md hover:bg-neutral-800 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">+</span> Add Contact
          </motion.button>
        </motion.div>

        {/* Add/Edit Contact Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              {/* Modal Content */}
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-neutral-200"
              >
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900">
                    {editIndex !== null ? 'Edit Contact' : 'Add New Contact'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-neutral-500 hover:text-neutral-700"
                  >
                    ✕
                  </button>
                </div>

                {/* Contact Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name & Company Section */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Priya"
                        className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Company</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. Google"
                          className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                        />
                        {/* LinkedIn Jobs Integration */}
                        {company.length > 2 && (
                          <button
                            onClick={() => {
                              const linkedInJobsUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(company)}`;
                              window.open(linkedInJobsUrl, '_blank');
                              showNotification('✨ Opening LinkedIn Jobs in a new tab');
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-900 text-sm"
                          >
                            View Jobs →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stage & Status Section */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Stage</label>
                      <select
                        className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-700">Referral Status</label>
                      <select
                        className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                        value={referralStatus}
                        onChange={(e) => setReferralStatus(e.target.value)}
                      >
                        {REFERRAL_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contact Details Section */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-neutral-700">Contact Details</label>
                    <input
                      type="text"
                      placeholder="e.g. email@example.com, +1234567890"
                      className="mt-1 w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                      value={contactDetails}
                      onChange={(e) => setContactDetails(e.target.value)}
                    />
                  </div>

                  {/* Tags Section */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-neutral-700">Tags</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-neutral-900 text-white'
                              : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Referral Message Template Section */}
                  <div className="md:col-span-2">
                    <button
                      onClick={() => setShowReferralTemplate(!showReferralTemplate)}
                      className="text-neutral-600 hover:text-neutral-900 text-sm font-medium"
                    >
                      {showReferralTemplate ? '📝 Hide Template' : '📝 Show Template'}
                    </button>
                    
                    <AnimatePresence>
                      {showReferralTemplate && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2"
                        >
                          <textarea
                            value={referralMessage}
                            onChange={(e) => setReferralMessage(e.target.value)}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-mono min-h-[200px] focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                            placeholder="Enter your referral message template..."
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 text-neutral-600 hover:text-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addOrUpdateContact}
                    className={`px-4 py-2 rounded-lg text-white ${
                      editIndex !== null
                        ? 'bg-neutral-700 hover:bg-neutral-800'
                        : 'bg-neutral-900 hover:bg-neutral-800'
                    }`}
                  >
                    {editIndex !== null ? '💾 Save Changes' : '➕ Add Contact'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contacts List Section */}
        <div className="space-y-4">
          {/* Filters Panel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-200"
          >
            <div className="p-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-neutral-700 hover:text-neutral-900"
              >
                <span className="text-lg">{showFilters ? '−' : '+'}</span>
                <span className="font-medium">Filters</span>
              </button>
              
              {/* Expandable Filters */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4"
                  >
                    <input
                      type="text"
                      placeholder="Filter by name..."
                      className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Filter by company..."
                      className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                      value={companyFilter}
                      onChange={(e) => setCompanyFilter(e.target.value)}
                    />
                    <select
                      className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                      value={stageFilter}
                      onChange={(e) => setStageFilter(e.target.value)}
                    >
                      <option value="">All Stages</option>
                      {STAGES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <select
                      className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      {REFERRAL_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <select
                      className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900"
                      value={tagFilter}
                      onChange={(e) => setTagFilter(e.target.value)}
                    >
                      <option value="">All Tags</option>
                      {TAGS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Contacts Table */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Contact Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {filteredContacts.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-neutral-400">
                        {contacts.length === 0 ? 'No contacts added yet' : 'No contacts match the current filters'}
                      </td>
                    </tr>
                  ) : (
                    filteredContacts.map((contact, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-neutral-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <div className="text-sm font-medium text-neutral-900">{contact.name}</div>
                            <div className="text-sm text-neutral-500">{contact.company}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getStageColor(contact.stage)}`}>
                              {contact.stage}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${getReferralStatusColor(contact.referralStatus)}`}>
                              {contact.referralStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-600">
                            {contact.contactDetails ? (
                              <span>📧 {contact.contactDetails}</span>
                            ) : (
                              <span className="text-neutral-400">No contact details</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => startEdit(index)}
                              className="text-neutral-400 hover:text-neutral-600 transition-colors"
                              title="Edit contact"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this contact?')) {
                                  deleteContact(index);
                                }
                              }}
                              className="text-neutral-400 hover:text-red-600 transition-colors"
                              title="Delete contact"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
