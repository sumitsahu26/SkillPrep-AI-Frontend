"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Camera,
  GitBranch,
  Globe,
//   Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  Save,
  User,
  X,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AuthGuard from "../components/AuthGuard";

import {
  getProfile,
  updateProfile,
  addProfileSkill,
  removeProfileSkill,
} from "../../services/profileApi";

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  bio: string;
  currentRole: string;
  experience: number;
  skills: string[];
  github: string;
  linkedin: string;
  portfolio: string;
}

const initialProfile: ProfileForm = {
  name: "",
  email: "",
  phone: "",
  location: "",
  headline: "",
  bio: "",
  currentRole: "",
  experience: 0,
  skills: [],
  github: "",
  linkedin: "",
  portfolio: "",
};

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [profile, setProfile] =
    useState<ProfileForm>(
      initialProfile
    );

  const [skillInput, setSkillInput] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /* =============================================
     LOAD PROFILE
  ============================================= */

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const response =
          await getProfile();

        const data =
          response.profile;

        setProfile({
          name:
            data?.userId?.name ||
            "",

          email:
            data?.userId?.email ||
            "",

          phone:
            data?.phone || "",

          location:
            data?.location || "",

          headline:
            data?.headline || "",

          bio:
            data?.bio || "",

          currentRole:
            data?.currentRole || "",

          experience:
            data?.experience || 0,

          skills:
            data?.skills || [],

          github:
            data?.github || "",

          linkedin:
            data?.linkedin || "",

          portfolio:
            data?.portfolio || "",
        });
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /* =============================================
     INPUT
  ============================================= */

  const handleChange = (
    field: keyof ProfileForm,
    value: string | number
  ) => {
    setProfile((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =============================================
     SKILLS
  ============================================= */

  const addSkill = async() => {
    const skill =
      skillInput.trim();

    if (!skill) {
      return;
    }

    const exists =
      profile.skills.some(
        (item) =>
          item.toLowerCase() ===
          skill.toLowerCase()
      );

    if (exists) {
      setSkillInput("");
      return;
    }
    try {
        setError("");
    
        const response = await addProfileSkill(skill);
    
        setProfile((previous) => ({
          ...previous,
          skills:
            response.profile.skills ||
            [...previous.skills, skill],
        }));
    
        setSkillInput("");
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to add skill"
        );
      }
  };

  const removeSkill = async (skill: string) => {
    try {
      setError("");
  
      const response = await removeProfileSkill(skill);
  
      setProfile((previous) => ({
        ...previous,
        skills:
          response.profile.skills ??
          previous.skills.filter(
            (item) => item !== skill
          ),
      }));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to remove skill"
      );
    }
  };

  /* =============================================
     SAVE
  ============================================= */

  const handleSave =
    async () => {
      try {
        setSaving(true);

        setError("");
        setMessage("");

        await updateProfile({
          phone:
            profile.phone,

          location:
            profile.location,

          headline:
            profile.headline,

          bio:
            profile.bio,

          currentRole:
            profile.currentRole,

          experience:
            Number(
              profile.experience
            ),

          skills:
            profile.skills,

          github:
            profile.github,

          linkedin:
            profile.linkedin,

          portfolio:
            profile.portfolio,
        });

        setMessage(
          "Profile updated successfully."
        );
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to update profile"
        );
      } finally {
        setSaving(false);
      }
    };

  /* =============================================
     LOADING
  ============================================= */

  if (loading) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen items-center justify-center bg-[#08090d]">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#08090d] text-zinc-100">
        <Sidebar
          open={sidebarOpen}
          onClose={() =>
            setSidebarOpen(false)
          }
        />

        <div className="min-h-screen lg:pl-64">
          <Topbar
            onMenuClick={() =>
              setSidebarOpen(true)
            }
          />

          <main className="mx-auto max-w-6xl p-4 sm:p-7 lg:p-9">

            {/* HEADER */}

            <div>
              <p className="text-sm font-medium text-violet-400">
                Account
              </p>

              <h1 className="mt-2 text-3xl font-bold">
                My Profile
              </h1>

              <p className="mt-2 text-sm text-zinc-500">
                Manage your personal and professional information.
              </p>
            </div>

            {/* MESSAGE */}

            {message && (
              <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.05] p-4 text-sm text-emerald-300">
                {message}
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/[0.05] p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">

              {/* LEFT PROFILE */}

              <div>
                <div className="rounded-2xl border border-white/[0.08] bg-[#101117] p-6 text-center">

                  <div className="relative mx-auto w-fit">
                    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-3xl font-bold">
                      {getInitials(
                        profile.name
                      )}
                    </div>

                    <button
                      type="button"
                      className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#181920]"
                    >
                      <Camera
                        size={14}
                      />
                    </button>
                  </div>

                  <h2 className="mt-5 font-semibold">
                    {profile.name ||
                      "My Profile"}
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    {profile.currentRole ||
                      "Developer"}
                  </p>

                  {profile.location && (
                    <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-500">
                      <MapPin
                        size={13}
                      />

                      {
                        profile.location
                      }
                    </div>
                  )}
                </div>

                {/* PROFILE COMPLETION */}

                <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#101117] p-5">
                  <p className="text-sm font-semibold">
                    Profile completion
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-zinc-500">
                      Progress
                    </span>

                    <span className="text-violet-300">
                      {calculateCompletion(
                        profile
                      )}
                      %
                    </span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all"
                      style={{
                        width: `${calculateCompletion(
                          profile
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT */}

              <div className="space-y-6">

                {/* BASIC INFORMATION */}

                <Section
                  title="Basic Information"
                  description="Your account and contact information."
                >
                  <div className="grid gap-5 sm:grid-cols-2">

                    <Input
                      label="Full Name"
                      icon={User}
                      value={
                        profile.name
                      }
                      disabled
                    />

                    <Input
                      label="Email"
                      icon={Mail}
                      value={
                        profile.email
                      }
                      disabled
                    />

                    <Input
                      label="Phone"
                      icon={Phone}
                      value={
                        profile.phone
                      }
                      onChange={(value) =>
                        handleChange(
                          "phone",
                          value
                        )
                      }
                    />

                    <Input
                      label="Location"
                      icon={MapPin}
                      value={
                        profile.location
                      }
                      placeholder="Bhopal, India"
                      onChange={(value) =>
                        handleChange(
                          "location",
                          value
                        )
                      }
                    />
                  </div>
                </Section>

                {/* PROFESSIONAL */}

                <Section
                  title="Professional Information"
                  description="Tell SkillPrep about your career."
                >
                  <div className="grid gap-5 sm:grid-cols-2">

                    <Input
                      label="Current Role"
                      value={
                        profile.currentRole
                      }
                      placeholder="Full Stack Developer"
                      onChange={(value) =>
                        handleChange(
                          "currentRole",
                          value
                        )
                      }
                    />

                    <Input
                      label="Experience"
                      type="number"
                      value={String(
                        profile.experience
                      )}
                      placeholder="4.8"
                      onChange={(value) =>
                        handleChange(
                          "experience",
                          Number(value)
                        )
                      }
                    />

                    <div className="sm:col-span-2">
                      <Input
                        label="Professional Headline"
                        value={
                          profile.headline
                        }
                        placeholder="MERN Stack Developer | Node.js | React | MongoDB"
                        onChange={(value) =>
                          handleChange(
                            "headline",
                            value
                          )
                        }
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm text-zinc-400">
                        Bio
                      </label>

                      <textarea
                        value={
                          profile.bio
                        }
                        onChange={(e) =>
                          handleChange(
                            "bio",
                            e.target.value
                          )
                        }
                        rows={5}
                        placeholder="Tell us about your experience and career goals..."
                        className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50"
                      />
                    </div>
                  </div>
                </Section>

                {/* SKILLS */}

                <Section
                  title="Skills"
                  description="Add your technical skills."
                >
                  <div className="flex gap-2">
                    <input
                      value={
                        skillInput
                      }
                      onChange={(e) =>
                        setSkillInput(
                          e.target.value
                        )
                      }
                      onKeyDown={(e) => {
                        if (
                          e.key ===
                          "Enter"
                        ) {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="Node.js"
                      className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm outline-none focus:border-violet-500/50"
                    />

                    <button
                      type="button"
                      onClick={
                        addSkill
                      }
                      className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-medium"
                    >
                      <Plus
                        size={16}
                      />

                      Add
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.skills.map(
                      (skill) => (
                        <div
                          key={
                            skill
                          }
                          className="flex items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/[0.07] px-3 py-2 text-xs text-violet-200"
                        >
                          {skill}

                          <button
                            type="button"
                            onClick={() =>
                              removeSkill(
                                skill
                              )
                            }
                          >
                            <X
                              size={13}
                            />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </Section>

                {/* LINKS */}

                <Section
                  title="Professional Links"
                  description="Add your developer profiles."
                >
                  <div className="space-y-4">

                    <Input
                      label="GitHub"
                      icon={GitBranch}
                      value={
                        profile.github
                      }
                      placeholder="https://github.com/username"
                      onChange={(value) =>
                        handleChange(
                          "github",
                          value
                        )
                      }
                    />

                    <Input
                      label="LinkedIn"
                    //   icon={Linkedin}
                      value={
                        profile.linkedin
                      }
                      placeholder="https://linkedin.com/in/username"
                      onChange={(value) =>
                        handleChange(
                          "linkedin",
                          value
                        )
                      }
                    />

                    <Input
                      label="Portfolio"
                      icon={Globe}
                      value={
                        profile.portfolio
                      }
                      placeholder="https://yourportfolio.com"
                      onChange={(value) =>
                        handleChange(
                          "portfolio",
                          value
                        )
                      }
                    />
                  </div>
                </Section>

                {/* SAVE */}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={
                      handleSave
                    }
                    disabled={
                      saving
                    }
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold transition hover:bg-violet-500 disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                    ) : (
                      <Save
                        size={17}
                      />
                    )}

                    {saving
                      ? "Saving..."
                      : "Save Profile"}
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

/* =========================================================
   SECTION
========================================================= */

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#101117] p-5 sm:p-6">
      <h2 className="font-semibold">
        {title}
      </h2>

      <p className="mt-1 text-xs text-zinc-500">
        {description}
      </p>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  placeholder,
  type = "text",
  disabled = false,
  icon: Icon,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  icon?: React.ElementType;
  onChange?: (
    value: string
  ) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm text-zinc-400">
        {label}
      </label>

      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
          />
        )}

        <input
          type={type}
          value={value}
          disabled={
            disabled
          }
          placeholder={
            placeholder
          }
          onChange={(e) =>
            onChange?.(
              e.target.value
            )
          }
          className={`w-full rounded-xl border border-white/[0.08] bg-white/[0.02] py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-violet-500/50 disabled:cursor-not-allowed disabled:opacity-50 ${
            Icon
              ? "pl-10 pr-4"
              : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getInitials(
  name: string
) {
  if (!name) {
    return "SP";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map(
      (word) =>
        word[0]
    )
    .join("")
    .toUpperCase();
}

function calculateCompletion(
  profile: ProfileForm
) {
  const fields = [
    profile.name,
    profile.email,
    profile.phone,
    profile.location,
    profile.headline,
    profile.bio,
    profile.currentRole,
    profile.github,
    profile.linkedin,
    profile.portfolio,
    profile.skills.length
      ? "skills"
      : "",
  ];

  const completed =
    fields.filter(
      Boolean
    ).length;

  return Math.round(
    (completed /
      fields.length) *
      100
  );
}