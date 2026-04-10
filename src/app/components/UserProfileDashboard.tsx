import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPen,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaSpinner,
  FaSignOutAlt,
} from "react-icons/fa";
import StudentPayment from "./payment/StudentPayment";

const API_BASE_URL = (((import.meta as any).env?.VITE_API_URL as string) || "").replace(/\/$/, "");

type Section = "Profile" | "Payments";

type ProfileForm = {
  fullName: string;
  email: string;
  profilePicture: string;
  profilePictures: string[];
  mobileNumber: string;
  bio: string;
  age: string;
  academicYear: string;
  roommatePreference: string;
  roomType: string;
};

const initialProfile: ProfileForm = {
  fullName: "",
  email: "",
  profilePicture: "https://randomuser.me/api/portraits/lego/1.jpg",
  profilePictures: [],
  mobileNumber: "",
  bio: "",
  age: "",
  academicYear: "",
  roommatePreference: "",
  roomType: "",
};

export default function UserProfileDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>("Profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState<ProfileForm>(initialProfile);

  const firstName = useMemo(() => {
    const trimmed = profile.fullName.trim();
    if (!trimmed) return "Student";
    return trimmed.split(" ")[0];
  }, [profile.fullName]);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("bb_access_token");
        if (!token) {
          setError("Please sign in to access profile settings.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (!response.ok || !result?.success || !result?.data) {
          throw new Error(result?.message || "Failed to load profile");
        }

        const user = result.data;
        if (cancelled) return;

        setProfile({
          fullName: user.fullName || "",
          email: user.email || "",
          profilePicture: user.profilePicture || initialProfile.profilePicture,
          profilePictures: Array.isArray(user.profilePictures) ? user.profilePictures : [],
          mobileNumber: user.mobileNumber || "",
          bio: user.bio || "",
          age: user.age ? String(user.age) : "",
          academicYear: user.academicYear || "",
          roommatePreference: user.roommatePreference || "",
          roomType: user.roomType || "",
        });
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load profile");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = String(event.target?.result || "");
      if (!imageData) return;
      setProfile((prev) => ({ ...prev, profilePicture: imageData }));
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const readPromises = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(String(event.target?.result || ""));
          reader.onerror = () => reject(new Error("Failed to read image"));
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readPromises)
      .then((images) => {
        const validImages = images.filter((img) => img.length > 0);
        if (validImages.length === 0) return;
        setProfile((prev) => ({ ...prev, profilePictures: [...prev.profilePictures, ...validImages] }));
      })
      .catch(() => {
        setError("Failed to add one or more images.");
      })
      .finally(() => {
        e.target.value = "";
      });
  };

  const removeGalleryImage = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      profilePictures: prev.profilePictures.filter((_, idx) => idx !== index),
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("bb_access_token");
      if (!token) {
        throw new Error("Session expired. Please sign in again.");
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: profile.fullName,
          mobileNumber: profile.mobileNumber,
          profilePicture: profile.profilePicture,
          profilePictures: profile.profilePictures,
          bio: profile.bio,
          age: profile.age ? Number(profile.age) : undefined,
          academicYear: profile.academicYear,
          roommatePreference: profile.roommatePreference,
          roomType: profile.roomType,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result?.success) {
        throw new Error(result?.message || "Failed to save profile");
      }

      const currentRaw = localStorage.getItem("bb_current_user");
      if (currentRaw) {
        try {
          const cached = JSON.parse(currentRaw);
          localStorage.setItem(
            "bb_current_user",
            JSON.stringify({
              ...cached,
              email: profile.email,
              fullName: profile.fullName,
              profilePicture: profile.profilePicture,
              profileCompleted: Boolean(result?.data?.profileCompleted),
            })
          );
        } catch {
          // Ignore cache update failures.
        }
      }

      setSuccess("Profile saved successfully.");
      setEditing(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bb_access_token");
    localStorage.removeItem("bb_current_user");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071126] via-[#0d1f3a] to-[#13314f] text-white">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        <div className="rounded-3xl border border-cyan-400/20 bg-[#0f223f]/70 backdrop-blur-xl shadow-2xl shadow-cyan-900/20 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-cyan-300/15 bg-gradient-to-r from-[#12385d] via-[#135076] to-[#14709a]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, {firstName}</h1>
                <p className="text-cyan-100/90 text-sm md:text-base">Profile settings synced with your database account</p>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={profile.profilePicture || initialProfile.profilePicture}
                  alt="Profile"
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-200/50"
                />
                <div className="text-sm">
                  <div className="font-semibold">{profile.fullName || "Student"}</div>
                  <div className="text-cyan-100/80 flex items-center gap-2"><FaEnvelope /> {profile.email || "No email"}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-6 flex flex-wrap items-center gap-3 border-b border-cyan-300/10 bg-[#0c1c36]">
            <button
              onClick={() => setActiveSection("Profile")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeSection === "Profile" ? "bg-cyan-500/30 border border-cyan-300/50" : "bg-white/5 border border-white/10"
              }`}
            >
              <FaUser className="inline mr-2" /> Profile
            </button>
            <button
              onClick={() => setActiveSection("Payments")}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                activeSection === "Payments" ? "bg-cyan-500/30 border border-cyan-300/50" : "bg-white/5 border border-white/10"
              }`}
            >
              Payments
            </button>
            <button
              onClick={handleLogout}
              className="md:ml-auto px-4 py-2 rounded-xl text-sm font-semibold transition bg-red-500/15 border border-red-400/30 hover:bg-red-500/25 text-red-100"
            >
              <FaSignOutAlt className="inline mr-2" /> Logout
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeSection === "Payments" ? (
              <StudentPayment />
            ) : loading ? (
              <div className="flex items-center justify-center py-20 text-cyan-200">
                <FaSpinner className="animate-spin mr-3" /> Loading profile...
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold">Student Profile</h2>
                  <div className="flex gap-2">
                    {editing ? (
                      <>
                        <button
                          onClick={() => setEditing(false)}
                          className="px-4 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition"
                        >
                          <FaTimes className="inline mr-2" /> Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={saving}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-semibold disabled:opacity-60"
                        >
                          {saving ? <><FaSpinner className="inline mr-2 animate-spin" /> Saving</> : <><FaSave className="inline mr-2" /> Save</>}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditing(true)}
                        className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-300/40 hover:bg-cyan-500/30 transition"
                      >
                        <FaPen className="inline mr-2" /> Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {error && <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-400/40 text-red-100">{error}</div>}
                {success && <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-100"><FaCheckCircle className="inline mr-2" />{success}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-cyan-100 mb-1">Full Name</label>
                    <input
                      name="fullName"
                      value={profile.fullName}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl bg-[#132a4b] border border-cyan-500/20 px-3 py-2 text-cyan-50 disabled:opacity-70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cyan-100 mb-1">Phone Number</label>
                    <input
                      name="mobileNumber"
                      value={profile.mobileNumber}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="e.g., +94771234567"
                      className="w-full rounded-xl bg-[#132a4b] border border-cyan-500/20 px-3 py-2 text-cyan-50 disabled:opacity-70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cyan-100 mb-1">Age</label>
                    <input
                      name="age"
                      type="number"
                      min="16"
                      value={profile.age}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="Enter your age"
                      className="w-full rounded-xl bg-[#132a4b] border border-cyan-500/20 px-3 py-2 text-cyan-50 disabled:opacity-70"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-cyan-100 mb-1">Academic Year</label>
                    <select
                      name="academicYear"
                      value={profile.academicYear}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full rounded-xl bg-[#132a4b] border border-cyan-500/20 px-3 py-2 text-cyan-50"
                    >
                      <option value="">Select</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-cyan-100 mb-1">Room Type</label>
                    <select
                      name="roomType"
                      value={profile.roomType}
                      onChange={handleChange}
                      disabled={!editing}
                      className="w-full rounded-xl bg-[#132a4b] border border-cyan-500/20 px-3 py-2 text-cyan-50"
                    >
                      <option value="">Select</option>
                      <option value="Single Room">Single Room</option>
                      <option value="Shared Room">Shared Room</option>
                      <option value="Studio/Annex">Studio/Annex</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-cyan-100 mb-1">Other Interests</label>
                    <input
                      name="roommatePreference"
                      value={profile.roommatePreference}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="e.g., Reading, gym, movies"
                      className="w-full rounded-xl bg-[#132a4b] border border-cyan-500/20 px-3 py-2 text-cyan-50"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-cyan-100 mb-2">Change Profile Picture</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <img
                        src={profile.profilePicture || initialProfile.profilePicture}
                        alt="Profile preview"
                        className="w-20 h-20 rounded-xl object-cover border border-cyan-400/40"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        disabled={!editing}
                        onChange={handleProfilePictureChange}
                        className="w-full rounded-xl bg-[#132a4b] border border-cyan-500/20 px-3 py-2 text-cyan-50 file:mr-3 file:rounded-lg file:border-0 file:bg-cyan-500/30 file:px-3 file:py-1.5 file:text-cyan-50"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-cyan-100 mb-2">Add More Images (Telegram style)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={!editing}
                      onChange={handleGalleryUpload}
                      className="w-full rounded-xl bg-[#132a4b] border border-cyan-500/20 px-3 py-2 text-cyan-50 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-500/30 file:px-3 file:py-1.5 file:text-cyan-50"
                    />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-3">
                      {profile.profilePictures.map((img, idx) => (
                        <div key={`${idx}-${img.slice(0, 12)}`} className="relative group">
                          <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-24 rounded-lg object-cover border border-cyan-500/20" />
                          {editing && (
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(idx)}
                              className="absolute top-1 right-1 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white opacity-0 group-hover:opacity-100 transition"
                            >
                              x
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-cyan-400/70 mt-2">{profile.profilePictures.length} image(s) added</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-cyan-100 mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      disabled={!editing}
                      rows={4}
                      placeholder="Tell others about yourself..."
                      className="w-full rounded-xl bg-[#132a4b] border border-cyan-500/20 px-3 py-2 text-cyan-50"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
