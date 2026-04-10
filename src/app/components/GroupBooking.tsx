import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Users, Plus, Trash2, Check, X, Mail, Copy, Share2, ArrowLeft
} from 'lucide-react';

interface GroupMember {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const sampleGroups = [
  {
    id: 'sample1',
    name: 'SLIIT Friends 2026',
    members: [
      { id: '1', name: 'You (Group Creator)', email: 'your@email.com', status: 'accepted' as const },
      { id: '2', name: 'Ayesha Perera', email: 'ayesha.perera@email.com', status: 'accepted' as const },
      { id: '3', name: 'Nuwan Silva', email: 'nuwan.silva@email.com', status: 'accepted' as const },
      { id: '4', name: 'Sithara Fernando', email: 'sithara.fernando@email.com', status: 'pending' as const }
    ]
  },
  {
    id: 'sample2',
    name: 'Campus mates',
    members: [
      { id: '1', name: 'You (Group Creator)', email: 'your@email.com', status: 'accepted' as const },
      { id: '2', name: 'Kasun Perera', email: 'kasun.perera@email.com', status: 'accepted' as const }
    ]
  }
];

export default function GroupBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const boarding = location.state?.boarding;
  const [groupName, setGroupName] = useState('SLIIT Friends 2026');
  const [members, setMembers] = useState<GroupMember[]>(sampleGroups[0].members);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [shareLink] = useState(`https://boarding.app/join-group/${Math.random().toString(36).substr(2, 9)}`);
  const [showSampleModal, setShowSampleModal] = useState(false);

  const handleAddMember = () => {
    if (inviteEmail && inviteName) {
      const newMember: GroupMember = {
        id: Date.now().toString(),
        name: inviteName,
        email: inviteEmail,
        status: 'pending'
      };
      setMembers([...members, newMember]);
      setInviteEmail('');
      setInviteName('');
    }
  };

  const handleRemoveMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = sampleGroups.find(s => s.id === sampleId);
    if (sample) {
      setGroupName(sample.name);
      setMembers(sample.members);
      setShowSampleModal(false);
    }
  };

  const handleProceedToBooking = () => {
    navigate('/booking-agreement', {
      state: {
        booking: {
          boarding,
          type: 'group',
          groupName,
          members,
          bookingDate: new Date().toISOString()
        }
      }
    });
  };

  const acceptedCount = members.filter(m => m.status === 'accepted').length;

  if (!boarding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Please select a boarding first</p>
          <button onClick={() => navigate(-1)} className="text-cyan-400 hover:underline">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-[#0a1124] to-[#131d3a] border-b border-white/10 p-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        <h1 className="text-lg font-bold text-white">Create Booking Group</h1>
        <div className="w-8" />
      </div>

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Selected Boarding */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <div className="text-gray-400 text-sm mb-2">Selected Boarding</div>
          <div className="text-white font-bold text-lg">{boarding.name}</div>
          <div className="text-cyan-400 text-sm mt-1">Rs. {boarding.price.toLocaleString()} per month</div>
        </div>

        {/* Group Name */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
          <label className="block text-white font-bold text-sm mb-2">Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            placeholder="e.g., SLIIT Friends 2026"
          />
        </div>

        {/* Add Members Section */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Users size={24} />
            Add Group Members ({acceptedCount}/{members.length})
          </h3>

          {/* Member Input */}
          <div className="space-y-3 mb-6">
            <div>
              <label className="block text-gray-300 text-sm mb-1">Member Name</label>
              <input
                type="text"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                placeholder="Enter member name"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-1">Email Address</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                placeholder="member@email.com"
              />
            </div>
            <button
              onClick={handleAddMember}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Member
            </button>
          </div>

          {/* Members List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {members.map((member) => (
              <div
                key={member.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  member.status === 'accepted'
                    ? 'bg-green-500/10 border-green-500/30'
                    : member.status === 'pending'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex-1">
                  <div className="text-white font-semibold">{member.name}</div>
                  <div className="text-gray-400 text-sm">{member.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      member.status === 'accepted'
                        ? 'bg-green-500/30 text-green-300'
                        : member.status === 'pending'
                        ? 'bg-yellow-500/30 text-yellow-300'
                        : 'bg-red-500/30 text-red-300'
                    }`}
                  >
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                  {member.id !== '1' && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share Group Link */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Share2 size={24} />
            Share Group Link
          </h3>
          <div className="bg-white/10 border border-white/20 rounded-lg p-3 flex items-center justify-between">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="bg-transparent text-cyan-400 text-sm flex-1 outline-none truncate"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(shareLink);
                alert('Link copied to clipboard!');
              }}
              className="text-cyan-400 hover:text-cyan-300 ml-2"
            >
              <Copy size={20} />
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            Share this link with roommates to join the group instantly
          </p>
        </div>

        {/* Group Summary */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-6 border border-cyan-500/30">
          <h3 className="text-white font-bold text-lg mb-4">Group Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Group Name:</span>
              <span className="text-white font-semibold">{groupName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Total Members:</span>
              <span className="text-white font-semibold">{members.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Accepted:</span>
              <span className="text-green-400 font-semibold">{acceptedCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Monthly Cost:</span>
              <span className="text-cyan-400 font-bold text-lg">
                Rs. {(boarding.price * members.length).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Per Person:</span>
              <span className="text-cyan-400 font-semibold">
                Rs. {Math.round(boarding.price / members.length).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition border border-white/20"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowSampleModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            Load Sample
          </button>
          <button
            onClick={() => navigate('/chat', { state: { groupChatContext: { members: members, groupName: groupName, boarding: boarding }, chatType: 'group-booking' } })}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            💬 Group Chat
          </button>
          <button
            onClick={handleProceedToBooking}
            disabled={acceptedCount < 1}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-gray-500 disabled:to-gray-500 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Proceed
          </button>
        </div>
      </div>

      {/* Sample Modal */}
      {showSampleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b] rounded-lg p-6 max-w-md w-full border border-white/10">
            <h2 className="text-white font-bold text-lg mb-4">Load Sample Group</h2>
            <div className="space-y-3 mb-6">
              {sampleGroups.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleLoadSample(sample.id)}
                  className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400 rounded-lg p-4 transition"
                >
                  <h3 className="text-white font-bold mb-1">{sample.name}</h3>
                  <p className="text-gray-400 text-sm">{sample.members.length} members</p>
                  <div className="text-xs text-gray-500 mt-2 space-y-1">
                    {sample.members.slice(0, 3).map(m => (
                      <div key={m.id}>{m.name}</div>
                    ))}
                    {sample.members.length > 3 && <div>+{sample.members.length - 3} more</div>}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSampleModal(false)}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg border border-white/20"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
