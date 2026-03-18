import React, { FormEvent, useEffect, useState } from "react";
import { getAccessToken, login } from "../lib/api";

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      window.location.href = "/admin";
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }

    try {
      setLoading(true);
      await login({ username: username.trim(), password: password.trim() });
      window.location.href = "/admin";
    } catch (err) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản/mật khẩu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-sky-500/20">
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            AHV HOLDING
          </p>
          <h1 className="mt-2 text-xl font-semibold">Đăng nhập admin</h1>
          <p className="mt-1 text-xs text-slate-400">
            Khu vực quản trị landing page & dữ liệu.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-200">
                Tài khoản admin
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-ahv-primary"
                placeholder="Ví dụ: admin"
                autoFocus
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-200">
                Mật khẩu admin
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-50 outline-none ring-0 placeholder:text-slate-500 focus:border-ahv-primary"
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-medium text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-ahv-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/40 hover:bg-sky-500"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
};

