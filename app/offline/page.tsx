export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
         style={{ backgroundColor: '#f0fdf4' }}>
      <div className="max-w-md w-full">
        <div className="text-6xl mb-6">📡</div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: '#1B5E20' }}>
          Bạn đang offline
        </h1>
        <p className="text-gray-600 mb-2">
          Không có kết nối internet. Vui lòng kiểm tra lại mạng của bạn.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Một số nội dung đã xem trước đó vẫn có thể truy cập được.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#1B5E20' }}
        >
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
}
