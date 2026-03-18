import React, { useEffect, useState } from "react";
import { ContactSection } from "../components/ContactSection";
import { notifyError, notifySuccess } from "../lib/notify";
import {
  Category,
  CoreValue,
  Milestone,
  ManagementMember,
  OperatingField,
  CustomerFeedback,
  FeaturedProject,
  clearAccessToken,
  Cv,
  fetchCategories,
  fetchCvs,
  fetchJobs,
  fetchPosts,
  fetchTickets,
  fetchCoreValues,
  fetchMilestones,
  fetchManagementMembers,
  fetchOperatingFields,
  fetchCustomerFeedbacks,
  fetchFeaturedProjects,
  getAccessToken,
  JobDescription,
  Post,
  Ticket,
  createJob,
  createPost,
  createTicket,
  createCategory,
  createCoreValue,
  createMilestone,
  createManagementMember,
  createOperatingField,
  createCustomerFeedback,
  createFeaturedProject,
  deleteJob,
  deletePost,
  deleteTicket,
  deleteCategory,
  deleteCoreValue,
  deleteMilestone,
  deleteManagementMember,
  deleteOperatingField,
  deleteCustomerFeedback,
  deleteFeaturedProject,
  getMe,
  updateCv,
  updateTicket,
  updateCategory,
  updateCoreValue,
  updateMilestone,
  updateManagementMember,
  updateOperatingField,
  updateCustomerFeedback,
  updatePost,
  updateJob,
  updateFeaturedProject,
  createCv,
} from "../lib/api";

type TabKey =
  | "overview"
  | "posts"
  | "jobs"
  | "tickets"
  | "cvs"
  | "categories"
  | "core-values"
  | "milestones"
  | "management"
  | "operating-fields"
  | "customer-feedbacks"
  | "featured-projects";

const useRequireAuth = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    (async () => {
      try {
        const me = await getMe();
        if (!me) {
          // Token không hợp lệ hoặc backend không trả user -> buộc đăng nhập lại
          clearAccessToken();
          window.location.href = "/login";
          return;
        }
        if (me.name || me.username) {
          setUserName(me.name || me.username || null);
        }
      } catch {
        // Gặp lỗi khi gọi /auths/me -> token có vấn đề, đưa user về trang đăng nhập
        clearAccessToken();
        window.location.href = "/login";
      }
    })();
  }, []);

  return { userName };
};

const PostsAdmin: React.FC = () => {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catLoading, setCatLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newTags, setNewTags] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchPosts({ page: 1, limit: 20 });
        setItems(data);
      } catch (e) {
        setError("Không tải được danh sách bài viết.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setCatLoading(true);
        const data = await fetchCategories({ page: 1, limit: 50 });
        setCategories(data);
        if (!newCategoryId && data.length > 0) {
          setNewCategoryId(data[0]._id);
        }
      } catch {
        // giữ nguyên, cho phép user tự nhập categoryId nếu cần
      } finally {
        setCatLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadImageToCloudinary = async (file: File): Promise<string | undefined> => {

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      notifyError(
        "Thiếu cấu hình Cloudinary (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)."
      );
      return newImageUrl.trim() || undefined;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    setImageUploading(true);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || "Upload ảnh thất bại");
      }
      const url = data.secure_url as string;
      setNewImageUrl(url); // tự động điền link image vào input
      return url;
    } catch (e) {
      notifyError((e as Error).message);
      return undefined;
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!newTitle.trim() || !newContent.trim() || !newCategoryId.trim()) {
      notifyError("Vui lòng nhập đầy đủ tiêu đề, nội dung và category.");
      return;
    }
    try {
      setCreating(true);
      let finalImageUrl = newImageUrl.trim() || undefined;
      if (!finalImageUrl && imageFile) {
        finalImageUrl = await uploadImageToCloudinary(imageFile);
      }

      if (!editingId) {
        const created = await createPost({
          title: newTitle.trim(),
          content: newContent.trim(),
          status: "public",
          categoryId: newCategoryId.trim(),
          imageUrl: finalImageUrl,
          tags: newTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        });
        setItems((prev) => [created, ...prev]);
      } else {
        const updated = await updatePost(editingId, {
          title: newTitle.trim(),
          content: newContent.trim(),
          categoryId: newCategoryId.trim(),
          imageUrl: finalImageUrl,
          tags: newTags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        });
        setItems((prev) => prev.map((p) => (p._id === editingId ? updated : p)));
      }
      setEditingId(null);
      setShowForm(false);
      setNewTitle("");
      setNewContent("");
      setNewCategoryId(categories[0]?._id ?? "");
      setNewImageUrl("");
      setNewTags("");
      setImageFile(null);
      setImagePreview(null);
    } catch {
      notifyError(editingId ? "Cập nhật bài viết thất bại." : "Tạo bài viết thất bại.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá bài viết này?")) return;
    try {
      await deletePost(id);
      setItems((prev) => prev.filter((p) => p._id !== id));
      notifySuccess("Đã xoá bài viết.");
    } catch {
      notifyError("Xoá bài viết thất bại.");
    }
  };

  const startEdit = (post: Post) => {
    setEditingId(post._id);
    setNewTitle(post.title);
    setNewContent(post.content);
    setNewCategoryId(post.categoryId);
    setNewImageUrl(post.imageUrl ?? "");
    setNewTags((post.tags ?? []).join(", "));
    setImageFile(null);
    setImagePreview(null);
    setShowForm(true);
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-50">Quản lý bài viết</h2>
          <p className="mt-1 text-xs text-slate-400">
            Danh sách lấy từ API `/posts`. Hiển thị trước, thêm mới bằng nút bên phải.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center justify-center rounded-full border border-sky-500/60 px-3 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/10"
        >
          {showForm ? "Đóng form" : "Thêm bài viết"}
        </button>
      </div>
      {showForm && (
        <div className="mb-4 space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <p className="font-semibold text-slate-50">Tạo bài viết mới nhanh</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Tiêu đề bài viết"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <select
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-ahv-primary"
              value={newCategoryId}
              onChange={(e) => setNewCategoryId(e.target.value)}
            >
              <option value="">
                {catLoading ? "Đang tải category..." : "Chọn category"}
              </option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <textarea
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            rows={3}
            placeholder="Nội dung tóm tắt"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Ảnh đại diện (imageUrl - tuỳ chọn)"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Tags (cách nhau bằng dấu phẩy)"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImageFile(file);
              if (file) {
                const localUrl = URL.createObjectURL(file);
                setImagePreview(localUrl);
                // upload luôn lên Cloudinary và sau khi thành công sẽ tự set newImageUrl
                void uploadImageToCloudinary(file);
              } else {
                setImagePreview(null);
              }
            }}
          />
          {imagePreview && (
            <div className="flex items-center gap-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-16 w-16 rounded-md object-cover border border-slate-700"
              />
              {imageUploading && (
                <span className="text-[11px] text-slate-400">Đang upload ảnh...</span>
              )}
            </div>
          )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={creating}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-full bg-ahv-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-sky-500/40 hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating
              ? editingId
                ? "Đang lưu..."
                : "Đang tạo..."
              : editingId
              ? "Lưu thay đổi"
              : "Lưu bài viết"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setShowForm(false);
            }}
            className="inline-flex items-center justify-center rounded-full border border-slate-600 px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-slate-800"
          >
            Huỷ
          </button>
        </div>
        </div>
      )}
      {loading && <p className="text-xs text-slate-300">Đang tải dữ liệu...</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="mt-3 space-y-2 text-xs">
        {items.map((post) => {
          const isEditing = editingId === post._id;
          return (
            <div
              key={post._id}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
            >
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-slate-50 line-clamp-1">
                  {post.title}
                </p>
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                  {post.content}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(post)}
                  className="rounded-full border border-sky-500/70 px-2 py-1 text-[11px] text-sky-300 hover:bg-sky-500/10"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post._id)}
                  className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-red-400 hover:text-red-300"
                >
                  Xoá
                </button>
              </div>
            </div>
          );
        })}
        {!loading && !items.length && (
          <p className="text-xs text-slate-400">Chưa có bài viết nào.</p>
        )}
      </div>
    </section>
  );
};

const JobsAdmin: React.FC = () => {
  const [items, setItems] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPosition, setNewPosition] = useState("");
  const [newSalary, setNewSalary] = useState("");
  const [newExperience, setNewExperience] = useState("");
  const [newLevel, setNewLevel] = useState("");
  const [newJobType, setNewJobType] = useState("");
  const [newGender, setNewGender] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newExpiredAt, setNewExpiredAt] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newRequirements, setNewRequirements] = useState("");
  const [newBenefits, setNewBenefits] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchJobs({ page: 1, limit: 20 });
        setItems(data);
      } catch (e) {
        setError("Không tải được danh sách tuyển dụng.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async () => {
    if (!newTitle.trim()) {
      notifyError("Vui lòng nhập tiêu đề công việc.");
      return;
    }
    try {
      setCreating(true);
      if (!editingId) {
        const created = await createJob({
          title: newTitle.trim(),
          position: newPosition.trim() || undefined,
          salary: newSalary.trim() || undefined,
          experience: newExperience.trim() || undefined,
          level: newLevel.trim() || undefined,
          jobType: newJobType.trim() || undefined,
          gender: newGender.trim() || undefined,
          location: newLocation.trim() || undefined,
          description: newDescription.trim() || undefined,
          requirements: newRequirements.trim() || undefined,
          benefits: newBenefits.trim() || undefined,
          quantity: newQuantity ? Number(newQuantity) : undefined,
          expiredAt: newExpiredAt ? new Date(newExpiredAt).toISOString() : undefined,
        } as Omit<JobDescription, "_id">);
        setItems((prev) => [created, ...prev]);
      } else {
        const updated = await updateJob(editingId, {
          title: newTitle.trim(),
          position: newPosition.trim() || undefined,
          salary: newSalary.trim() || undefined,
          experience: newExperience.trim() || undefined,
          level: newLevel.trim() || undefined,
          jobType: newJobType.trim() || undefined,
          gender: newGender.trim() || undefined,
          location: newLocation.trim() || undefined,
          description: newDescription.trim() || undefined,
          requirements: newRequirements.trim() || undefined,
          benefits: newBenefits.trim() || undefined,
          quantity: newQuantity ? Number(newQuantity) : undefined,
          expiredAt: newExpiredAt ? new Date(newExpiredAt).toISOString() : undefined,
        });
        setItems((prev) => prev.map((j) => (j._id === editingId ? updated : j)));
      }
      setEditingId(null);
      setShowForm(false);
      setNewTitle("");
      setNewPosition("");
      setNewSalary("");
      setNewExperience("");
      setNewLevel("");
      setNewJobType("");
      setNewGender("");
      setNewLocation("");
      setNewQuantity("");
      setNewExpiredAt("");
      setNewDescription("");
      setNewRequirements("");
      setNewBenefits("");
    } catch {
      notifyError(editingId ? "Cập nhật JD thất bại." : "Tạo JD thất bại.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá tin tuyển dụng này?")) return;
    try {
      await deleteJob(id);
      setItems((prev) => prev.filter((p) => p._id !== id));
    } catch {
      notifyError("Xoá tin tuyển dụng thất bại.");
    }
  };

  const startEdit = (job: JobDescription) => {
    setEditingId(job._id);
    setNewTitle(job.title || "");
    setNewPosition(job.position || "");
    setNewSalary(job.salary || "");
    setNewExperience(job.experience || "");
    setNewLevel(job.level || "");
    setNewJobType(job.jobType || "");
    setNewGender(job.gender || "");
    setNewLocation(job.location || "");
    setNewQuantity(job.quantity ? String(job.quantity) : "");
    setNewExpiredAt(
      job.expiredAt ? job.expiredAt.slice(0, 10) : ""
    );
    setNewDescription(job.description || "");
    setNewRequirements(job.requirements || "");
    setNewBenefits(job.benefits || "");
    setShowForm(true);
  };

  if (selectedJob) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-50">
              Chi tiết JD · {selectedJob.title}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Upload CV cho vị trí này. Dữ liệu sẽ lưu vào bảng CV.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedJob(null)}
            className="inline-flex items-center justify-center rounded-full border border-slate-600 px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-slate-800"
          >
            ← Quay lại danh sách
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-50 space-y-1">
          <p className="text-sm font-semibold">{selectedJob.title}</p>
          {selectedJob.location && (
            <p className="text-[11px] text-slate-400">Địa điểm: {selectedJob.location}</p>
          )}
          {selectedJob.salary && (
            <p className="text-[11px] text-slate-400">Lương: {selectedJob.salary}</p>
          )}
          {selectedJob.level && (
            <p className="text-[11px] text-slate-400">Cấp bậc: {selectedJob.level}</p>
          )}
          {selectedJob.jobType && (
            <p className="text-[11px] text-slate-400">
              Hình thức: {selectedJob.jobType}
            </p>
          )}
          {selectedJob.description && (
            <p className="mt-2 text-[11px] text-slate-300">
              {selectedJob.description}
            </p>
          )}
        </div>

        <UploadCvForJob job={selectedJob} />
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-50">Quản lý tuyển dụng</h2>
          <p className="mt-1 text-xs text-slate-400">
            Danh sách lấy từ API `/jds`. Hiển thị trước, thêm mới bằng nút bên phải.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center justify-center rounded-full border border-sky-500/60 px-3 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/10"
        >
          {showForm ? "Đóng form" : "Thêm JD"}
        </button>
      </div>
      {showForm && (
        <div className="mb-4 space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <p className="font-semibold text-slate-50">Tạo JD mới nhanh</p>
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Tiêu đề công việc"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Vị trí (position)"
            value={newPosition}
            onChange={(e) => setNewPosition(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Mức lương (salary)"
            value={newSalary}
            onChange={(e) => setNewSalary(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Kinh nghiệm yêu cầu (experience)"
            value={newExperience}
            onChange={(e) => setNewExperience(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Cấp bậc (level)"
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Hình thức làm việc (jobType)"
            value={newJobType}
            onChange={(e) => setNewJobType(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Giới tính (gender)"
            value={newGender}
            onChange={(e) => setNewGender(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Địa điểm (tuỳ chọn)"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Số lượng (quantity)"
              value={newQuantity}
              onChange={(e) => setNewQuantity(e.target.value)}
            />
            <input
              type="date"
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              value={newExpiredAt}
              onChange={(e) => setNewExpiredAt(e.target.value)}
            />
          </div>
          <textarea
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            rows={3}
            placeholder="Mô tả công việc (description)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <textarea
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            rows={3}
            placeholder="Yêu cầu (requirements)"
            value={newRequirements}
            onChange={(e) => setNewRequirements(e.target.value)}
          />
          <textarea
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            rows={3}
            placeholder="Quyền lợi (benefits)"
            value={newBenefits}
            onChange={(e) => setNewBenefits(e.target.value)}
          />
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={creating}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-full bg-ahv-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-sky-500/40 hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating
              ? editingId
                ? "Đang lưu..."
                : "Đang tạo..."
              : editingId
              ? "Lưu thay đổi"
              : "Lưu JD"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setShowForm(false);
            }}
            className="inline-flex items-center justify-center rounded-full border border-slate-600 px-3 py-1.5 text-[11px] font-semibold text-slate-200 hover:bg-slate-800"
          >
            Huỷ
          </button>
        </div>
        </div>
      )}
      {loading && <p className="text-xs text-slate-300">Đang tải dữ liệu...</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="mt-3 space-y-2 text-xs">
        {items.map((job) => {
          return (
            <div
              key={job._id}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
            >
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-slate-50 line-clamp-1">
                  {job.title || "Không có tiêu đề"}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {job.location || "Không rõ địa điểm"}
                </p>
              </div>
              <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => startEdit(job)}
                className="rounded-full border border-sky-500/70 px-2 py-1 text-[11px] text-sky-300 hover:bg-sky-500/10"
              >
                Sửa
              </button>
                <button
                  type="button"
                onClick={() => setSelectedJob(job)}
                className="rounded-full border border-emerald-500/70 px-2 py-1 text-[11px] text-emerald-300 hover:bg-emerald-500/10"
                >
                Xem chi tiết / Upload CV
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(job._id)}
                  className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-red-400 hover:text-red-300"
                >
                  Xoá
                </button>
              </div>
            </div>
          );
        })}
        {!loading && !items.length && (
          <p className="text-xs text-slate-400">Chưa có tin tuyển dụng nào.</p>
        )}
      </div>
    </section>
  );
};

const TicketsAdmin: React.FC = () => {
  const [items, setItems] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchTickets({ page: 1, limit: 50 });
        setItems(data);
      } catch {
        setError("Không tải được danh sách tickets.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = async () => {
    if (!fullName.trim() || !phone.trim() || !email.trim() || !description.trim()) {
      notifyError("Vui lòng nhập đầy đủ họ tên, số điện thoại, email và mô tả.");
      return;
    }
    try {
      setCreating(true);

      if (!editingId) {
        // tạo mới
        await createTicket({
          fullname: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          description: description.trim(),
        });
      } else {
        // cập nhật mô tả + trạng thái
        await updateTicket(editingId, {
          description: description.trim(),
        });
      }
      setFullName("");
      setPhone("");
      setEmail("");
      setEditingId(null);
      setDescription("");
      // reload danh sách nhanh
      const data = await fetchTickets({ page: 1, limit: 50 });
      setItems(data);
    } catch {
      notifyError(editingId ? "Cập nhật ticket thất bại." : "Tạo ticket thất bại.");
    } finally {
      setCreating(false);
    }
  };

  const handleMarkProcessed = async (id: string) => {
    try {
      const updated = await updateTicket(id, { status: "resolved" });
      setItems((prev) => prev.map((t) => (t._id === id ? updated : t)));
    } catch {
      notifyError("Cập nhật trạng thái ticket thất bại.");
    }
  };

  const startEdit = (t: Ticket) => {
    setEditingId(t._id);
    setFullName(t.fullname);
    setPhone(t.phone);
    setEmail(t.email);
    setDescription(t.description);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá ticket này?")) return;
    try {
      await deleteTicket(id);
      setItems((prev) => prev.filter((t) => t._id !== id));
    } catch {
      notifyError("Xoá ticket thất bại.");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-50">Quản lý tickets</h2>
          <p className="mt-1 text-xs text-slate-400">
            Danh sách lấy từ API `/tickets`. Có thể đánh dấu đã xử lý hoặc xoá.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center justify-center rounded-full border border-sky-500/60 px-3 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/10"
        >
          {showForm ? "Đóng form" : "Thêm ticket"}
        </button>
      </div>
      {showForm && (
        <div className="mb-4 space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <p className="font-semibold text-slate-50">
            {editingId ? "Sửa ticket" : "Tạo ticket mới"}
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Họ và tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <textarea
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            rows={3}
            placeholder="Mô tả nhu cầu / vấn đề cần hỗ trợ"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="button"
            disabled={creating}
            onClick={handleCreate}
            className="inline-flex items-center justify-center rounded-full bg-ahv-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-sky-500/40 hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating
              ? editingId
                ? "Đang lưu..."
                : "Đang tạo..."
              : editingId
              ? "Lưu thay đổi"
              : "Lưu ticket"}
          </button>
        </div>
      )}
      {loading && <p className="text-xs text-slate-300">Đang tải dữ liệu...</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="mt-3 space-y-2 text-xs">
        {items.map((t) => (
          <div
            key={t._id}
            className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-50 line-clamp-1">
                  {t.fullname} · {t.phone}
                </p>
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                  {t.description}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Trạng thái:{" "}
                  <span className="text-sky-300">
                    {t.status || "open"}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(t)}
                  className="rounded-full border border-sky-500/60 px-2 py-1 text-[11px] text-sky-300 hover:bg-sky-500/10"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkProcessed(t._id)}
                  className="rounded-full border border-emerald-500/60 px-2 py-1 text-[11px] text-emerald-300 hover:bg-emerald-500/10"
                >
                  Đánh dấu resolved
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t._id)}
                  className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-red-400 hover:text-red-300"
                >
                  Xoá
                </button>
              </div>
            </div>
          </div>
        ))}
        {!loading && !items.length && (
          <p className="text-xs text-slate-400">Chưa có ticket nào.</p>
        )}
      </div>
    </section>
  );
};

const CategoriesAdmin: React.FC = () => {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchCategories({ page: 1, limit: 50 });
        setItems(data);
      } catch {
        setError("Không tải được danh sách category.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) {
      notifyError("Vui lòng nhập tên category.");
      return;
    }
    try {
      setCreating(true);
      const created = await createCategory({
        name: newName.trim(),
        description: newDescription.trim() || undefined,
        status: newStatus.trim() || undefined,
      });
      setItems((prev) => [created, ...prev]);
      setNewName("");
      setNewDescription("");
      setNewStatus("");
    } catch {
      notifyError("Tạo category thất bại.");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditDescription(cat.description || "");
    setEditStatus(cat.status || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
    setEditStatus("");
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) {
      notifyError("Tên category không được để trống.");
      return;
    }
    try {
      const updated = await updateCategory(id, {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        status: editStatus.trim() || undefined,
      });
      setItems((prev) => prev.map((c) => (c._id === id ? updated : c)));
      cancelEdit();
    } catch {
      notifyError("Cập nhật category thất bại.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá category này?")) return;
    try {
      await deleteCategory(id);
      setItems((prev) => prev.filter((c) => c._id !== id));
    } catch {
      notifyError("Xoá category thất bại.");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-50">Quản lý Category</h2>
          <p className="mt-1 text-xs text-slate-400">
            Danh sách danh mục bài viết từ API `/categories`.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center justify-center rounded-full border border-sky-500/60 px-3 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/10"
        >
          {showForm ? "Đóng form" : "Thêm category"}
        </button>
      </div>
      {showForm && (
        <div className="mb-4 space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <p className="font-semibold text-slate-50">Tạo category mới</p>
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Tên category"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Mô tả (tuỳ chọn)"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Trạng thái (status - tuỳ chọn)"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          />
          <button
            type="button"
            disabled={creating}
            onClick={handleCreate}
            className="inline-flex items-center justify-center rounded-full bg-ahv-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-sky-500/40 hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Đang tạo..." : "Lưu category"}
          </button>
        </div>
      )}
      {loading && <p className="text-xs text-slate-300">Đang tải dữ liệu...</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="mt-3 space-y-2 text-xs">
        {items.map((cat) => {
          const isEditing = editingId === cat._id;
          return (
            <div
              key={cat._id}
              className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
            >
              <div className="flex-1 space-y-1">
                {isEditing ? (
                  <>
                    <input
                      className="block w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <input
                      className="block w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Mô tả"
                    />
                    <input
                      className="block w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      placeholder="Trạng thái"
                    />
                  </>
                ) : (
                  <>
                    <p className="font-semibold text-slate-50 line-clamp-1">
                      {cat.name}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                      {cat.description || "Không có mô tả"}
                    </p>
                    {cat.status && (
                      <p className="mt-1 text-[11px] text-slate-500">
                        Trạng thái: <span className="text-sky-300">{cat.status}</span>
                      </p>
                    )}
                  </>
                )}
              </div>
              <div className="flex flex-col gap-1">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => saveEdit(cat._id)}
                      className="rounded-full border border-emerald-500/70 px-2 py-1 text-[11px] text-emerald-300 hover:bg-emerald-500/10"
                    >
                      Lưu
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:bg-slate-800"
                    >
                      Huỷ
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => startEdit(cat)}
                      className="rounded-full border border-sky-500/70 px-2 py-1 text-[11px] text-sky-300 hover:bg-sky-500/10"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat._id)}
                      className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-red-400 hover:text-red-300"
                    >
                      Xoá
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
        {!loading && !items.length && (
          <p className="text-xs text-slate-400">Chưa có category nào.</p>
        )}
      </div>
    </section>
  );
};

const CoreValuesAdmin: React.FC = () => {
  const [items, setItems] = useState<CoreValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [order, setOrder] = useState("");
  const [status, setStatus] = useState("");
  const [iconUploading, setIconUploading] = useState(false);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await fetchCoreValues();
      setItems(data);
    } catch {
      setError("Không tải được danh sách giá trị cốt lõi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setIcon("");
    setOrder("");
    setStatus("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      notifyError("Vui lòng nhập tiêu đề.");
      return;
    }
    if (!description.trim()) {
      notifyError("Vui lòng nhập mô tả giá trị cốt lõi.");
      return;
    }
    const parsedOrder = order.trim() ? Number.parseInt(order.trim(), 10) : undefined;
    if (order.trim() && Number.isNaN(parsedOrder)) {
      notifyError("Thứ tự phải là số nguyên.");
      return;
    }
    try {
      setCreating(true);
      if (!editingId) {
        const created = await createCoreValue({
          title: title.trim(),
          description: description.trim(),
          icon: icon.trim() || undefined,
          order: parsedOrder,
          status: status.trim() || undefined,
        });
        // Sau khi thêm mới, refetch toàn bộ để đồng bộ dữ liệu & thứ tự
        await loadItems();
      } else {
        const updated = await updateCoreValue(editingId, {
          title: title.trim(),
          description: description.trim(),
          icon: icon.trim() || undefined,
          order: parsedOrder,
          status: status.trim() || undefined,
        });
        // Sau khi cập nhật, refetch lại danh sách
        await loadItems();
      }
      resetForm();
      setShowForm(false);
    } catch {
      notifyError(editingId ? "Cập nhật giá trị cốt lõi thất bại." : "Tạo giá trị cốt lõi thất bại.");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (item: CoreValue) => {
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description || "");
    setIcon(item.icon || "");
    setOrder(
      typeof item.order === "number" && !Number.isNaN(item.order)
        ? String(item.order)
        : ""
    );
    setStatus(item.status || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá giá trị này?")) return;
    try {
      await deleteCoreValue(id);
      setItems((prev) => prev.filter((v) => v._id !== id));
      notifySuccess("Đã xoá giá trị cốt lõi.");
    } catch {
      notifyError("Xoá giá trị cốt lõi thất bại.");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-50">Giá trị cốt lõi</h2>
          <p className="mt-1 text-xs text-slate-400">
            Dữ liệu lấy từ API `/core-values` để hiển thị trên trang chủ.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!showForm) resetForm();
            setShowForm((v) => !v);
          }}
          className="inline-flex items-center justify-center rounded-full border border-sky-500/60 px-3 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/10"
        >
          {showForm ? "Đóng form" : "Thêm giá trị"}
        </button>
      </div>
      {showForm && (
        <div className="mb-4 space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <p className="font-semibold text-slate-50">
            {editingId ? "Sửa giá trị cốt lõi" : "Thêm giá trị cốt lõi"}
          </p>
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            rows={3}
            placeholder="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Icon URL (tuỳ chọn)"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="block w-full rounded-lg border border-dashed border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-400 outline-none file:mr-2 file:rounded-md file:border-0 file:bg-slate-800 file:px-2 file:py-1 file:text-[11px] file:text-slate-50 hover:border-slate-500"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
              const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
              if (!cloudName || !uploadPreset) {
                notifyError(
                  "Thiếu cấu hình Cloudinary (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)."
                );
                return;
              }
              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", uploadPreset);
              setIconUploading(true);
              try {
                const res = await fetch(
                  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                  {
                    method: "POST",
                    body: formData,
                  }
                );
                const data = await res.json();
                if (!res.ok) {
                  throw new Error(data?.error?.message || "Upload icon thất bại");
                }
                setIcon(data.secure_url as string);
              } catch (err) {
                notifyError((err as Error).message);
              } finally {
                setIconUploading(false);
              }
            }}
          />
          {iconUploading && (
            <p className="text-[11px] text-slate-400">Đang upload icon lên Cloudinary...</p>
          )}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Thứ tự hiển thị (order - tuỳ chọn)"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Trạng thái (status - tuỳ chọn)"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <button
            type="button"
            disabled={creating}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-full bg-ahv-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-sky-500/40 hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Đang lưu..." : editingId ? "Cập nhật" : "Lưu giá trị"}
          </button>
        </div>
      )}
      {loading && <p className="text-xs text-slate-300">Đang tải dữ liệu...</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="mt-3 space-y-2 text-xs">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-sky-300">
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="h-8 w-8 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold">
                      {item.title
                        .split(" ")
                        .slice(0, 2)
                        .map((p) => p.charAt(0))
                        .join("")}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-50 line-clamp-1">{item.title}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    {typeof item.order === "number" && (
                      <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
                        Thứ tự: {item.order}
                      </span>
                    )}
                    {item.status && (
                      <span className="rounded-full border border-emerald-600/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {item.description && (
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="rounded-full border border-sky-500/70 px-2 py-1 text-[11px] text-sky-300 hover:bg-sky-500/10"
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item._id)}
                className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-red-400 hover:text-red-300"
              >
                Xoá
              </button>
            </div>
          </div>
        ))}
        {!loading && !items.length && (
          <p className="text-xs text-slate-400">Chưa có giá trị nào.</p>
        )}
      </div>
    </section>
  );
};

const FeaturedProjectsAdmin: React.FC = () => {
  const [items, setItems] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [customer, setCustomer] = useState("");
  const [industry, setIndustry] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [link, setLink] = useState("");
  const [order, setOrder] = useState("");
  const [status, setStatus] = useState("");

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await fetchFeaturedProjects();
      setItems(data);
    } catch {
      setError("Không tải được danh sách dự án tiêu biểu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setCustomer("");
    setIndustry("");
    setThumbnailUrl("");
    setLink("");
    setOrder("");
    setStatus("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      notifyError("Vui lòng nhập tên dự án.");
      return;
    }
    const parsedOrder = order.trim() ? Number.parseInt(order.trim(), 10) : undefined;
    if (order.trim() && Number.isNaN(parsedOrder)) {
      notifyError("Thứ tự phải là số nguyên.");
      return;
    }
    try {
      setCreating(true);
      if (!editingId) {
        await createFeaturedProject({
          name: name.trim(),
          description: description.trim(),
          customer: customer.trim() || null,
          industry: industry.trim() || null,
          thumbnailUrl: thumbnailUrl.trim() || null,
          link: link.trim() || null,
          order: parsedOrder,
          status: status.trim() || undefined,
        });
      } else {
        await updateFeaturedProject(editingId, {
          name: name.trim(),
          description: description.trim(),
          customer: customer.trim() || null,
          industry: industry.trim() || null,
          thumbnailUrl: thumbnailUrl.trim() || null,
          link: link.trim() || null,
          order: parsedOrder,
          status: status.trim() || undefined,
        });
      }
      await loadItems();
      resetForm();
      setShowForm(false);
    } catch {
      notifyError(editingId ? "Cập nhật dự án tiêu biểu thất bại." : "Tạo dự án tiêu biểu thất bại.");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (item: FeaturedProject) => {
    setEditingId(item._id);
    setName(item.name);
    setDescription(item.description || "");
    setCustomer(item.customer || "");
    setIndustry(item.industry || "");
    setThumbnailUrl(item.thumbnailUrl || "");
    setLink(item.link || "");
    setOrder(
      typeof item.order === "number" && !Number.isNaN(item.order) ? String(item.order) : ""
    );
    setStatus(item.status || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá dự án này?")) return;
    try {
      await deleteFeaturedProject(id);
      setItems((prev) => prev.filter((v) => v._id !== id));
      notifySuccess("Đã xoá dự án tiêu biểu.");
    } catch {
      notifyError("Xoá dự án tiêu biểu thất bại.");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-50">Dự án tiêu biểu</h2>
          <p className="mt-1 text-xs text-slate-400">
            Dữ liệu lấy từ API `/featured-projects` để hiển thị phần dự án trên trang chủ.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!showForm) resetForm();
            setShowForm((v) => !v);
          }}
          className="inline-flex items-center justify-center rounded-full border border-sky-500/60 px-3 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/10"
        >
          {showForm ? "Đóng form" : "Thêm dự án"}
        </button>
      </div>

      {showForm && (
        <div className="mb-4 space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <p className="font-semibold text-slate-50">
            {editingId ? "Sửa dự án tiêu biểu" : "Thêm dự án tiêu biểu"}
          </p>
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Tên dự án"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Tên khách hàng (tuỳ chọn)"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />
          <textarea
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            rows={3}
            placeholder="Mô tả dự án"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Lĩnh vực / ngành (industry - tuỳ chọn)"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
          />
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">Thumbnail (upload ảnh)</span>
            {thumbnailUrl && (
              <div className="flex items-center gap-2">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail"
                  className="h-14 w-14 rounded object-cover"
                />
                <button
                  type="button"
                  onClick={() => setThumbnailUrl("")}
                  className="text-[11px] text-red-400 hover:underline"
                >
                  Xoá ảnh
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="block w-full rounded-lg border border-dashed border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-400 outline-none file:mr-2 file:rounded-md file:border-0 file:bg-slate-800 file:px-2 file:py-1 file:text-[11px] file:text-slate-50 hover:border-slate-500"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
                const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
                if (!cloudName || !uploadPreset) {
                  notifyError(
                    "Thiếu cấu hình Cloudinary (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)."
                  );
                  return;
                }
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);
                setThumbnailUploading(true);
                try {
                  const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    { method: "POST", body: formData }
                  );
                  const data = await res.json();
                  if (!res.ok) {
                    throw new Error(data?.error?.message || "Upload thumbnail thất bại");
                  }
                  setThumbnailUrl(data.secure_url as string);
                } catch (err) {
                  notifyError((err as Error).message);
                } finally {
                  setThumbnailUploading(false);
                }
                e.target.value = "";
              }}
            />
            {thumbnailUploading && (
              <p className="text-[11px] text-slate-400">Đang upload thumbnail lên Cloudinary...</p>
            )}
          </div>
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Link chi tiết (tuỳ chọn)"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Thứ tự hiển thị (order - tuỳ chọn)"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Trạng thái (status - tuỳ chọn)"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <button
            type="button"
            disabled={creating}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-full bg-ahv-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-sky-500/40 hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Đang lưu..." : editingId ? "Cập nhật" : "Lưu dự án"}
          </button>
        </div>
      )}

      {loading && <p className="text-xs text-slate-300">Đang tải dữ liệu...</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="mt-3 space-y-2 text-xs">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
          >
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-slate-50">{item.name}</p>
              {item.customer && (
                <p className="text-[11px] text-slate-300">Khách hàng: {item.customer}</p>
              )}
              {item.industry && (
                <p className="text-[11px] uppercase tracking-[0.16em] text-sky-400">
                  {item.industry}
                </p>
              )}
              {item.description && (
                <p className="text-[11px] leading-relaxed text-slate-400 line-clamp-2">
                  {item.description}
                </p>
              )}
              {item.link && (
                <p className="text-[11px] text-emerald-400 break-all">
                  Link: {item.link}
                </p>
              )}
              {(typeof item.order === "number" || item.status) && (
                <p className="text-[11px] text-slate-500">
                  {typeof item.order === "number" && `Order: ${item.order}`}
                  {typeof item.order === "number" && item.status ? " · " : ""}
                  {item.status}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-1">
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="rounded-full border border-slate-600 px-2 py-1 text-[11px] text-slate-100 hover:border-sky-400 hover:text-sky-300"
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item._id)}
                className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-red-400 hover:text-red-300"
              >
                Xoá
              </button>
            </div>
          </div>
        ))}
        {!loading && !items.length && !error && (
          <p className="text-xs text-slate-400">Chưa có dự án tiêu biểu nào.</p>
        )}
      </div>
    </section>
  );
};

const MilestonesAdmin: React.FC = () => {
  const [items, setItems] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");
  const [status, setStatus] = useState("");

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await fetchMilestones();
      setItems(data);
    } catch {
      setError("Không tải được danh sách cột mốc.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDate("");
    setDescription("");
    setOrder("");
    setStatus("");
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      notifyError("Vui lòng nhập tiêu đề cột mốc.");
      return;
    }
    if (!description.trim()) {
      notifyError("Vui lòng nhập mô tả cột mốc.");
      return;
    }
    if (!date.trim()) {
      notifyError("Vui lòng nhập năm cột mốc.");
      return;
    }
    const parsedYear = Number.parseInt(date.trim(), 10);
    if (Number.isNaN(parsedYear)) {
      notifyError("Năm phải là số nguyên.");
      return;
    }
    try {
      setCreating(true);
      if (!editingId) {
        const created = await createMilestone({
          title: title.trim(),
          description: description.trim(),
          date: parsedYear,
          order: order.trim() ? Number.parseInt(order.trim(), 10) : undefined,
          status: status.trim() || undefined,
        });
        await loadItems();
      } else {
        const updated = await updateMilestone(editingId, {
          title: title.trim(),
          description: description.trim(),
          date: parsedYear,
          order: order.trim() ? Number.parseInt(order.trim(), 10) : undefined,
          status: status.trim() || undefined,
        });
        await loadItems();
      }
      resetForm();
      setShowForm(false);
    } catch {
      notifyError(editingId ? "Cập nhật cột mốc thất bại." : "Tạo cột mốc thất bại.");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (item: Milestone) => {
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description || "");
    setDate(item.date ? String(item.date) : "");
    setOrder(
      typeof item.order === "number" && !Number.isNaN(item.order)
        ? String(item.order)
        : ""
    );
    setStatus(item.status || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá cột mốc này?")) return;
    try {
      await deleteMilestone(id);
      setItems((prev) => prev.filter((m) => m._id !== id));
      notifySuccess("Đã xoá cột mốc.");
    } catch {
      notifyError("Xoá cột mốc thất bại.");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-50">Cột mốc quan trọng</h2>
          <p className="mt-1 text-xs text-slate-400">
            Dữ liệu lấy từ API `/milestones` để hiển thị trên trang chủ.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!showForm) resetForm();
            setShowForm((v) => !v);
          }}
          className="inline-flex items-center justify-center rounded-full border border-sky-500/60 px-3 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/10"
        >
          {showForm ? "Đóng form" : "Thêm cột mốc"}
        </button>
      </div>
      {showForm && (
        <div className="mb-4 space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <p className="font-semibold text-slate-50">
            {editingId ? "Sửa cột mốc" : "Thêm cột mốc"}
          </p>
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Tiêu đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Năm (1900 - 2100)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Thứ tự hiển thị (order - tuỳ chọn)"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Trạng thái (status - tuỳ chọn)"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <textarea
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            rows={3}
            placeholder="Mô tả (tuỳ chọn)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="button"
            disabled={creating}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-full bg-ahv-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-sky-500/40 hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Đang lưu..." : editingId ? "Cập nhật" : "Lưu cột mốc"}
          </button>
        </div>
      )}
      {loading && <p className="text-xs text-slate-300">Đang tải dữ liệu...</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="mt-3 space-y-2 text-xs">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
          >
            <div className="flex-1 space-y-1">
              <p className="font-semibold text-slate-50 line-clamp-1">{item.title}</p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                {typeof item.date === "number" && (
                  <span className="font-semibold text-sky-300">{item.date}</span>
                )}
                {typeof item.order === "number" && (
                  <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
                    Thứ tự: {item.order}
                  </span>
                )}
                {item.status && (
                  <span className="rounded-full border border-emerald-600/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                    {item.status}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="rounded-full border border-sky-500/70 px-2 py-1 text-[11px] text-sky-300 hover:bg-sky-500/10"
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item._id)}
                className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-red-400 hover:text-red-300"
              >
                Xoá
              </button>
            </div>
          </div>
        ))}
        {!loading && !items.length && (
          <p className="text-xs text-slate-400">Chưa có cột mốc nào.</p>
        )}
      </div>
    </section>
  );
};

const ManagementAdmin: React.FC = () => {
  const [items, setItems] = useState<ManagementMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState("");
  const [status, setStatus] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await fetchManagementMembers();
      setItems(data);
    } catch {
      setError("Không tải được danh sách ban lãnh đạo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPosition("");
    setAvatarUrl("");
    setDescription("");
    setOrder("");
    setStatus("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      notifyError("Vui lòng nhập họ tên.");
      return;
    }
    if (!position.trim()) {
      notifyError("Vui lòng nhập chức vụ.");
      return;
    }
    const parsedOrder = order.trim() ? Number.parseInt(order.trim(), 10) : undefined;
    if (order.trim() && Number.isNaN(parsedOrder)) {
      notifyError("Thứ tự phải là số nguyên.");
      return;
    }
    try {
      setCreating(true);
      if (!editingId) {
        const created = await createManagementMember({
          name: name.trim(),
          position: position.trim(),
          avatarUrl: avatarUrl.trim() || undefined,
          description: description.trim() || undefined,
          order: parsedOrder,
          status: status.trim() || undefined,
        });
        await loadItems();
      } else {
        const updated = await updateManagementMember(editingId, {
          name: name.trim(),
          position: position.trim(),
          avatarUrl: avatarUrl.trim() || undefined,
          description: description.trim() || undefined,
          order: parsedOrder,
          status: status.trim() || undefined,
        });
        await loadItems();
      }
      resetForm();
      setShowForm(false);
    } catch {
      notifyError(editingId ? "Cập nhật lãnh đạo thất bại." : "Tạo lãnh đạo thất bại.");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (item: ManagementMember) => {
    setEditingId(item._id);
    setName(item.name);
    setPosition(item.position || "");
    setAvatarUrl(item.avatarUrl || "");
    setDescription(item.description || "");
    setOrder(
      typeof item.order === "number" && !Number.isNaN(item.order)
        ? String(item.order)
        : ""
    );
    setStatus(item.status || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá lãnh đạo này?")) return;
    try {
      await deleteManagementMember(id);
      setItems((prev) => prev.filter((m) => m._id !== id));
      notifySuccess("Đã xoá lãnh đạo.");
    } catch {
      notifyError("Xoá lãnh đạo thất bại.");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-50">Ban lãnh đạo</h2>
          <p className="mt-1 text-xs text-slate-400">
            Dữ liệu lấy từ API `/management-members` để hiển thị trên trang chủ.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!showForm) resetForm();
            setShowForm((v) => !v);
          }}
          className="inline-flex items-center justify-center rounded-full border border-sky-500/60 px-3 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/10"
        >
          {showForm ? "Đóng form" : "Thêm lãnh đạo"}
        </button>
      </div>
      {showForm && (
        <div className="mb-4 space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <p className="font-semibold text-slate-50">
            {editingId ? "Sửa thông tin lãnh đạo" : "Thêm lãnh đạo"}
          </p>
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Chức vụ"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Avatar URL (tuỳ chọn)"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="block w-full rounded-lg border border-dashed border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-400 outline-none file:mr-2 file:rounded-md file:border-0 file:bg-slate-800 file:px-2 file:py-1 file:text-[11px] file:text-slate-50 hover:border-slate-500"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
              const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
              if (!cloudName || !uploadPreset) {
                notifyError(
                  "Thiếu cấu hình Cloudinary (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)."
                );
                return;
              }
              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", uploadPreset);
              setAvatarUploading(true);
              try {
                const res = await fetch(
                  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                  {
                    method: "POST",
                    body: formData,
                  }
                );
                const data = await res.json();
                if (!res.ok) {
                  throw new Error(data?.error?.message || "Upload avatar thất bại");
                }
                setAvatarUrl(data.secure_url as string);
              } catch (err) {
                notifyError((err as Error).message);
              } finally {
                setAvatarUploading(false);
              }
            }}
          />
          {avatarUploading && (
            <p className="text-[11px] text-slate-400">Đang upload avatar lên Cloudinary...</p>
          )}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Thứ tự hiển thị (order - tuỳ chọn)"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Trạng thái (status - tuỳ chọn)"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <textarea
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            rows={3}
            placeholder="Mô tả (tuỳ chọn)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            type="button"
            disabled={creating}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-full bg-ahv-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-sky-500/40 hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Đang lưu..." : editingId ? "Cập nhật" : "Lưu lãnh đạo"}
          </button>
        </div>
      )}
      {loading && <p className="text-xs text-slate-300">Đang tải dữ liệu...</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="mt-3 space-y-2 text-xs">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                {item.avatarUrl && (
                  <img
                    src={item.avatarUrl}
                    alt={item.name}
                    className="h-9 w-9 flex-shrink-0 rounded-full border border-slate-700 object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-slate-50 line-clamp-1">{item.name}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    <span className="text-sky-300">{item.position}</span>
                    {typeof item.order === "number" && (
                      <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
                        Thứ tự: {item.order}
                      </span>
                    )}
                    {item.status && (
                      <span className="rounded-full border border-emerald-600/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {item.description && (
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="rounded-full border border-sky-500/70 px-2 py-1 text-[11px] text-sky-300 hover:bg-sky-500/10"
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item._id)}
                className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-red-400 hover:text-red-300"
              >
                Xoá
              </button>
            </div>
          </div>
        ))}
        {!loading && !items.length && (
          <p className="text-xs text-slate-400">Chưa có lãnh đạo nào.</p>
        )}
      </div>
    </section>
  );
};

const OperatingFieldsAdmin: React.FC = () => {
  const [items, setItems] = useState<OperatingField[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [order, setOrder] = useState("");
  const [status, setStatus] = useState("");
  const [iconUploading, setIconUploading] = useState(false);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await fetchOperatingFields();
      setItems(data);
    } catch {
      setError("Không tải được danh sách lĩnh vực hoạt động.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setIcon("");
    setOrder("");
    setStatus("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      notifyError("Vui lòng nhập tên lĩnh vực.");
      return;
    }
    if (!description.trim()) {
      notifyError("Vui lòng nhập mô tả lĩnh vực hoạt động.");
      return;
    }
    const parsedOrder = order.trim() ? Number.parseInt(order.trim(), 10) : undefined;
    if (order.trim() && Number.isNaN(parsedOrder)) {
      notifyError("Thứ tự phải là số nguyên.");
      return;
    }
    try {
      setCreating(true);
      if (!editingId) {
        const created = await createOperatingField({
          name: name.trim(),
          description: description.trim(),
          icon: icon.trim() || undefined,
          order: parsedOrder,
          status: status.trim() || undefined,
        });
        await loadItems();
      } else {
        const updated = await updateOperatingField(editingId, {
          name: name.trim(),
          description: description.trim(),
          icon: icon.trim() || undefined,
          order: parsedOrder,
          status: status.trim() || undefined,
        });
        await loadItems();
      }
      resetForm();
      setShowForm(false);
    } catch {
      notifyError(editingId ? "Cập nhật lĩnh vực thất bại." : "Tạo lĩnh vực thất bại.");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (item: OperatingField) => {
    setEditingId(item._id);
    setName(item.name);
    setDescription(item.description || "");
    setIcon(item.icon || "");
    setOrder(
      typeof item.order === "number" && !Number.isNaN(item.order)
        ? String(item.order)
        : ""
    );
    setStatus(item.status || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá lĩnh vực này?")) return;
    try {
      await deleteOperatingField(id);
      setItems((prev) => prev.filter((f) => f._id !== id));
      notifySuccess("Đã xoá lĩnh vực.");
    } catch {
      notifyError("Xoá lĩnh vực thất bại.");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-50">Lĩnh vực hoạt động</h2>
          <p className="mt-1 text-xs text-slate-400">
            Dữ liệu lấy từ API `/operating-fields` để hiển thị trên trang chủ.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!showForm) resetForm();
            setShowForm((v) => !v);
          }}
          className="inline-flex items-center justify-center rounded-full border border-sky-500/60 px-3 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/10"
        >
          {showForm ? "Đóng form" : "Thêm lĩnh vực"}
        </button>
      </div>
      {showForm && (
        <div className="mb-4 space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <p className="font-semibold text-slate-50">
            {editingId ? "Sửa lĩnh vực hoạt động" : "Thêm lĩnh vực hoạt động"}
          </p>
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Tên lĩnh vực"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            rows={3}
            placeholder="Mô tả"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Icon URL (tuỳ chọn)"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="block w-full rounded-lg border border-dashed border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-400 outline-none file:mr-2 file:rounded-md file:border-0 file:bg-slate-800 file:px-2 file:py-1 file:text-[11px] file:text-slate-50 hover:border-slate-500"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
              const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
              if (!cloudName || !uploadPreset) {
                notifyError(
                  "Thiếu cấu hình Cloudinary (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)."
                );
                return;
              }
              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", uploadPreset);
              setIconUploading(true);
              try {
                const res = await fetch(
                  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                  {
                    method: "POST",
                    body: formData,
                  }
                );
                const data = await res.json();
                if (!res.ok) {
                  throw new Error(data?.error?.message || "Upload icon thất bại");
                }
                setIcon(data.secure_url as string);
              } catch (err) {
                notifyError((err as Error).message);
              } finally {
                setIconUploading(false);
              }
            }}
          />
          {iconUploading && (
            <p className="text-[11px] text-slate-400">Đang upload icon lên Cloudinary...</p>
          )}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Thứ tự hiển thị (order - tuỳ chọn)"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Trạng thái (status - tuỳ chọn)"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <button
            type="button"
            disabled={creating}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-full bg-ahv-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-sky-500/40 hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Đang lưu..." : editingId ? "Cập nhật" : "Lưu lĩnh vực"}
          </button>
        </div>
      )}
      {loading && <p className="text-xs text-slate-300">Đang tải dữ liệu...</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="mt-3 space-y-2 text-xs">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-sky-300">
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt={item.name}
                      className="h-8 w-8 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold">
                      {item.name
                        .split(" ")
                        .slice(0, 2)
                        .map((p) => p.charAt(0))
                        .join("")}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-50 line-clamp-1">{item.name}</p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                    {typeof item.order === "number" && (
                      <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
                        Thứ tự: {item.order}
                      </span>
                    )}
                    {item.status && (
                      <span className="rounded-full border border-emerald-600/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {item.description && (
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="rounded-full border border-sky-500/70 px-2 py-1 text-[11px] text-sky-300 hover:bg-sky-500/10"
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item._id)}
                className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-red-400 hover:text-red-300"
              >
                Xoá
              </button>
            </div>
          </div>
        ))}
        {!loading && !items.length && (
          <p className="text-xs text-slate-400">Chưa có lĩnh vực nào.</p>
        )}
      </div>
    </section>
  );
};

const CustomerFeedbacksAdmin: React.FC = () => {
  const [items, setItems] = useState<CustomerFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [position, setPosition] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [order, setOrder] = useState("");
  const [status, setStatus] = useState("");
  const [avatarUploading, setAvatarUploading] = useState(false);

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await fetchCustomerFeedbacks();
      setItems(data);
    } catch {
      setError("Không tải được danh sách phản hồi khách hàng.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setCustomerName("");
    setPosition("");
    setCompany("");
    setContent("");
    setAvatarUrl("");
    setOrder("");
    setStatus("");
  };

  const handleSubmit = async () => {
    if (!customerName.trim()) {
      notifyError("Vui lòng nhập tên khách hàng.");
      return;
    }
    if (!content.trim()) {
      notifyError("Vui lòng nhập nội dung phản hồi.");
      return;
    }
    const parsedOrder = order.trim() ? Number.parseInt(order.trim(), 10) : undefined;
    if (order.trim() && Number.isNaN(parsedOrder)) {
      notifyError("Thứ tự phải là số nguyên.");
      return;
    }
    try {
      setCreating(true);
      if (!editingId) {
        const created = await createCustomerFeedback({
          customerName: customerName.trim(),
          content: content.trim(),
          position: position.trim() || undefined,
          company: company.trim() || undefined,
          avatarUrl: avatarUrl.trim() || undefined,
          order: parsedOrder,
          status: status.trim() || undefined,
        });
        await loadItems();
      } else {
        const updated = await updateCustomerFeedback(editingId, {
          customerName: customerName.trim(),
          content: content.trim(),
          position: position.trim() || undefined,
          company: company.trim() || undefined,
          avatarUrl: avatarUrl.trim() || undefined,
          order: parsedOrder,
          status: status.trim() || undefined,
        });
        await loadItems();
      }
      resetForm();
      setShowForm(false);
    } catch {
      notifyError(editingId ? "Cập nhật phản hồi thất bại." : "Tạo phản hồi thất bại.");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (item: CustomerFeedback) => {
    setEditingId(item._id);
    setCustomerName(item.customerName || "");
    setPosition(item.position || "");
    setCompany(item.company || "");
    setContent(item.content || "");
    setAvatarUrl(item.avatarUrl || "");
    setOrder(
      typeof item.order === "number" && !Number.isNaN(item.order)
        ? String(item.order)
        : ""
    );
    setStatus(item.status || "");
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá phản hồi này?")) return;
    try {
      await deleteCustomerFeedback(id);
      setItems((prev) => prev.filter((f) => f._id !== id));
      notifySuccess("Đã xoá phản hồi.");
    } catch {
      notifyError("Xoá phản hồi thất bại.");
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-50">Phản hồi khách hàng</h2>
          <p className="mt-1 text-xs text-slate-400">
            Dữ liệu lấy từ API `/customer-feedbacks` để hiển thị trên trang chủ.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!showForm) resetForm();
            setShowForm((v) => !v);
          }}
          className="inline-flex items-center justify-center rounded-full border border-sky-500/60 px-3 py-1.5 text-[11px] font-semibold text-sky-300 hover:bg-sky-500/10"
        >
          {showForm ? "Đóng form" : "Thêm phản hồi"}
        </button>
      </div>
      {showForm && (
        <div className="mb-4 space-y-2 rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs">
          <p className="font-semibold text-slate-50">
            {editingId ? "Sửa phản hồi khách hàng" : "Thêm phản hồi khách hàng"}
          </p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Tên khách hàng"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Chức vụ (tuỳ chọn)"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Công ty (tuỳ chọn)"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <input
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            placeholder="Avatar URL (tuỳ chọn)"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="block w-full rounded-lg border border-dashed border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-400 outline-none file:mr-2 file:rounded-md file:border-0 file:bg-slate-800 file:px-2 file:py-1 file:text-[11px] file:text-slate-50 hover:border-slate-500"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
              const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
              if (!cloudName || !uploadPreset) {
                notifyError(
                  "Thiếu cấu hình Cloudinary (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)."
                );
                return;
              }
              const formData = new FormData();
              formData.append("file", file);
              formData.append("upload_preset", uploadPreset);
              setAvatarUploading(true);
              try {
                const res = await fetch(
                  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                  {
                    method: "POST",
                    body: formData,
                  }
                );
                const data = await res.json();
                if (!res.ok) {
                  throw new Error(data?.error?.message || "Upload avatar thất bại");
                }
                setAvatarUrl(data.secure_url as string);
              } catch (err) {
                notifyError((err as Error).message);
              } finally {
                setAvatarUploading(false);
              }
            }}
          />
          {avatarUploading && (
            <p className="text-[11px] text-slate-400">Đang upload avatar lên Cloudinary...</p>
          )}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Thứ tự hiển thị (order - tuỳ chọn)"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
            />
            <input
              className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
              placeholder="Trạng thái (status - tuỳ chọn)"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
          <textarea
            className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
            rows={3}
            placeholder="Nội dung phản hồi"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="button"
            disabled={creating}
            onClick={handleSubmit}
            className="inline-flex items-center justify-center rounded-full bg-ahv-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-sky-500/40 hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? "Đang lưu..." : editingId ? "Cập nhật" : "Lưu phản hồi"}
          </button>
        </div>
      )}
      {loading && <p className="text-xs text-slate-300">Đang tải dữ liệu...</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="mt-3 space-y-2 text-xs">
        {items.map((item) => (
          <div
            key={item._id}
            className="flex items-start justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
          >
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                {item.avatarUrl && (
                  <img
                    src={item.avatarUrl}
                    alt={item.customerName}
                    className="h-7 w-7 flex-shrink-0 rounded-full border border-slate-700 object-cover"
                  />
                )}
                <span className="font-semibold text-slate-50">
                  {item.customerName}
                </span>
                {item.position && <span className="text-sky-300">· {item.position}</span>}
                {item.company && <span className="text-slate-400">· {item.company}</span>}
                {typeof item.order === "number" && (
                  <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[10px] text-slate-300">
                    Thứ tự: {item.order}
                  </span>
                )}
                {item.status && (
                  <span className="rounded-full border border-emerald-600/60 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                    {item.status}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-slate-300 line-clamp-3">
                “{item.content}”
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => startEdit(item)}
                className="rounded-full border border-sky-500/70 px-2 py-1 text-[11px] text-sky-300 hover:bg-sky-500/10"
              >
                Sửa
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item._id)}
                className="rounded-full border border-slate-700 px-2 py-1 text-[11px] text-slate-200 hover:border-red-400 hover:text-red-300"
              >
                Xoá
              </button>
            </div>
          </div>
        ))}
        {!loading && !items.length && (
          <p className="text-xs text-slate-400">Chưa có phản hồi nào.</p>
        )}
      </div>
    </section>
  );
};

const CvsAdmin: React.FC = () => {
  const [items, setItems] = useState<Cv[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const normalizeUrl = (raw: string | null | undefined): string | null => {
    const v = (raw || "").trim();
    if (!v) return null;
    try {
      const u = new URL(v);
      return u.toString();
    } catch {
      // Trường hợp backend trả về thiếu scheme: "example.com/file.pdf"
      try {
        const u = new URL(`https://${v}`);
        return u.toString();
      } catch {
        return null;
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await fetchCvs({ page: 1, limit: 50 });
        setItems(data);
      } catch {
        setError("Không tải được danh sách CV.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      setUpdatingId(id);
      const updated = await updateCv(id, { status: "approve" });
      setItems((prev) => prev.map((c) => (c._id === id ? updated : c)));
    } catch {
      notifyError("Cập nhật trạng thái CV thất bại.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <h2 className="mb-3 text-sm font-semibold text-slate-50">Quản lý CV</h2>
      <p className="mb-3 text-xs text-slate-400">
        Danh sách lấy từ API `/cvs`. Có thể đánh dấu CV đã duyệt.
      </p>
      {loading && <p className="text-xs text-slate-300">Đang tải dữ liệu...</p>}
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="mt-3 space-y-2 text-xs">
        {items.map((cv) => (
          <div
            key={cv._id}
            className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2"
          >
            <p className="font-semibold text-slate-50 line-clamp-1">
              {cv.filePath}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              JD: {cv.jobDescriptionId || "Không rõ"}
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Trạng thái:{" "}
              <span className="text-sky-300">{cv.status || "new"}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  const url = normalizeUrl(cv.filePath);
                  if (!url) {
                    notifyError("Link CV không hợp lệ hoặc đang trống.");
                    return;
                  }
                  window.open(url, "_blank", "noopener,noreferrer");
                }}
                className="rounded-full border border-sky-500/70 px-2 py-1 text-[11px] text-sky-300 hover:bg-sky-500/10"
              >
                Xem CV
              </button>
              <button
                type="button"
                onClick={() => handleApprove(cv._id)}
                disabled={updatingId === cv._id}
                className="rounded-full border border-emerald-500/60 px-2 py-1 text-[11px] text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-60"
              >
                {updatingId === cv._id ? "Đang cập nhật..." : "Đánh dấu duyệt (approve)"}
              </button>
              <select
                className="rounded-full border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none focus:border-ahv-primary"
                value={cv.status || "new"}
                onChange={async (e) => {
                  const value = e.target.value as "new" | "reject" | "approve";
                  try {
                    setUpdatingId(cv._id);
                    const updated = await updateCv(cv._id, { status: value });
                    setItems((prev) =>
                      prev.map((c) => (c._id === cv._id ? updated : c))
                    );
                  } catch {
                    notifyError("Cập nhật trạng thái CV thất bại.");
                  } finally {
                    setUpdatingId(null);
                  }
                }}
              >
                <option value="new">new</option>
                <option value="reject">reject</option>
                <option value="approve">approve</option>
              </select>
            </div>
          </div>
        ))}
        {!loading && !items.length && (
          <p className="text-xs text-slate-400">Chưa có CV nào.</p>
        )}
      </div>
    </section>
  );
};

const UploadCvForJob: React.FC<{ job: JobDescription }> = ({ job }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const uploadToCloudinary = async (f: File) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      notifyError(
        "Thiếu cấu hình Cloudinary (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)."
      );
      return;
    }

    const formData = new FormData();
    formData.append("file", f);
    formData.append("upload_preset", uploadPreset);

    setUploading(true);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message || "Upload CV thất bại");
      }
      setFileUrl(data.secure_url as string);
    } catch (e) {
      notifyError((e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!fileUrl) {
      notifyError("Vui lòng upload CV trước.");
      return;
    }
    try {
      setSaving(true);
      await createCv({
        filePath: fileUrl,
        jobDescriptionId: job._id,
      });
      notifySuccess("Nộp CV thành công.");
      setFile(null);
      setFileUrl("");
    } catch {
      notifyError("Nộp CV thất bại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-50 space-y-2">
      <p className="font-semibold text-slate-50">
        Upload CV cho vị trí: <span className="text-sky-300">{job.title}</span>
      </p>
      <input
        type="file"
        accept=".pdf,.doc,.docx,.docm,.rtf"
        className="block w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-50 outline-none placeholder:text-slate-500 focus:border-ahv-primary"
        onChange={(e) => {
          const f = e.target.files?.[0] || null;
          setFile(f);
          if (f) {
            void uploadToCloudinary(f);
          } else {
            setFileUrl("");
          }
        }}
      />
      {uploading && (
        <p className="text-[11px] text-slate-400">Đang upload CV lên Cloudinary...</p>
      )}
      {fileUrl && (
        <p className="break-all text-[11px] text-slate-400">
          Link CV: <span className="text-sky-300">{fileUrl}</span>
        </p>
      )}
      <button
        type="button"
        disabled={saving || uploading}
        onClick={handleSubmit}
        className="inline-flex items-center justify-center rounded-full bg-ahv-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm shadow-sky-500/40 hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saving ? "Đang lưu..." : "Gửi CV"}
      </button>
    </div>
  );
};

export const AdminPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>("overview");
  const { userName } = useRequireAuth();

  const handleLogout = () => {
    clearAccessToken();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
              AHV HOLDING
            </p>
            <h1 className="text-sm font-semibold text-slate-50">
              Bảng điều khiển admin
            </h1>
            {userName && (
              <p className="mt-0.5 text-[11px] text-slate-400">
                Xin chào, {userName}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-100 border border-slate-700 hover:bg-slate-800"
          >
            Đăng xuất
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 inline-flex rounded-full border border-slate-800 bg-slate-900/70 p-1 text-xs">
          {[
            { key: "overview", label: "Tổng quan" },
            { key: "posts", label: "Bài viết (Posts)" },
            { key: "jobs", label: "Tuyển dụng (JDs)" },
            { key: "tickets", label: "Liên hệ (Tickets)" },
            { key: "cvs", label: "CVs" },
            { key: "categories", label: "Categories" },
            { key: "core-values", label: "Giá trị cốt lõi" },
            { key: "milestones", label: "Cột mốc" },
            { key: "management", label: "Ban lãnh đạo" },
            { key: "operating-fields", label: "Lĩnh vực" },
            { key: "customer-feedbacks", label: "Phản hồi KH" },
            { key: "featured-projects", label: "Dự án tiêu biểu" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key as TabKey)}
              className={`rounded-full px-3 py-1 transition ${
                tab === item.key
                  ? "bg-ahv-primary text-white shadow-sm shadow-sky-500/50"
                  : "text-slate-300 hover:text-sky-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4 space-y-6 text-sm">
          {tab === "overview" && (
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <h2 className="text-sm font-semibold text-slate-50">
                Tổng quan nhanh
              </h2>
              <p className="mt-2 text-xs text-slate-300">
                Đây là bản admin cơ bản cho landing page. Ở các tab bên cạnh,
                bạn có thể xem dữ liệu Posts, JDs và form Tickets lấy từ backend.
                Sau này có thể bổ sung tính năng tạo/sửa/xoá.
              </p>
              <ul className="mt-3 space-y-1 text-xs text-slate-400">
                <li>• Dữ liệu bài viết: API `/posts`</li>
                <li>• Dữ liệu tuyển dụng: API `/jds`</li>
                <li>• Dữ liệu liên hệ: API `/tickets` (cần backend list endpoint)</li>
              </ul>
            </section>
          )}

          {tab === "posts" && <PostsAdmin />}

          {tab === "jobs" && <JobsAdmin />}

          {tab === "tickets" && <TicketsAdmin />}

          {tab === "cvs" && <CvsAdmin />}

          {tab === "categories" && <CategoriesAdmin />}

          {tab === "core-values" && <CoreValuesAdmin />}

          {tab === "milestones" && <MilestonesAdmin />}

          {tab === "management" && <ManagementAdmin />}

          {tab === "operating-fields" && <OperatingFieldsAdmin />}

          {tab === "customer-feedbacks" && <CustomerFeedbacksAdmin />}

          {tab === "featured-projects" && <FeaturedProjectsAdmin />}
        </div>
      </main>
    </div>
  );
};

