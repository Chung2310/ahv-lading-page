import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { createCv, JobDescription, fetchJobs } from "../lib/api";
import { notifyError, notifySuccess } from "../lib/notify";
import { useInViewAnimation } from "../hooks/useInViewAnimation";

const UploadCvForJobPublic: React.FC<{ job: JobDescription; onBack: () => void }> = ({
  job,
  onBack,
}) => {
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
      notifySuccess("Nộp CV thành công, cảm ơn bạn!");
      setFile(null);
      setFileUrl("");
      onBack();
    } catch {
      notifyError("Nộp CV thất bại, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-6 rounded-3xl border border-slate-200 bg-white/90 p-5 text-xs text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold">
            Nộp CV cho vị trí: <span className="text-sky-600">{job.title}</span>
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Đính kèm CV của bạn, chúng tôi sẽ liên hệ khi phù hợp.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          ← Quay lại danh sách
        </button>
      </div>

      <div className="mt-4 space-y-2">
        <input
          type="file"
          accept=".pdf,.doc,.docx,.rtf"
          className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-[11px] text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500/60"
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
          <p className="text-[11px] text-slate-500">Đang upload CV lên Cloudinary...</p>
        )}
        {fileUrl && (
          <p className="break-all text-[11px] text-slate-500">
            Link CV: <span className="text-sky-600">{fileUrl}</span>
          </p>
        )}
        <button
          type="button"
          disabled={saving || uploading}
          onClick={handleSubmit}
        className="mt-1 inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-[11px] font-semibold text-white shadow-sm shadow-sky-500/40 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Đang gửi..." : "Gửi CV"}
        </button>
      </div>
    </div>
  );
};

export const Recruitment: React.FC<{ limit?: number; showApiNote?: boolean }> = ({
  limit = 3,
  showApiNote = true,
}) => {
  const { ref, animationClass } = useInViewAnimation();
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobDescription | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await fetchJobs({ page: 1, limit });
        if (mounted) {
          setJobs(data);
        }
      } catch (err) {
        if (mounted) {
          setError("Không tải được danh sách tuyển dụng. Vui lòng thử lại sau.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const hasJobs = jobs && jobs.length > 0;

  return (
    <section
      id="careers"
      ref={ref as React.RefObject<HTMLElement>}
      className={`border-b border-slate-200 bg-slate-50 transition-all duration-700 ease-out ${animationClass}`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              Cơ hội nghề nghiệp tại AHV Holding
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Chúng tôi tìm kiếm những thành viên muốn đồng hành cùng doanh nghiệp trong hành trình
              xây dựng hệ sinh thái tăng trưởng bằng công nghệ, dữ liệu và tư duy dài hạn.
            </p>
          </div>
          {showApiNote && (
            <p className="text-xs text-slate-500 md:text-right">
            </p>
          )}
        </div>

        {error && (
          <p className="mt-6 text-xs text-sky-600">
            {error}
          </p>
        )}

        {selectedJob ? (
          <div className="mt-8">
            <article className="rounded-3xl border border-slate-200 bg-white/90 p-6 text-sm text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
              <p className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                {selectedJob.location || "Vị trí"}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-slate-900">
                {selectedJob.title}
              </h3>
              {selectedJob.salary && (
                <p className="mt-1 text-xs text-slate-500">Lương: {selectedJob.salary}</p>
              )}
              <p className="mt-3 text-sm text-slate-700 whitespace-pre-line">
                {selectedJob.description}
              </p>
              {selectedJob.requirements && (
                <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">
                  <span className="font-semibold text-slate-900">Yêu cầu: </span>
                  {selectedJob.requirements}
                </p>
              )}
              {selectedJob.benefits && (
                <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">
                  <span className="font-semibold text-slate-900">Quyền lợi: </span>
                  {selectedJob.benefits}
                </p>
              )}
              {selectedJob.expiredAt && (
                <p className="mt-2 text-xs text-slate-500">
                  Hạn nộp:{" "}
                  {new Date(selectedJob.expiredAt).toLocaleDateString("vi-VN")}
                </p>
              )}
            </article>

            <UploadCvForJobPublic
              job={selectedJob}
              onBack={() => setSelectedJob(null)}
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {loading && !hasJobs
              ? Array.from({ length: 3 }).map((_, idx) => (
                <article
                  key={idx}
                  className="flex flex-col rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-sm animate-pulse"
                >
                  <div className="h-3 w-24 rounded-full bg-slate-200" />
                  <div className="mt-3 h-4 w-40 rounded bg-slate-200" />
                  <div className="mt-3 h-3 w-full rounded bg-slate-200" />
                  <div className="mt-2 h-3 w-3/4 rounded bg-slate-200" />
                </article>
              ))
              : hasJobs
              ? jobs.map((job) => (
                <article
                  key={job._id}
                  className="flex flex-col rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition"
                >
                  <p className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                    {job.location || "Vị trí"}
                  </p>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900 line-clamp-2">
                    {job.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {job.salary ? `Lương: ${job.salary}` : null}
                  </p>
                  <p className="mt-2 text-sm text-slate-600 line-clamp-4">
                    {job.description}
                  </p>
                  {job.expiredAt && (
                    <p className="mt-2 text-xs text-slate-500">
                      Hạn nộp: {new Date(job.expiredAt).toLocaleDateString("vi-VN")}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedJob(job)}
                    className="mt-3 inline-flex items-center justify-center rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1.5 text-[11px] font-semibold text-sky-700 hover:bg-sky-100"
                  >
                    Xem chi tiết &amp; Nộp CV
                  </button>
                </article>
              ))
              : null}
          </div>
        )}

        {!loading && !hasJobs && !error && !selectedJob && (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-6 text-center">
            <p className="text-sm font-medium text-slate-700">Chưa có vị trí tuyển dụng từ API.</p>
            <p className="mt-1 text-xs text-slate-500">
              Vui lòng kiểm tra endpoint `/api/v1/jds` hoặc thêm dữ liệu ở backend.
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <p>
            Bạn chưa thấy vị trí phù hợp? Gửi CV để chúng tôi lưu vào talent pool và liên hệ khi có
            cơ hội tương thích.
          </p>
          <Link
            to="/lien-he"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-sky-500/40 hover:bg-sky-700"
          >
            Gửi CV / Kết nối với AHV
          </Link>
        </div>
      </div>
    </section>
  );
};

