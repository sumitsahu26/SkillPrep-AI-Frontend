"use client";

import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Eye,
  FileText,
  Plus,
  Trash2,
  UserRound,
  BriefcaseBusiness,
  GraduationCap,
  Code2,
  Sparkles,
  Check,
  ChevronRight,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AuthGuard from "../components/AuthGuard";
import { createResume, getResume, updateResume } from "@/services/resumeApi";

type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
};
type Education = {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  details: string;
};
type Project = {
  id: string;
  name: string;
  technologies: string;
  link: string;
  description: string;
};
type Resume = {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
};

const initialResume: Resume = {
  fullName: "",
  title: "Full Stack Developer",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  summary: "",
  skills: "",
  experience: [
    {
      id: "exp-1",
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
  education: [
    {
      id: "edu-1",
      degree: "",
      school: "",
      location: "",
      startDate: "",
      endDate: "",
      details: "",
    },
  ],
  projects: [
    { id: "proj-1", name: "", technologies: "", link: "", description: "" },
  ],
};

const steps = [
  { label: "Personal details", icon: UserRound },
  { label: "Experience", icon: BriefcaseBusiness },
  { label: "Education", icon: GraduationCap },
  { label: "Skills & projects", icon: Code2 },
];

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-zinc-400">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#0b0c11] px-3.5 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10"
      />
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-zinc-400">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-white/10 bg-[#0b0c11] px-3.5 py-3 text-sm leading-6 text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/10"
      />
    </label>
  );
}

const convertToBackendResume = (resume: Resume) => {
  return {
    title: resume.title || "My Resume",

    personalInfo: {
      fullName: resume.fullName,
      email: resume.email,
      phone: resume.phone,
      location: resume.location,
      linkedin: resume.linkedin,
      github: resume.github,
      portfolio: resume.github,
    },

    summary: resume.summary,

    skills: resume.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean),

    experience: resume.experience.map((item) => ({
      company: item.company,
      position: item.role,
      location: item.location,
      startDate: item.startDate,
      endDate: item.endDate,
      currentlyWorking: item.endDate.toLowerCase() === "present",
      description: item.description,
    })),

    education: resume.education.map((item) => ({
      institution: item.school,
      degree: item.degree,
      fieldOfStudy: "",
      startDate: item.startDate,
      endDate: item.endDate,
      grade: "",
      description: item.details,
    })),

    projects: resume.projects.map((item) => ({
      title: item.name,
      description: item.description,
      technologies: item.technologies
        .split(",")
        .map((technology) => technology.trim())
        .filter(Boolean),
      projectUrl: item.link,
      githubUrl: item.link,
    })),

    languages: [],

    template: "modern",
  };
};

export function ResumeBuilderContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [resume, setResume] = useState<Resume>(initialResume);
  const [saved, setSaved] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  const [resumeId, setResumeId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const resumePreviewRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();

  const urlResumeId = searchParams.get("id");

  useEffect(() => {
    const loadResume = async () => {
      try {
        const stored = localStorage.getItem("skillprep-resume-id");

        if (stored) {
          setResumeId(stored);

          const response = await getResume(stored);

          const data = response.resume;

          setResume({
            fullName: data.personalInfo?.fullName || "",
            title: data.title || "Full Stack Developer",
            email: data.personalInfo?.email || "",
            phone: data.personalInfo?.phone || "",
            location: data.personalInfo?.location || "",
            linkedin: data.personalInfo?.linkedin || "",
            github:
              data.personalInfo?.github || data.personalInfo?.portfolio || "",

            summary: data.summary || "",

            skills: data.skills?.join(", ") || "",

            experience:
              data.experience?.map((item, index) => ({
                id: `exp-${index}-${Date.now()}`,
                role: item.position || "",
                company: item.company || "",
                location: item.location || "",
                startDate: item.startDate || "",
                endDate: item.endDate || "",
                description: item.description || "",
              })) || [],

            education:
              data.education?.map((item, index) => ({
                id: `edu-${index}-${Date.now()}`,
                degree: item.degree || "",
                school: item.institution || "",
                location: "",
                startDate: item.startDate || "",
                endDate: item.endDate || "",
                details: item.description || "",
              })) || [],

            projects:
              data.projects?.map((item, index) => ({
                id: `proj-${index}-${Date.now()}`,
                name: item.title || "",
                technologies: item.technologies?.join(", ") || "",
                link: item.projectUrl || item.githubUrl || "",
                description: item.description || "",
              })) || [],
          });

          return;
        }

        // Keep old local draft support
        const storedDraft = localStorage.getItem("skillprep-resume-draft");

        if (storedDraft) {
          setResume({
            ...initialResume,
            ...JSON.parse(storedDraft),
          });
        }
      } catch (error) {
        console.error("Failed to load resume:", error);
        setError("Failed to load resume");
      }
    };

    loadResume();
  }, [urlResumeId]);

  const update = (key: keyof Resume, value: string) => {
    setResume((prev) => ({
      ...prev,
      [key]: value,
    }));
  
    setSaved(false);
  };

  const updateExperience = (
    id: string,
    field: keyof Experience,
    value: string
  ) => {
    setResume((prev) => ({
      ...prev,
      experience: prev.experience.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));

    setSaved(false);
  };

  const updateEducation = (
    id: string,
    field: keyof Education,
    value: string
  ) => {
    setResume((prev) => ({
      ...prev,
      education: prev.education.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));

    setSaved(false);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      ),
    }));

    setSaved(false);
  };

  const addEntry = (key: "experience" | "education" | "projects") => {
    const id = `${key}-${Date.now()}`;
    if (key === "experience")
      setResume((p) => ({
        ...p,
        experience: [
          ...p.experience,
          {
            id,
            role: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ],
      }));
    if (key === "education")
      setResume((p) => ({
        ...p,
        education: [
          ...p.education,
          {
            id,
            degree: "",
            school: "",
            location: "",
            startDate: "",
            endDate: "",
            details: "",
          },
        ],
      }));
    if (key === "projects")
      setResume((p) => ({
        ...p,
        projects: [
          ...p.projects,
          { id, name: "", technologies: "", link: "", description: "" },
        ],
      }));
    setSaved(false);
  };

  const removeEntry = (
    key: "experience" | "education" | "projects",
    id: string
  ) => {
    setResume((prev) => {
      if (key === "experience") {
        return {
          ...prev,
          experience: prev.experience.filter((entry) => entry.id !== id),
        };
      }

      if (key === "education") {
        return {
          ...prev,
          education: prev.education.filter((entry) => entry.id !== id),
        };
      }

      return {
        ...prev,
        projects: prev.projects.filter((entry) => entry.id !== id),
      };
    });

    setSaved(false);
  };

  const saveDraft = async () => {
    try {
      setIsSaving(true);
      setError("");
      setSaved(false);

      const backendResume = convertToBackendResume(resume);

      if (resumeId) {
        const response = await updateResume(resumeId, backendResume);

        if (response.success) {
          setSaved(true);

          localStorage.setItem(
            "skillprep-resume-draft",
            JSON.stringify(resume)
          );
        }

        return;
      }

      const response = await createResume(backendResume);

      if (response.success && response.resume?._id) {
        setResumeId(response.resume._id);

        localStorage.setItem("skillprep-resume-id", response.resume._id);

        localStorage.setItem("skillprep-resume-draft", JSON.stringify(resume));

        setSaved(true);
      }
    } catch (error) {
      console.error("Save resume error:", error);

      setError(
        error instanceof Error ? error.message : "Failed to save resume"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const skills = useMemo(
    () =>
      resume.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [resume.skills]
  );

  const exportPDF = async () => {
    if (!resumePreviewRef.current) return;
  
    try {
      const html2pdf = (await import("html2pdf.js")).default;
  
      const element = resumePreviewRef.current;
  
      const options: any = {
        margin: 0,
        filename: `${resume.fullName || "resume"}-resume.pdf`,
        image: {
          type: "jpeg",
          quality: 1,
        },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["css", "legacy"],
        },
      };
  
      const pdfBlob = await html2pdf()
        .set(options)
        .from(element)
        .outputPdf("blob");
  
      const pdfUrl = URL.createObjectURL(pdfBlob);
  
      window.open(pdfUrl, "_blank");
  
      // Release memory later
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 60000);
    } catch (error) {
      console.error("PDF preview error:", error);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#08090d] text-zinc-100">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-h-screen lg:pl-64">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <main className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-9">
            <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <Link
                  href="/dashboard"
                  className="mb-4 inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-200"
                >
                  <ArrowLeft size={14} /> Back to dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold sm:text-3xl">
                      Resume Builder
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">
                      Create your professional resume with a live preview.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowPreview((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5"
                >
                  <Eye size={16} />{" "}
                  {showPreview ? "Hide preview" : "Show preview"}
                </button>
                <button
                  onClick={saveDraft}
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-2.5 text-sm font-medium text-violet-200 hover:bg-violet-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saved ? <Check size={16} /> : <Sparkles size={16} />}

                  {isSaving ? "Saving..." : saved ? "Saved" : "Save resume"}
                </button>
                <button
                  onClick={exportPDF}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
                >
                  <Download size={16} /> Export PDF
                </button>
              </div>
            </div>
            {error && (
  <div className="mb-5 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
    {error}
  </div>
)}

            <div
              className={`grid items-start gap-6 ${
                showPreview
                  ? "xl:grid-cols-[minmax(0,1fr)_minmax(420px,0.92fr)]"
                  : "grid-cols-1"
              }`}
            >
              <section className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#101117] p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {steps.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => setStep(index)}
                        className={`flex items-center gap-2 rounded-xl border p-3 text-left transition ${
                          step === index
                            ? "border-violet-400/30 bg-violet-500/10 text-violet-200"
                            : "border-white/[0.07] text-zinc-500 hover:bg-white/[0.03]"
                        }`}
                      >
                        <Icon size={17} />
                        <span className="text-xs font-medium">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                      Step {step + 1} of {steps.length}
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">
                      {steps[step].label}
                    </h2>
                  </div>
                  <span className="text-xs text-zinc-500">
                    {Math.round(((step + 1) / steps.length) * 100)}% complete
                  </span>
                </div>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all"
                    style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  />
                </div>

                <div className="mt-7 space-y-5">
                  {step === 0 && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field
                          label="Full name"
                          value={resume.fullName}
                          onChange={(v) => update("fullName", v)}
                          placeholder="e.g. Alex Morgan"
                        />
                        <Field
                          label="Professional title"
                          value={resume.title}
                          onChange={(v) => update("title", v)}
                          placeholder="e.g. Full Stack Developer"
                        />
                        <Field
                          label="Email address"
                          type="email"
                          value={resume.email}
                          onChange={(v) => update("email", v)}
                          placeholder="alex@example.com"
                        />
                        <Field
                          label="Phone number"
                          value={resume.phone}
                          onChange={(v) => update("phone", v)}
                          placeholder="+91 98765 43210"
                        />
                        <Field
                          label="Location"
                          value={resume.location}
                          onChange={(v) => update("location", v)}
                          placeholder="City, Country"
                        />
                        <Field
                          label="LinkedIn URL"
                          value={resume.linkedin}
                          onChange={(v) => update("linkedin", v)}
                          placeholder="linkedin.com/in/yourname"
                        />
                        <div className="sm:col-span-2">
                          <Field
                            label="GitHub / Portfolio URL"
                            value={resume.github}
                            onChange={(v) => update("github", v)}
                            placeholder="github.com/yourname or portfolio URL"
                          />
                        </div>
                      </div>
                      <TextField
                        label="Professional summary"
                        value={resume.summary}
                        onChange={(v) => update("summary", v)}
                        placeholder="Write 2–4 sentences about your experience, strengths, and the value you bring."
                      />
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <p className="text-sm leading-6 text-zinc-500">
                        Add your work experience, starting with your most recent
                        role. Use clear, accurate descriptions of your work.
                      </p>
                      {resume.experience.map((entry, index) => (
                        <div
                          key={entry.id}
                          className="rounded-xl border border-white/[0.08] p-4"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold">
                              Experience {index + 1}
                            </h3>
                            <button
                              onClick={() =>
                                removeEntry("experience", entry.id)
                              }
                              aria-label="Remove experience"
                              className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-300"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                              label="Job title"
                              value={entry.role}
                              onChange={(v) =>
                                updateExperience(entry.id, "role", v)
                              }
                              placeholder="Full Stack Developer"
                            />
                            <Field
                              label="Company"
                              value={entry.company}
                              onChange={(v) =>
                                updateExperience(entry.id, "company", v)
                              }
                              placeholder="Company name"
                            />
                            <Field
                              label="Location"
                              value={entry.location}
                              onChange={(v) =>
                                updateExperience(entry.id, "location", v)
                              }
                              placeholder="City or Remote"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <Field
                                label="Start date"
                                value={entry.startDate}
                                onChange={(v) =>
                                  updateExperience(entry.id, "startDate", v)
                                }
                                placeholder="Jan 2023"
                              />
                              <Field
                                label="End date"
                                value={entry.endDate}
                                onChange={(v) =>
                                  updateExperience(entry.id, "endDate", v)
                                }
                                placeholder="Present"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <TextField
                                label="Responsibilities and achievements"
                                value={entry.description}
                                onChange={(v) =>
                                  updateExperience(entry.id, "description", v)
                                }
                                placeholder={
                                  "Describe your work and impact. Put each bullet on a new line.\nExample: Built REST APIs using Node.js and Express."
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addEntry("experience")}
                        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm text-zinc-300 hover:border-violet-400/40 hover:text-violet-200"
                      >
                        <Plus size={16} /> Add experience
                      </button>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      {resume.education.map((entry, index) => (
                        <div
                          key={entry.id}
                          className="rounded-xl border border-white/[0.08] p-4"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold">
                              Education {index + 1}
                            </h3>
                            <button
                              onClick={() => removeEntry("education", entry.id)}
                              aria-label="Remove education"
                              className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-300"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                              label="Degree / qualification"
                              value={entry.degree}
                              onChange={(v) =>
                                updateEducation(entry.id, "degree", v)
                              }
                              placeholder="B.Tech in Computer Science"
                            />
                            <Field
                              label="School / university"
                              value={entry.school}
                              onChange={(v) =>
                                updateEducation(entry.id, "school", v)
                              }
                              placeholder="University name"
                            />
                            <Field
                              label="Location"
                              value={entry.location}
                              onChange={(v) =>
                                updateEducation(entry.id, "location", v)
                              }
                              placeholder="City, Country"
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <Field
                                label="Start year"
                                value={entry.startDate}
                                onChange={(v) =>
                                  updateEducation(entry.id, "startDate", v)
                                }
                                placeholder="2020"
                              />
                              <Field
                                label="End year"
                                value={entry.endDate}
                                onChange={(v) =>
                                  updateEducation(entry.id, "endDate", v)
                                }
                                placeholder="2024"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <TextField
                                label="Additional details (optional)"
                                value={entry.details}
                                onChange={(v) =>
                                  updateEducation(entry.id, "details", v)
                                }
                                placeholder="Relevant coursework, honors, or achievements"
                                rows={2}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addEntry("education")}
                        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm text-zinc-300 hover:border-violet-400/40 hover:text-violet-200"
                      >
                        <Plus size={16} /> Add education
                      </button>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <TextField
                        label="Technical and professional skills"
                        value={resume.skills}
                        onChange={(v) => update("skills", v)}
                        placeholder="JavaScript, TypeScript, React, Next.js, Node.js, Express, MongoDB, Git"
                        rows={3}
                      />
                      <p className="-mt-2 text-xs text-zinc-500">
                        Separate skills with commas. Each skill appears as a tag
                        in your resume preview.
                      </p>
                      <div className="mt-6 flex items-center justify-between">
                        <h3 className="text-base font-semibold">Projects</h3>
                        <span className="text-xs text-zinc-500">
                          Highlight your best work
                        </span>
                      </div>
                      {resume.projects.map((entry, index) => (
                        <div
                          key={entry.id}
                          className="rounded-xl border border-white/[0.08] p-4"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-semibold">
                              Project {index + 1}
                            </h3>
                            <button
                              onClick={() => removeEntry("projects", entry.id)}
                              aria-label="Remove project"
                              className="rounded-lg p-2 text-zinc-500 hover:bg-red-500/10 hover:text-red-300"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                              label="Project name"
                              value={entry.name}
                              onChange={(v) =>
                                updateProject(entry.id, "name", v)
                              }
                              placeholder="Inventory Management System"
                            />
                            <Field
                              label="Technologies"
                              value={entry.technologies}
                              onChange={(v) =>
                                updateProject(entry.id, "technologies", v)
                              }
                              placeholder="React, Node.js, MongoDB"
                            />
                            <div className="sm:col-span-2">
                              <Field
                                label="Project URL (optional)"
                                value={entry.link}
                                onChange={(v) =>
                                  updateProject(entry.id, "link", v)
                                }
                                placeholder="https://github.com/..."
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <TextField
                                label="Project description"
                                value={entry.description}
                                onChange={(v) =>
                                  updateProject(entry.id, "description", v)
                                }
                                placeholder="What does it do? What did you build? What impact did it have?"
                                rows={3}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addEntry("projects")}
                        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-white/15 px-4 py-3 text-sm text-zinc-300 hover:border-violet-400/40 hover:text-violet-200"
                      >
                        <Plus size={16} /> Add project
                      </button>
                    </>
                  )}
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-5">
                  <button
                    disabled={step === 0}
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                    className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Previous
                  </button>
                  {step < steps.length - 1 ? (
                    <button
                      onClick={() =>
                        setStep((s) => Math.min(steps.length - 1, s + 1))
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500"
                    >
                      Next section <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={saveDraft}
                      disabled={isSaving}
                      className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Check size={16} />

                      {isSaving ? "Saving..." : "Save resume"}
                    </button>
                  )}
                </div>
              </section>

              {showPreview && (
                <section className="min-w-0 xl:sticky xl:top-24">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold">Live preview</h2>
                      <p className="mt-1 text-xs text-[#71717a]">
                        Updates as you type
                      </p>
                    </div>
                    <span className="rounded-lg border border-[#34d399] bg-[#ecfdf5] px-2.5 py-1.5 text-xs text-[#047857]">
                      Live
                    </span>
                  </div>
                  <article
  ref={resumePreviewRef}
  id="resume-print"
  className="
    resume-paper
    mx-auto
    min-h-[297mm]
    w-full
    max-w-[210mm]
    bg-white
    p-[15mm]
    text-[#27272a]
    shadow-2xl
  "
  style={{
    color: "#27272a",
    backgroundColor: "#ffffff",
  }}
>
<header className="border-b-2 border-[#6d28d9] pb-5">                      
  <h1 className="break-words text-3xl font-bold tracking-tight">
                        {resume.fullName || "Your Name"}
                      </h1>
                      <p className="mt-1 text-base font-semibold text-[#6d28d9]">
                        {resume.title || "Professional Title"}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-[#52525b]">
                        {[
                          resume.email,
                          resume.phone,
                          resume.location,
                          resume.linkedin,
                          resume.github,
                        ]
                          .filter(Boolean)
                          .map((value) => (
                            <span key={value} className="break-all">
                              {value}
                            </span>
                          ))}
                      </div>
                    </header>

                    {resume.summary && (
                      <section className="mt-5">
                        <h2 className="resume-heading">Professional Summary</h2>
                        <p className="mt-2 whitespace-pre-line text-xs leading-5">
                          {resume.summary}
                        </p>
                      </section>
                    )}

                    {resume.experience.some(
                      (e) => e.role || e.company || e.description
                    ) && (
                      <section className="mt-5">
                        <h2 className="resume-heading">Experience</h2>
                        <div className="mt-3 space-y-4">
                          {resume.experience
                            .filter((e) => e.role || e.company || e.description)
                            .map((e) => (
                              <div key={e.id}>
                                <div className="flex flex-wrap justify-between gap-1">
                                  <h3 className="text-sm font-bold">
                                    {e.role || "Job Title"}
                                    {e.company ? ` · ${e.company}` : ""}
                                  </h3>
                                  <span className="text-[10px] text-[#71717a]">
                                    {[e.startDate, e.endDate]
                                      .filter(Boolean)
                                      .join(" – ")}
                                  </span>
                                </div>
                                {e.location && (
                                  <p className="mt-0.5 text-[10px] text-[#71717a]">
                                    {e.location}
                                  </p>
                                )}
                                <p className="mt-1 whitespace-pre-line text-xs leading-5">
                                  {e.description}
                                </p>
                              </div>
                            ))}
                        </div>
                      </section>
                    )}

                    {resume.projects.some((p) => p.name || p.description) && (
                      <section className="mt-5">
                        <h2 className="resume-heading">Projects</h2>
                        <div className="mt-3 space-y-3">
                          {resume.projects
                            .filter((p) => p.name || p.description)
                            .map((p) => (
                              <div key={p.id}>
                                <div className="flex flex-wrap items-baseline justify-between gap-1">
                                  <h3 className="text-sm font-bold">
                                    {p.name || "Project name"}
                                  </h3>
                                  {p.link && (
                                    <span className="break-all text-[10px] text-[#6d28d9]">
                                      {p.link}
                                    </span>
                                  )}
                                </div>
                                {p.technologies && (
                                  <p className="mt-0.5 text-[10px] font-semibold text-[#71717a]">
                                    {p.technologies}
                                  </p>
                                )}
                                <p className="mt-1 whitespace-pre-line text-xs leading-5">
                                  {p.description}
                                </p>
                              </div>
                            ))}
                        </div>
                      </section>
                    )}

                    {resume.education.some(
                      (e) => e.degree || e.school || e.details
                    ) && (
                      <section className="mt-5">
                        <h2 className="resume-heading">Education</h2>
                        <div className="mt-3 space-y-3">
                          {resume.education
                            .filter((e) => e.degree || e.school || e.details)
                            .map((e) => (
                              <div key={e.id}>
                                <div className="flex flex-wrap justify-between gap-1">
                                  <h3 className="text-sm font-bold">
                                    {e.degree || "Degree"}
                                    {e.school ? ` · ${e.school}` : ""}
                                  </h3>
                                  <span className="text-[10px] text-[#71717a]">
                                    {[e.startDate, e.endDate]
                                      .filter(Boolean)
                                      .join(" – ")}
                                  </span>
                                </div>
                                {e.location && (
                                  <p className="text-[10px] text-[#71717a]">
                                    {e.location}
                                  </p>
                                )}
                                {e.details && (
                                  <p className="mt-1 whitespace-pre-line text-xs leading-5">
                                    {e.details}
                                  </p>
                                )}
                              </div>
                            ))}
                        </div>
                      </section>
                    )}

                    {skills.length > 0 && (
                      <section className="mt-5">
                        <h2 className="resume-heading">Skills</h2>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {skills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded border border-[#e4e4e7] bg-[#fafafa] px-2 py-1 text-[10px]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </section>
                    )}

                    {!resume.summary &&
                      !resume.experience.some(
                        (e) => e.role || e.company || e.description
                      ) &&
                      !resume.projects.some((p) => p.name || p.description) &&
                      !resume.education.some(
                        (e) => e.degree || e.school || e.details
                      ) &&
                      skills.length === 0 && (
                        <div className="flex min-h-[400px] flex-col items-center justify-center text-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f3ff] text-[#7c3aed]">
                            <FileText size={27} />
                          </div>
                          <p className="mt-4 text-sm font-semibold">
                            Your resume preview
                          </p>
                          <p className="mt-2 max-w-xs text-xs leading-5 text-[#71717a]">
                            Start filling in your details. Your resume will
                            appear here as you type.
                          </p>
                        </div>
                      )}
                  </article>
                  <p className="mt-3 text-center text-xs leading-5 text-[#52525b]">
                    PDF export opens the browser print dialog. Select “Save as
                    PDF”.
                  </p>
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

function ResumeBuilderLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#08090d] text-white">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />

        <p className="mt-4 text-sm text-zinc-500">
          Loading resume builder...
        </p>
      </div>
    </div>
  );
}

export default function ResumeBuilderPage() {
  return (
    <Suspense fallback={<ResumeBuilderLoading />}>
      <ResumeBuilderContent />
    </Suspense>
  );
}