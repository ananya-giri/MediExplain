export default function ResultCard({ text }) {
  if (!text) return null;

  return (
    <div className="mt-8 bg-white p-6 rounded-2xl shadow-md w-full max-w-3xl mx-auto">
      <h3 className="text-xl font-semibold mb-3 text-blue-700">
        Extracted Report Text:
      </h3>
      <p className="text-gray-700 whitespace-pre-wrap">{text}</p>
    </div>
  );
}
