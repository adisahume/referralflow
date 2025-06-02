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
  const showNotification = (message: string, duration = 3000) => {
    setNotification(message);
    setTimeout(() => setNotification(null), duration);
  };

  // Filter states
  const [nameFilter, setNameFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [tagFilter, setTagFilter] = useState<string>('');

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
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleJobSearch = (companyName: string) => {
    if (companyName.length > 2) {
      const linkedInJobsUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(companyName)}`;
      window.open(linkedInJobsUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-10 text-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Notification with animation */}
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

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-8"
        >
          ReferralFlow Tracker
        </motion.h1>

        {/* Form Section with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 hover:shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2 text-gray-700">Name</label>
              <input
                type="text"
                placeholder="e.g. Priya"
                className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex flex-col relative">
              <label className="text-sm font-medium mb-2 text-gray-700">Company</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Google"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                {company.length > 2 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const linkedInJobsUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(company)}`;
                      window.open(linkedInJobsUrl, '_blank');
                      showNotification('✨ Opening LinkedIn Jobs in a new tab');
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                  >
                    View Jobs →
                  </motion.button>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2 text-gray-700">Stage</label>
              <select
                className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2 text-gray-700">Referral Status</label>
              <select
                className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                value={referralStatus}
                onChange={(e) => setReferralStatus(e.target.value)}
              >
                {REFERRAL_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium mb-2 text-gray-700">Contact Details</label>
              <input
                type="text"
                placeholder="e.g. email@example.com, +1234567890"
                className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
                value={contactDetails}
                onChange={(e) => setContactDetails(e.target.value)}
              />
            </div>

            <div className="flex flex-col md:col-span-6">
              <label className="text-sm font-medium mb-2 text-gray-700">Tags</label>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200'
                        : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end md:col-span-6">
              <button
                onClick={addOrUpdateContact}
                className={`w-full ${
                  editIndex !== null 
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600' 
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                } text-white py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
              >
                {editIndex !== null ? '💾 Save Changes' : '➕ Add Contact'}
              </button>
            </div>
          </div>

          {/* Referral Message Template Toggle */}
          <div className="mt-6 border-t pt-6">
            <button
              onClick={() => setShowReferralTemplate(!showReferralTemplate)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
            >
              {showReferralTemplate ? '📝 Hide Referral Template' : '📝 Show Referral Template'}
            </button>
            
            {showReferralTemplate && (
              <div className="mt-4">
                <label className="text-sm font-medium mb-2 text-gray-700 block">
                  Referral Message Template
                </label>
                <textarea
                  value={referralMessage}
                  onChange={(e) => setReferralMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 min-h-[200px] font-mono"
                  placeholder="Enter your referral message template..."
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Contact List Table with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-center py-5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-900 border-b border-gray-200"
          >
            Contact List
          </motion.h2>

          {/* Filters Section with animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-4 border-b border-gray-200 bg-gray-50"
          >
            <div className="text-sm font-medium text-gray-700 mb-2">Filters</div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                type="text"
                placeholder="Filter by name..."
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
              />
              <input
                type="text"
                placeholder="Filter by company..."
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
              />
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
              >
                <option value="">All Stages</option>
                {STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {REFERRAL_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
              >
                <option value="">All Tags</option>
                {TAGS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </motion.div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-b border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="border-b border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                  <th className="border-b border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-700">Stage</th>
                  <th className="border-b border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-700">Referral Status</th>
                  <th className="border-b border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-700">Contact Details</th>
                  <th className="border-b border-gray-200 px-6 py-3 text-left text-sm font-semibold text-gray-700">Tags</th>
                  <th className="border-b border-gray-200 px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredContacts.length === 0 ? (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <td colSpan={7} className="text-center py-8 text-gray-400 border-b border-gray-100">
                        {contacts.length === 0 ? 'No contacts added yet' : 'No contacts match the current filters'}
                      </td>
                    </motion.tr>
                  ) : (
                    filteredContacts.map((contact, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="border-b border-gray-100 px-6 py-4 text-gray-800">{contact.name}</td>
                        <td className="border-b border-gray-100 px-6 py-4 text-gray-800">{contact.company}</td>
                        <td className="border-b border-gray-100 px-6 py-4">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStageColor(contact.stage)}`}
                          >
                            {contact.stage}
                          </motion.span>
                        </td>
                        <td className="border-b border-gray-100 px-6 py-4">
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getReferralStatusColor(contact.referralStatus)}`}
                          >
                            {contact.referralStatus}
                          </motion.span>
                        </td>
                        <td className="border-b border-gray-100 px-6 py-4 text-gray-800">
                          {contact.contactDetails || '-'}
                        </td>
                        <td className="border-b border-gray-100 px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.map((tag, tagIndex) => (
                              <motion.span
                                key={tagIndex}
                                whileHover={{ scale: 1.05 }}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200"
                              >
                                {tag}
                              </motion.span>
                            ))}
                            {contact.tags.length === 0 && '-'}
                          </div>
                        </td>
                        <td className="border-b border-gray-100 px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => startEdit(index)}
                              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100 transition-colors duration-150"
                            >
                              ✏️ Edit
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
