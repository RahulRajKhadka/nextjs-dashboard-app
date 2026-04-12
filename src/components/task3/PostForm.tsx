"use client";

import { useState } from "react";
import { newPostSchema, NewPostFormData } from "@/lib/validators";
import { useDashboardStore } from "@/store/useStore";

interface PostFormProps {
  userId: number;
}

export default function PostForm({ userId }: PostFormProps) {
  const [formData, setFormData] = useState<NewPostFormData>({
    title: "",
    body: "",
  });

  const [errors, setErrors] = useState<Partial<NewPostFormData>>({});
  const [submitted, setSubmitted] = useState(false);

  const addLocalPost = useDashboardStore((s) => s.addLocalPost);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = () => {
    const result = newPostSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<NewPostFormData> = {};

      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof NewPostFormData;
        fieldErrors[field] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }

    addLocalPost(userId, result.data);

    setFormData({ title: "", body: "" });
    setErrors({});
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/20 flex items-center justify-center text-blue-400">
          ✏️
        </div>
        <h2 className="text-white font-semibold text-base sm:text-lg">
          Add New Post
        </h2>
      </div>

      {/* Success */}
      {submitted && (
        <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm rounded-xl flex items-center gap-2">
          ✅ Post added successfully!
        </div>
      )}

      {/* Form */}
      <div className="flex flex-col gap-4">

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 uppercase tracking-wider">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a title..."
            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
              errors.title
                ? "border-red-500/50 focus:ring-red-500/20"
                : "border-white/10 focus:border-blue-400/50 focus:ring-blue-500/20"
            }`}
          />

          {errors.title && (
            <p className="text-xs text-red-400">⚠ {errors.title}</p>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 uppercase tracking-wider">
            Body
          </label>

          <textarea
            name="body"
            value={formData.body}
            onChange={handleChange}
            placeholder="Write your post content..."
            rows={5}
            className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition resize-none ${
              errors.body
                ? "border-red-500/50 focus:ring-red-500/20"
                : "border-white/10 focus:border-blue-400/50 focus:ring-blue-500/20"
            }`}
          />

          {errors.body && (
            <p className="text-xs text-red-400">⚠ {errors.body}</p>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="self-start px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm sm:text-base font-semibold rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5"
        >
          Publish Post →
        </button>
      </div>
    </div>
  );
}