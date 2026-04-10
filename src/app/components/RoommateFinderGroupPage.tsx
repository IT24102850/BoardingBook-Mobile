import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Plus, ArrowLeft, Download, LogIn } from "lucide-react";

interface RoommateProfile {
  id: string;
  name: string;
  email: string;
  budget: number;
  academicYear: string;
  gender: string;
  image: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const sampleGroups = [
  {
    id: 'sample1',
    name: 'SLIIT Friends 2026',
    members: [
      {
        id: "1",
        name: "You (Group Creator)",
        email: "your@email.com",
        budget: 18000,
        academicYear: "3rd Year",
        gender: "Male",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        status: "accepted" as const
      },
      {
        id: "2",
        name: "Ayesha Perera",
        email: "ayesha.perera@email.com",
        budget: 18000,
        academicYear: "3rd Year",
        gender: "Female",
        image: "https://randomuser.me/api/portraits/women/45.jpg",
        status: "accepted" as const
      },
      {
        id: "3",
        name: "Nuwan Silva",
        email: "nuwan.silva@email.com",
        budget: 18000,
        academicYear: "2nd Year",
        gender: "Male",
        image: "https://randomuser.me/api/portraits/men/52.jpg",
        status: "accepted" as const
      },
      {
        id: "4",
        name: "Sithara Fernando",
        email: "sithara.fernando@email.com",
        budget: 18000,
        academicYear: "3rd Year",
        gender: "Female",
        image: "https://randomuser.me/api/portraits/women/33.jpg",
        status: "pending" as const
      }
    ]
  },
  {
    id: 'sample2',
    name: 'Campus Mates',
    members: [
      {
        id: "1",
        name: "You (Group Creator)",
        email: "your@email.com",
        budget: 18000,
        academicYear: "3rd Year",
        gender: "Male",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        status: "accepted" as const
      },
      {
        id: "2",
        name: "Kasun Perera",
        email: "kasun.perera@email.com",
        budget: 18000,
        academicYear: "3rd Year",
        gender: "Male",
        image: "https://randomuser.me/api/portraits/men/61.jpg",
        status: "accepted" as const
      }
    ]
  }
];

// Sample existing rooms/vacancies to join
const sampleExistingRooms = [
  {
    id: 'room1',
    name: 'Malabe Comfort Stay',
    location: 'Malabe, Colombo',
    price: 8500,
    vacancy: 1,
    totalSpots: 4,
    occupants: [
      { id: '1', name: 'Ruwan Silva', image: 'https://randomuser.me/api/portraits/men/10.jpg' },
      { id: '2', name: 'Gevindu Perera', image: 'https://randomuser.me/api/portraits/men/20.jpg' },
      { id: '3', name: 'Kasun Fernando', image: 'https://randomuser.me/api/portraits/men/30.jpg' }
    ],
    facilities: ['WiFi', 'AC', 'Bathroom']
  },
  {
    id: 'room2',
    name: 'Nugegoda Student Inn',
    location: 'Nugegoda, Colombo',
    price: 6500,
    vacancy: 3,
    totalSpots: 5,
    occupants: [
      { id: '1', name: 'Chaminda Perera', image: 'https://randomuser.me/api/portraits/men/15.jpg' },
      { id: '2', name: 'Anura Silva', image: 'https://randomuser.me/api/portraits/men/25.jpg' }
    ],
    facilities: ['WiFi', 'Meals', 'Security']
  },
  {
    id: 'room3',
    name: 'Malabe Premium Annex',
    location: 'Malabe, Colombo',
    price: 18000,
    vacancy: 2,
    totalSpots: 6,
    occupants: [
      { id: '1', name: 'Indika Jayasuriya', image: 'https://randomuser.me/api/portraits/men/40.jpg' }
    ],
    facilities: ['WiFi', 'AC', 'Parking', 'Laundry']
  }
];

export default function RoommateFinderGroupPage() {
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<'new-place' | 'join-existing'>('new-place');
  const [groupName, setGroupName] = useState("SLIIT Friends 2026");
  const [members, setMembers] = useState<RoommateProfile[]>(sampleGroups[0].members);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<typeof sampleExistingRooms[0] | null>(null);

  const handleAddMember = () => {
    if (newMemberName && newMemberEmail) {
      const newMember: RoommateProfile = {
        id: Date.now().toString(),
        name: newMemberName,
        email: newMemberEmail,
        budget: 18000,
        academicYear: "TBD",
        gender: "TBD",
        image: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70)}.jpg`,
        status: "pending"
      };
      setMembers([...members, newMember]);
      setNewMemberName("");
      setNewMemberEmail("");
    }
  };

  const handleRemoveMember = (id: string) => {
    if (id !== "1") {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = sampleGroups.find(s => s.id === sampleId);
    if (sample) {
      setGroupName(sample.name);
      setMembers(sample.members);
      setShowSampleModal(false);
    }
  };

  const acceptedCount = members.filter(m => m.status === "accepted").length;
  const totalExpense = acceptedCount > 0 ? Math.round(18000 * acceptedCount / members.length) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1124] via-[#131d3a] to-[#0b132b]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-[#0a1124] to-[#131d3a] border-b border-white/10 p-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-cyan-400 hover:text-cyan-300"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white flex-1">Roommate Finder</h1>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Scenario Selector */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-6 border border-cyan-500/30">
          <h3 className="text-white font-bold text-lg mb-4">Choose Your Option</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Form Group for New Place */}
            <button
              onClick={() => setScenario('new-place')}
              className={`p-4 rounded-lg border-2 transition text-left ${
                scenario === 'new-place'
                  ? 'bg-cyan-500/20 border-cyan-500 shadow-lg shadow-cyan-500/30'
                  : 'bg-white/5 border-white/10 hover:border-cyan-400/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <Plus size={24} className="text-cyan-400" />
                <h4 className="text-white font-bold text-lg">Form Group for New Place</h4>
              </div>
              <p className="text-gray-400 text-sm">Create a new group and search for boarding together</p>
            </button>

            {/* Join Existing Room */}
            <button
              onClick={() => setScenario('join-existing')}
              className={`p-4 rounded-lg border-2 transition text-left ${
                scenario === 'join-existing'
                  ? 'bg-purple-500/20 border-purple-500 shadow-lg shadow-purple-500/30'
                  : 'bg-white/5 border-white/10 hover:border-purple-400/50'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <LogIn size={24} className="text-purple-400" />
                <h4 className="text-white font-bold text-lg">Join Existing Room</h4>
              </div>
              <p className="text-gray-400 text-sm">Browse & join rooms with available vacancies</p>
            </button>
          </div>
        </div>

        {/* SCENARIO 1: Form Group for New Place */}
        {scenario === 'new-place' && (
          <>
        {/* Group Info */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <label className="block text-white font-bold text-sm mb-3">Group Name</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 text-lg font-semibold"
          />
        </div>

        {/* Add Members Form */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Plus size={24} />
            Add Group Members
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Member Name"
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Email Address"
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleAddMember}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Add Member
            </button>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white/5 rounded-lg p-6 border border-white/10">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Users size={24} />
            Members ({acceptedCount}/{members.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className={`rounded-lg p-4 border-2 ${
                  member.status === "accepted"
                    ? "bg-green-500/10 border-green-500/30"
                    : member.status === "pending"
                    ? "bg-yellow-500/10 border-yellow-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-white font-semibold">{member.name}</h4>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        member.status === "accepted"
                          ? "bg-green-500/30 text-green-300"
                          : member.status === "pending"
                          ? "bg-yellow-500/30 text-yellow-300"
                          : "bg-red-500/30 text-red-300"
                      }`}>
                        {member.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">{member.email}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Budget: Rs. {member.budget.toLocaleString()}
                    </p>
                  </div>
                  {member.id !== "1" && (
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-400 hover:text-red-300 font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-6 border border-cyan-500/30">
          <h3 className="text-white font-bold text-lg mb-4">Group Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Group Size</p>
              <p className="text-white font-bold text-2xl">{members.length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Confirmed Members</p>
              <p className="text-green-400 font-bold text-2xl">{acceptedCount}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Monthly Cost</p>
              <p className="text-cyan-400 font-bold text-xl">Rs. {(18000 * members.length).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Per Person</p>
              <p className="text-cyan-400 font-bold text-xl">Rs. {totalExpense.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition border border-white/20"
          >
            Back
          </button>
          <button
            onClick={() => setShowSampleModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Load Sample
          </button>
          <button
            onClick={() => navigate('/chat', { state: { groupChat: { name: groupName, members: members }, chatType: 'group' } })}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            💬 Group Chat
          </button>
          <button
            onClick={() => navigate('/boarding-detail/1', { state: { members } })}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            Continue to Booking
          </button>
        </div>
          </>
        )}

        {/* SCENARIO 2: Join Existing Room */}
        {scenario === 'join-existing' && (
          <>
            {/* Available Rooms */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                🏠 Available Rooms with Vacancies
              </h3>
              <div className="space-y-4">
                {sampleExistingRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(selectedRoom?.id === room.id ? null : room)}
                    className={`w-full text-left p-5 rounded-lg border-2 transition ${
                      selectedRoom?.id === room.id
                        ? 'bg-purple-500/20 border-purple-500'
                        : 'bg-white/5 border-white/10 hover:border-purple-400/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg">{room.name}</h4>
                        <p className="text-gray-400 text-sm">📍 {room.location}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-cyan-400 font-bold text-xl">Rs. {room.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">/month</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3 flex-wrap">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          room.vacancy > 0
                            ? 'bg-green-500/30 text-green-300'
                            : 'bg-red-500/30 text-red-300'
                        }`}
                      >
                        {room.vacancy > 0 ? `✅ ${room.vacancy} Spot${room.vacancy > 1 ? 's' : ''} Available` : '❌ Full'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {room.occupants.length}/{room.totalSpots} Occupied
                      </span>
                    </div>

                    {/* Facilities */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {room.facilities.map((fac) => (
                        <span key={fac} className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded-full">
                          {fac}
                        </span>
                      ))}
                    </div>

                    {/* Current Occupants */}
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-xs">Current occupants:</span>
                      <div className="flex -space-x-2">
                        {room.occupants.map((occ) => (
                          <img
                            key={occ.id}
                            src={occ.image}
                            alt={occ.name}
                            title={occ.name}
                            className="w-6 h-6 rounded-full border border-white/20 object-cover"
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Room Join Form */}
            {selectedRoom && (
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-6 border border-purple-500/30">
                <h3 className="text-white font-bold text-lg mb-4">Join {selectedRoom.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Full Name *</label>
                    <input
                      type="text"
                      placeholder="Your full name"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Email Address *</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Budget</label>
                    <input
                      type="number"
                      defaultValue={selectedRoom.price}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Academic Year</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-400">
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-400 text-sm mb-2">Message to Room Owner</label>
                  <textarea
                    placeholder="Tell them about yourself..."
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setSelectedRoom(null)}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition border border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => navigate('/chat', { 
                      state: { 
                        selectedRoom: selectedRoom, 
                        chatType: 'boarding-owner',
                        boardingName: selectedRoom.name
                      } 
                    })}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    💬 Message Owner
                  </button>
                  <button
                    onClick={() => alert('Join request sent! Owner will review your application.')}
                    className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition"
                  >
                    Send Join Request
                  </button>
                </div>
              </div>
            )}

            {/* Back Button */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition border border-white/20"
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>

      {/* Sample Modal - Only for new-place scenario */}
      {showSampleModal && scenario === 'new-place' && (
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
