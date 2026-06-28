"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error ?? "Đã có lỗi xảy ra. Vui lòng thử lại.");
        setStatus("error");
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch {
      setErrorMsg("Không thể kết nối. Vui lòng kiểm tra mạng và thử lại.");
      setStatus("error");
    }
  }

  return (
    <section className="bg-[#1B5E20] py-14 px-4">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="mb-2 text-2xl font-bold text-white">
          Nhận thông tin du lịch Hà Tĩnh
        </h2>
        <p className="mb-8 text-green-200 text-sm">
          Đăng ký để nhận các cập nhật mới nhất về điểm đến, ẩm thực và sự kiện.
        </p>

        {status === "success" ? (
          <div className="rounded-xl bg-[#D4A017]/20 border border-[#D4A017] px-6 py-4 text-[#D4A017] font-semibold text-base">
            Đăng ký thành công! Cảm ơn bạn.
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="Nhập địa chỉ email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="flex-1 rounded-xl border border-green-600 bg-white/10 px-4 py-3 text-white placeholder:text-green-300 focus:outline-none focus:ring-2 focus:ring-[#D4A017] disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading" || !email.trim()}
                className="rounded-xl bg-[#D4A017] px-6 py-3 font-semibold text-white shadow transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      />
                    </svg>
                    Đang gửi...
                  </span>
                ) : (
                  "Đăng ký"
                )}
              </button>
            </div>

            {status === "error" && (
              <p className="mt-3 text-sm text-red-300">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
