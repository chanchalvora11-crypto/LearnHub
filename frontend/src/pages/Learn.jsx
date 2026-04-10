import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useParams } from "react-router-dom";

export default function Learn() {
  const { courseId } = useParams();
  const [data, setData] = useState(null);
  const [prog, setProg] = useState({ percent: 0, total: 0, done: 0 });

  const load = async () => {
    const d = await api.get(`/api/courses/${courseId}`);
    setData(d.data);
    const p = await api.get(`/api/progress/course/${courseId}`);
    setProg(p.data);
  };

  useEffect(() => { load(); }, [courseId]);

  const markDone = async (lessonId) => {
    await api.post("/api/progress/lesson", { lessonId, isCompleted: true });
    load();
  };

  if (!data) return <div className="p-6">Loading...</div>;
  const { course, lessons } = data;

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl border shadow-sm p-6">
          <div className="text-xl font-black">{course.title}</div>

          <div className="mt-3">
            <div className="text-sm text-gray-600">Progress: {prog.percent}% ({prog.done}/{prog.total})</div>
            <div className="w-full h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
              <div className="h-3 bg-blue-600" style={{ width: `${prog.percent}%` }} />
            </div>
          </div>

          <h3 className="mt-6 font-bold">Lessons</h3>
          <div className="mt-3 space-y-3">
            {lessons.map((l) => (
              <div key={l.id} className="p-4 rounded-2xl border flex items-center justify-between bg-white">
                <div>
                  <div className="font-semibold">{l.order}. {l.title}</div>
                  <div className="text-sm text-gray-600">{l.content?.slice(0, 80)}...</div>
                </div>
                <button
                  className="px-4 py-2 rounded-2xl bg-blue-600 text-white"
                  onClick={() => markDone(l.id)}
                >
                  Mark Complete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
