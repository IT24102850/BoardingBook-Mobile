import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, X, Send, Users, Home, Bell, GripHorizontal, Trash2, Check, ArrowRight, Plus, Mail, UserPlus } from 'lucide-react';
import { FaUserFriends, FaMoneyBillWave, FaBed } from 'react-icons/fa';

// Mock user data
const mockUser = {
  id: 'user123',
  name: 'You',
  email: 'student@boarding.com',
};

// Mock roommate profiles
const mockRoommateProfiles = [
  {
    id: 1,
    name: 'Ayesha',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    description: 'Clean, quiet, loves to cook',
    budget: 12000,
    gender: 'Female',
    academicYear: '2nd Year',
    preferences: 'Early riser, non-smoker',
    roomType: 'Single Room',
    boardingHouse: 'Sunrise Boarding',
  },
  {
    id: 2,
    name: 'Nuwan',
    image: 'https://randomuser.me/api/portraits/men/34.jpg',
    description: 'Outgoing, enjoys music',
    budget: 15000,
    gender: 'Male',
    academicYear: '3rd Year',
    preferences: 'Night owl, likes guests',
    roomType: 'Shared Room',
    boardingHouse: 'Green Villa',
  },
  {
    id: 3,
    name: 'Sithara',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    description: 'Pet friendly, vegetarian',
    budget: 11000,
    gender: 'Female',
    academicYear: '1st Year',
    preferences: 'No parties, early bedtime',
    roomType: 'Single Room',
    boardingHouse: 'Sunrise Boarding',
  },
];

const mockBoardingHouses = [
  { id: 'h1', name: 'Sunrise Boarding', vacancies: 1 },
  { id: 'h2', name: 'Green Villa', vacancies: 2 },
  { id: 'h3', name: 'Blue Haven', vacancies: 0 },
];

// Types
interface RoommateRequest {
  id: string;
  from: typeof mockRoommateProfiles[0];
  message: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface BookingGroup {
  id: string;
  name: string;
  members: typeof mockRoommateProfiles[0][];
  house: string;
  createdDate: string;
  status: 'forming' | 'ready' | 'booked';
}

interface RoommateProfile {
  description: string;
  budget: number;
  gender: string;
  preferences: string;
  boardingHouse: string;
  lookingFor: string;
}

export default function RoommateFinderEnhanced() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'browse' | 'sent' | 'inbox' | 'groups' | 'notifications'>('profile');
  
  // Profile tab state
  const [myProfile, setMyProfile] = useState<RoommateProfile>({
    description: '',
    budget: 12000,
    gender: 'Select',
    preferences: '',
    boardingHouse: '',
    lookingFor: 'Shared Room',
  });
  const [profileEditing, setProfileEditing] = useState(false);

  // Browse tab state
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<number[]>([]);
  const [passedProfiles, setPassedProfiles] = useState<number[]>([]);

  // Requests state
  const [sentRequests, setSentRequests] = useState<RoommateRequest[]>([
    {
      id: 'req1',
      from: mockRoommateProfiles[0],
      message: 'Hi! I think we would be great roommates!',
      date: '2026-03-01',
      status: 'pending',
    },
  ]);

  const [inboxRequests, setInboxRequests] = useState<RoommateRequest[]>([
    {
      id: 'req2',
      from: mockRoommateProfiles[1],
      message: 'Want to room together?',
      date: '2026-03-02',
      status: 'pending',
    },
  ]);

  // Groups state
  const [bookingGroups, setBookingGroups] = useState<BookingGroup[]>([
    {
      id: 'grp1',
      name: 'Malabe Squad',
      members: [mockRoommateProfiles[0], mockRoommateProfiles[2]],
      house: 'Sunrise Boarding',
      createdDate: '2026-02-28',
      status: 'forming',
    },
  ]);

  const [newGroupName, setNewGroupName] = useState('');
  const [selectedHouse, setSelectedHouse] = useState('');
  const [groupMembers, setGroupMembers] = useState<number[]>([]);

  // Handle profile update
  const handleProfileSave = () => {
    setProfileEditing(false);
    alert('✅ Profile saved successfully!');
  };

  // Handle swipe
  const handleSwipe = (direction: 'like' | 'pass') => {
    const currentProfile = mockRoommateProfiles[currentProfileIndex];
    if (direction === 'like') {
      setLikedProfiles([...likedProfiles, currentProfile.id]);
    } else {
      setPassedProfiles([...passedProfiles, currentProfile.id]);
    }
    setCurrentProfileIndex((prev) => (prev + 1) % mockRoommateProfiles.length);
  };

  // Handle send request
  const handleSendRequest = (profileId: number) => {
    const profile = mockRoommateProfiles.find((p) => p.id === profileId);
    if (profile) {
      const newRequest: RoommateRequest = {
        id: `req_${Date.now()}`,
        from: profile,
        message: 'Hi! I think we would be great roommates!',
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
      };
      setSentRequests([...sentRequests, newRequest]);
      alert(`✅ Sent request to ${profile.name}!`);
    }
  };

  // Handle accept/reject requests
  const handleRequestResponse = (requestId: string, accept: boolean) => {
    setInboxRequests(
      inboxRequests.map((req) =>
        req.id === requestId ? { ...req, status: accept ? 'accepted' : 'rejected' } : req
      )
    );
  };

  // Create group
  const handleCreateGroup = () => {
    if (!newGroupName || !selectedHouse || groupMembers.length === 0) {
      alert('⚠️ Please fill all fields and select members');
      return;
    }
    const newGroup: BookingGroup = {
      id: `grp_${Date.now()}`,
      name: newGroupName,
      members: mockRoommateProfiles.filter((p) => groupMembers.includes(p.id)),
      house: mockBoardingHouses.find((h) => h.id === selectedHouse)?.name || '',
      createdDate: new Date().toISOString().split('T')[0],
      status: 'forming',
    };
    setBookingGroups([...bookingGroups, newGroup]);
    setNewGroupName('');
    setSelectedHouse('');
    setGroupMembers([]);
    alert('✅ Group created successfully!');
  };

  const currentProfile = mockRoommateProfiles[currentProfileIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">Roommate Finder</h1>
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
              ←
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { id: 'profile', label: '👤 Profile', icon: '👤' },
              { id: 'browse', label: '🔍 Browse', icon: '🔍' },
              { id: 'sent', label: '📤 Sent', icon: '📤' },
              { id: 'inbox', label: `📥 Inbox (${inboxRequests.filter((r) => r.status === 'pending').length})`, icon: '📥' },
              { id: 'groups', label: '👥 Groups', icon: '👥' },
              { id: 'notifications', label: `🔔 Notifications`, icon: '🔔' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/30 border border-cyan-500 text-cyan-300'
                    : 'bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 1. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">My Roommate Profile</h2>
              <button
                onClick={() => setProfileEditing(!profileEditing)}
                className="px-4 py-2 bg-cyan-500/30 border border-cyan-500 text-cyan-300 rounded-lg hover:bg-cyan-500/50"
              >
                {profileEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="space-y-4">
              {/* Description */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">About You</label>
                {profileEditing ? (
                  <textarea
                    value={myProfile.description}
                    onChange={(e) => setMyProfile({ ...myProfile, description: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500"
                    placeholder="Describe yourself, habits, preferences..."
                    rows={4}
                  />
                ) : (
                  <p className="text-gray-300">{myProfile.description || 'No profile yet'}</p>
                )}
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Budget (Rs./month)</label>
                {profileEditing ? (
                  <input
                    type="number"
                    value={myProfile.budget}
                    onChange={(e) => setMyProfile({ ...myProfile, budget: Number(e.target.value) })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  />
                ) : (
                  <p className="text-gray-300">Rs. {myProfile.budget.toLocaleString()}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Gender</label>
                {profileEditing ? (
                  <select
                    value={myProfile.gender}
                    onChange={(e) => setMyProfile({ ...myProfile, gender: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  >
                    <option>Select</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                ) : (
                  <p className="text-gray-300">{myProfile.gender}</p>
                )}
              </div>

              {/* Preferences */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Preferences (comma separated)</label>
                {profileEditing ? (
                  <textarea
                    value={myProfile.preferences}
                    onChange={(e) => setMyProfile({ ...myProfile, preferences: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500"
                    placeholder="e.g., Early riser, non-smoker, pet friendly"
                    rows={2}
                  />
                ) : (
                  <p className="text-gray-300">{myProfile.preferences || 'Not specified'}</p>
                )}
              </div>

              {/* Current/Planned House */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Current or Planned Boarding House</label>
                {profileEditing ? (
                  <select
                    value={myProfile.boardingHouse}
                    onChange={(e) => setMyProfile({ ...myProfile, boardingHouse: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  >
                    <option value="">Select House</option>
                    {mockBoardingHouses.map((house) => (
                      <option key={house.id} value={house.name}>
                        {house.name} ({house.vacancies} vacancies)
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-300">{myProfile.boardingHouse || 'Not selected'}</p>
                )}
              </div>

              {/* Looking For */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">Looking For</label>
                {profileEditing ? (
                  <select
                    value={myProfile.lookingFor}
                    onChange={(e) => setMyProfile({ ...myProfile, lookingFor: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  >
                    <option>Single Room</option>
                    <option>Shared Room</option>
                    <option>Any</option>
                  </select>
                ) : (
                  <p className="text-gray-300">{myProfile.lookingFor}</p>
                )}
              </div>

              {profileEditing && (
                <button
                  onClick={handleProfileSave}
                  className="w-full mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                >
                  Save Profile
                </button>
              )}
            </div>
          </div>
        )}

        {/* 2. BROWSE TAB */}
        {activeTab === 'browse' && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Browse Roommates</h2>

            {currentProfile ? (
              <div className="max-w-md mx-auto">
                <div className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-2xl p-6 border border-white/10 shadow-lg">
                  {/* Profile Image */}
                  <img
                    src={currentProfile.image}
                    alt={currentProfile.name}
                    className="w-40 h-40 rounded-full mx-auto mb-4 border-4 border-cyan-400 object-cover"
                  />

                  {/* Name and Year */}
                  <h3 className="text-2xl font-bold text-center text-white mb-2">{currentProfile.name}</h3>
                  <p className="text-center text-cyan-300 mb-4">{currentProfile.academicYear}</p>

                  {/* Description */}
                  <p className="text-center text-gray-300 mb-4">{currentProfile.description}</p>

                  {/* Info Chips */}
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    <span className="bg-cyan-900/50 text-cyan-200 px-3 py-1 rounded-full text-sm">
                      Rs. {currentProfile.budget}
                    </span>
                    <span className="bg-purple-900/50 text-purple-200 px-3 py-1 rounded-full text-sm">
                      {currentProfile.gender}
                    </span>
                    <span className="bg-green-900/50 text-green-200 px-3 py-1 rounded-full text-sm">
                      {currentProfile.roomType}
                    </span>
                  </div>

                  {/* Preferences */}
                  <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-gray-400 mb-2">Preferences:</p>
                    <p className="text-sm text-gray-300">{currentProfile.preferences}</p>
                  </div>

                  {/* House Info */}
                  <div className="mb-6 p-3 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-xs text-gray-400 mb-1">Boarding House:</p>
                    <p className="text-sm text-gray-300">{currentProfile.boardingHouse}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => handleSwipe('pass')}
                      className="flex items-center gap-2 px-6 py-3 bg-red-600/30 border border-red-600 text-red-300 rounded-lg hover:bg-red-600/50 transition-all"
                    >
                      <X size={20} /> Pass
                    </button>
                    <button
                      onClick={() => {
                        handleSwipe('like');
                        handleSendRequest(currentProfile.id);
                      }}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600/30 border border-green-600 text-green-300 rounded-lg hover:bg-green-600/50 transition-all"
                    >
                      <Heart size={20} fill="currentColor" /> Like & Send Request
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No more profiles to browse</p>
              </div>
            )}
          </div>
        )}

        {/* 3. SENT REQUESTS TAB */}
        {activeTab === 'sent' && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Requests I Sent</h2>

            {sentRequests.length > 0 ? (
              <div className="space-y-4">
                {sentRequests.map((request) => (
                  <div key={request.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={request.from.image}
                        alt={request.from.name}
                        className="w-16 h-16 rounded-full border-2 border-cyan-400 object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-white">{request.from.name}</h4>
                        <p className="text-sm text-gray-300">{request.message}</p>
                        <p className="text-xs text-gray-500 mt-2">Sent: {request.date}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        request.status === 'pending'
                          ? 'bg-yellow-900/50 text-yellow-200'
                          : request.status === 'accepted'
                          ? 'bg-green-900/50 text-green-200'
                          : 'bg-red-900/50 text-red-200'
                      }`}>
                        {request.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No requests sent yet</p>
            )}
          </div>
        )}

        {/* 4. INBOX TAB */}
        {activeTab === 'inbox' && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Requests I Received</h2>

            {inboxRequests.length > 0 ? (
              <div className="space-y-4">
                {inboxRequests.map((request) => (
                  <div key={request.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <img
                          src={request.from.image}
                          alt={request.from.name}
                          className="w-16 h-16 rounded-full border-2 border-cyan-400 object-cover"
                        />
                        <div>
                          <h4 className="text-lg font-semibold text-white">{request.from.name}</h4>
                          <p className="text-sm text-gray-300">{request.from.academicYear}</p>
                          <p className="text-xs text-gray-500">Budget: Rs. {request.from.budget}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        request.status === 'pending'
                          ? 'bg-yellow-900/50 text-yellow-200'
                          : request.status === 'accepted'
                          ? 'bg-green-900/50 text-green-200'
                          : 'bg-red-900/50 text-red-200'
                      }`}>
                        {request.status.toUpperCase()}
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4">{request.message}</p>

                    {request.status === 'pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleRequestResponse(request.id, true)}
                          className="flex-1 px-4 py-2 bg-green-600/30 border border-green-600 text-green-300 rounded-lg hover:bg-green-600/50 transition-all flex items-center justify-center gap-2"
                        >
                          <Check size={18} /> Accept
                        </button>
                        <button
                          onClick={() => handleRequestResponse(request.id, false)}
                          className="flex-1 px-4 py-2 bg-red-600/30 border border-red-600 text-red-300 rounded-lg hover:bg-red-600/50 transition-all flex items-center justify-center gap-2"
                        >
                          <X size={18} /> Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No requests received yet</p>
            )}
          </div>
        )}

        {/* 5. GROUPS TAB */}
        {activeTab === 'groups' && (
          <div className="space-y-6">
            {/* Create New Group */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Create New Group</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Group Name</label>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="e.g., Malabe Squad"
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Select Boarding House</label>
                  <select
                    value={selectedHouse}
                    onChange={(e) => setSelectedHouse(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white"
                  >
                    <option value="">Choose a house...</option>
                    {mockBoardingHouses.map((house) => (
                      <option key={house.id} value={house.id}>
                        {house.name} ({house.vacancies} vacancies)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Select Members</label>
                  <div className="space-y-2">
                    {mockRoommateProfiles.map((profile) => (
                      <label key={profile.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10">
                        <input
                          type="checkbox"
                          checked={groupMembers.includes(profile.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setGroupMembers([...groupMembers, profile.id]);
                            } else {
                              setGroupMembers(groupMembers.filter((id) => id !== profile.id));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <img src={profile.image} alt={profile.name} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-white">{profile.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleCreateGroup}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} /> Create Group
                </button>
              </div>
            </div>

            {/* Existing Groups */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">My Groups</h3>

              {bookingGroups.length > 0 ? (
                <div className="space-y-4">
                  {bookingGroups.map((group) => (
                    <div key={group.id} className="bg-gradient-to-br from-cyan-900/20 to-purple-900/20 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{group.name}</h4>
                          <p className="text-sm text-gray-300">{group.house}</p>
                          <p className="text-xs text-gray-500">Created: {group.createdDate}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          group.status === 'forming'
                            ? 'bg-yellow-900/50 text-yellow-200'
                            : group.status === 'ready'
                            ? 'bg-green-900/50 text-green-200'
                            : 'bg-cyan-900/50 text-cyan-200'
                        }`}>
                          {group.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-300 mb-2">Members ({group.members.length}):</p>
                        <div className="flex gap-2">
                          {group.members.map((member) => (
                            <div key={member.id} className="flex flex-col items-center">
                              <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full border-2 border-cyan-400 object-cover" />
                              <p className="text-xs text-gray-300 mt-1">{member.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          navigate('/group-booking');
                        }}
                        className="w-full px-4 py-2 bg-cyan-600/30 border border-cyan-600 text-cyan-300 rounded-lg hover:bg-cyan-600/50 transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowRight size={18} /> Go to Group Booking
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No groups yet</p>
              )}
            </div>
          </div>
        )}

        {/* 6. NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Notifications</h2>

            <div className="space-y-3">
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4 flex items-start gap-3">
                <Bell className="text-green-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-green-300 font-semibold">Request Accepted</p>
                  <p className="text-sm text-gray-300">Sarah accepted your roommate request</p>
                  <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 flex items-start gap-3">
                <Bell className="text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-blue-300 font-semibold">New Request</p>
                  <p className="text-sm text-gray-300">John sent you a roommate request</p>
                  <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
                </div>
              </div>

              <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4 flex items-start gap-3">
                <Bell className="text-purple-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-purple-300 font-semibold">Group Invitation</p>
                  <p className="text-sm text-gray-300">You were invited to join "Malabe Squad"</p>
                  <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 flex items-start gap-3">
                <Bell className="text-yellow-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-yellow-300 font-semibold">Booking Reminder</p>
                  <p className="text-sm text-gray-300">Your group booking is pending owner approval</p>
                  <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
