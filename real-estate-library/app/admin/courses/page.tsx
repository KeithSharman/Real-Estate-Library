"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/_utils/firebase";
import {
  createOrUpdateCourseTemplate,
  isCurrentUserTenantAdmin,
  listAllCourseTemplatesForTenant,
  removeCourseTemplate,
  seedDemoCourseTemplate,
  seedDemoCourseTemplate2,
  setCourseTemplatePublishState,
} from "@/_services/course-service";

interface AdminTemplate {
  id: string;
  title?: string;
  status?: string;
  category?: string;
  level?: string;
  duration?: string;
}

export default function AdminCoursesPage() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [form, setForm] = useState({
    id: "",
    title: "",
    category: "",
    level: "",
    duration: "",
    description: "",
    status: "draft",
  });

  const loadAdminData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const admin = await isCurrentUserTenantAdmin();
      setIsAdmin(admin);

      if (!admin) {
        return;
      }

      const courseTemplates = await listAllCourseTemplatesForTenant();
      setTemplates(courseTemplates as AdminTemplate[]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load admin data.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  async function handleSeedTemplate() {
    try {
      setSaving(true);
      setError("");
      await seedDemoCourseTemplate();
      await loadAdminData();
    } catch (seedError) {
      setError(seedError instanceof Error ? seedError.message : "Failed to seed demo template.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSeedTemplate2() {
    try {
      setSaving(true);
      setError("");
      await seedDemoCourseTemplate2();
      await loadAdminData();
    } catch (seedError) {
      setError(seedError instanceof Error ? seedError.message : "Failed to seed demo course 2.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveTemplate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      await createOrUpdateCourseTemplate({
        id: form.id || undefined,
        title: form.title,
        category: form.category,
        level: form.level,
        duration: form.duration,
        description: form.description,
        status: form.status,
      });

      setForm({
        id: "",
        title: "",
        category: "",
        level: "",
        duration: "",
        description: "",
        status: "draft",
      });

      await loadAdminData();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save template.");
    } finally {
      setSaving(false);
    }
  }

  async function handleTogglePublished(template: AdminTemplate) {
    try {
      setSaving(true);
      setError("");
      await setCourseTemplatePublishState(template.id, template.status !== "published");
      await loadAdminData();
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Failed to update publish state.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTemplate(templateId: string) {
    const shouldDelete = window.confirm("Delete this template? This cannot be undone.");
    if (!shouldDelete) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      await removeCourseTemplate(templateId);
      await loadAdminData();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete template.");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-5xl rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-2xl font-semibold">Sign in required</h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">Please sign in to access tenant admin tools.</p>
          <Link href="/" className="mt-5 inline-flex rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500">
            Go to sign in
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-5xl">Loading admin data...</div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-950 dark:bg-black dark:text-zinc-50">
        <div className="mx-auto max-w-5xl rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h1 className="text-2xl font-semibold">Admin access required</h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Your user is authenticated but not listed in tenants/{'{tenantId}'}/admins/{'{uid}'}.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-950 dark:bg-black dark:text-zinc-50">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Tenant Admin</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Course Template Management</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSeedTemplate}
                disabled={saving}
                className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
              >
                {saving ? "Working..." : "Seed Demo Course 1"}
              </button>
              <button
                type="button"
                onClick={handleSeedTemplate2}
                disabled={saving}
                className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60"
              >
                {saving ? "Working..." : "Seed Demo Course 2"}
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-200">
              {error}
            </p>
          )}
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-xl font-semibold">Create or Update Template Metadata</h2>
          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={handleSaveTemplate}>
            <div className="flex flex-col gap-1">
              <label htmlFor="template-id" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Template ID <span className="text-zinc-400">(optional for create)</span></label>
              <input id="template-id" name="template-id" value={form.id} onChange={(e) => setForm((s) => ({ ...s, id: e.target.value }))} placeholder="e.g. mls-listing-essentials" className="rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="template-title" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Title <span className="text-red-500">*</span></label>
              <input id="template-title" name="template-title" required value={form.title} onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))} placeholder="e.g. MLS Listing Essentials" className="rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="template-category" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Category</label>
              <input id="template-category" name="template-category" value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))} placeholder="e.g. Listings" className="rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="template-level" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Level</label>
              <input id="template-level" name="template-level" value={form.level} onChange={(e) => setForm((s) => ({ ...s, level: e.target.value }))} placeholder="e.g. Beginner" className="rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="template-duration" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Duration</label>
              <input id="template-duration" name="template-duration" value={form.duration} onChange={(e) => setForm((s) => ({ ...s, duration: e.target.value }))} placeholder="e.g. 2 hours" className="rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="template-status" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Status</label>
              <select id="template-status" name="template-status" value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))} className="rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label htmlFor="template-description" className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Description</label>
              <textarea id="template-description" name="template-description" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} placeholder="Describe what learners will accomplish in this course" className="rounded-xl border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950" rows={3} />
            </div>
            <button type="submit" disabled={saving} className="rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 md:col-span-2">
              {saving ? "Saving..." : "Save Template Metadata"}
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-xl font-semibold">Existing Templates</h2>
          <div className="mt-4 space-y-3">
            {templates.length === 0 && <p className="text-sm text-zinc-600 dark:text-zinc-400">No templates found for this tenant.</p>}
            {templates.map((template) => (
              <article key={template.id} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{template.title ?? template.id}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">{template.id} • {template.status ?? "draft"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleTogglePublished(template)} disabled={saving} className="rounded-full border border-zinc-300 px-3 py-1.5 text-xs font-medium hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-900">
                      {template.status === "published" ? "Unpublish" : "Publish"}
                    </button>
                    <button type="button" onClick={() => handleDeleteTemplate(template.id)} disabled={saving} className="rounded-full border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950/20">
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}