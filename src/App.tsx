import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

type Contact = {
  name: string;
  company: string;
  stage: string;
  referralStatus: string;
  contactDetails: string;
  referralMessage: string;
  tags: string[];
};

const STAGES = ['Connection Sent', 'Accepted', 'Referral Asked'];
const REFERRAL_STATUSES = ['Pending', 'Will Refer', 'Won\'t Refer'];
const TAGS = ['SJSU Alum', 'Hiring Manager', 'Fast Responder', 'High Priority', 'Tech Lead', 'Referred Before'];

const DEFAULT_REFERRAL_MESSAGE = `Hi [Hiring Manager],

I'd like to refer [Name] for [Position] at [Company]. They have demonstrated strong skills in [Skills] and I believe they would be a great addition to the team.

[Name] has [X] years of experience in [Field] and has previously worked at [Previous Companies].

You can reach them at [Contact Details].

Best regards,
[Your Name]`;

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'Connection Sent':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Accepted':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Referral Asked':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getReferralStatusColor = (status: string) => {
  switch (status) {
    case 'Will Refer':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Won\'t Refer':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

function App() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Load from localStorage on initial mount
  useEffect(() => {
    const storedContacts = localStorage.getItem('referralflow-contacts');
    if (storedContacts) {
      setContacts(JSON.parse(storedContacts));
    }
  }, []);

  // Save to localStorage every time contacts change
  useEffect(() => {
    if (contacts.length > 0) {
      localStorage.setItem('referralflow-contacts', JSON.stringify(contacts));
    }
  }, [contacts]);

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
  
  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const showNotification = (message: string, duration = 3000) => {
    setNotification(message);
    setTimeout(() => setNotification(null), duration);
  };

  const filteredContacts = contacts.filter(contact => {
    const nameMatch = contact.name.toLowerCase().includes(nameFilter.toLowerCase());
    const companyMatch = contact.company.toLowerCase().includes(companyFilter.toLowerCase());
    const stageMatch = !stageFilter || contact.stage === stageFilter;
    const statusMatch = !statusFilter || contact.referralStatus === statusFilter;
    const tagMatch = !tagFilter || contact.tags.includes(tagFilter);

    return nameMatch && companyMatch && stageMatch && statusMatch && tagMatch;
  });

  const resetForm = () => {
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

  const addOrUpdateContact = () => {
    if (!name || !company) {
      showNotification('❌ Please enter both name and company.');
      return;
    }

    if (editIndex !== null) {
      const updated = [...contacts];
      updated[editIndex] = {
        name,
        company,
        stage,
        referralStatus,
        contactDetails,
        referralMessage,
        tags: selectedTags,
      };
      setContacts(updated);
      showNotification('✅ Contact updated successfully.');
    } else {
      setContacts([
        ...contacts,
        {
          name,
          company,
          stage,
          referralStatus,
          contactDetails,
          referralMessage,
          tags: selectedTags,
        },
      ]);
      showNotification('✅ Contact added successfully.');
    }

    resetForm();
  };

  const startEdit = (index: number) => {
    const c = contacts[index];
    setName(c.name);
    setCompany(c.company);
    setStage(c.stage);
    setReferralStatus(c.referralStatus);
    setContactDetails(c.contactDetails);
    setReferralMessage(c.referralMessage);
    setSelectedTags(c.tags);
    setEditIndex(index);
    setShowAddForm(true);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm font-medium px-6 py-3 rounded-lg shadow-lg z-50"
            >
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-6"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            ReferralFlow
          </h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span className="text-lg">+</span> Add Contact
          </motion.button>
        </motion.div>

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {editIndex !== null ? 'Edit Contact' : 'Add New Contact'}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name & Company */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Priya"
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Company</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. Google"
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                        />
                        {company.length > 2 && (
                          <button
                            onClick={() => {
                              const linkedInJobsUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(company)}`;
                              window.open(linkedInJobsUrl, '_blank');
                              showNotification('✨ Opening LinkedIn Jobs in a new tab');
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 text-sm"
                          >
                            View Jobs →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stage & Status */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Stage</label>
                      <select
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        value={stage}
                        onChange={(e) => setStage(e.target.value)}
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Referral Status</label>
                      <select
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        value={referralStatus}
                        onChange={(e) => setReferralStatus(e.target.value)}
                      >
                        {REFERRAL_STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Contact Details</label>
                    <input
                      type="text"
                      placeholder="e.g. email@example.com, +1234567890"
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={contactDetails}
                      onChange={(e) => setContactDetails(e.target.value)}
                    />
                  </div>

                  {/* Tags */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Tags</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedTags.includes(tag)
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-gray-100 text-gray-800 border border-gray-200'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Referral Message */}
                  <div className="md:col-span-2">
                    <button
                      onClick={() => setShowReferralTemplate(!showReferralTemplate)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono min-h-[200px]"
                            placeholder="Enter your referral message template..."
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addOrUpdateContact}
                    className={`px-4 py-2 rounded-lg text-white ${
                      editIndex !== null
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {editIndex !== null ? '💾 Save Changes' : '➕ Add Contact'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Contacts List */}
        <div className="space-y-4">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <span className="text-lg">{showFilters ? '−' : '+'}</span>
                <span className="font-medium">Filters</span>
              </button>
              
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
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={nameFilter}
                      onChange={(e) => setNameFilter(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Filter by company..."
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={companyFilter}
                      onChange={(e) => setCompanyFilter(e.target.value)}
                    />
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={stageFilter}
                      onChange={(e) => setStageFilter(e.target.value)}
                    >
                      <option value="">All Stages</option>
                      {STAGES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      {REFERRAL_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
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

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {filteredContacts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="md:col-span-2 lg:col-span-3 text-center py-8 text-gray-400"
                >
                  {contacts.length === 0 ? 'No contacts added yet' : 'No contacts match the current filters'}
                </motion.div>
              ) : (
                filteredContacts.map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-900">{contact.name}</h3>
                          <p className="text-sm text-gray-600">{contact.company}</p>
                        </div>
                        <button
                          onClick={() => startEdit(index)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          ✏️
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStageColor(contact.stage)}`}>
                            {contact.stage}
                          </span>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getReferralStatusColor(contact.referralStatus)}`}>
                            {contact.referralStatus}
                          </span>
                        </div>
                        
                        {contact.contactDetails && (
                          <p className="text-sm text-gray-600">
                            📧 {contact.contactDetails}
                          </p>
                        )}
                        
                        {contact.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
