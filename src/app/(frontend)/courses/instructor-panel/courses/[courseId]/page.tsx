"use client"
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowUp, ArrowDown, Plus, Trash2, FileText, HelpCircle, Video } from 'lucide-react';

interface Section {
  id: number;
  course_id: string;
  title: string;
  position: number;
  lectures: Lecture[];
}

interface Lecture {
  id: number;
  section_id: number;
  title: string;
  type: string;
  r2_key: string | null;
  duration: number | null;
  quiz_data: unknown;
  markdown_content: string | null;
  position: number;
}

const lectureTypes = [
  { value: 'video', label: 'Video', icon: Video },
  { value: 'quiz', label: 'Quiz', icon: HelpCircle },
  { value: 'markdown', label: 'Markdown', icon: FileText },
];

export default function CourseBuilderPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [drafts, setDrafts] = useState<Record<number, any>>({});
  const [previewMarkdown, setPreviewMarkdown] = useState('');

  const selectedCourseSections = useMemo(() => sections, [sections]);

  useEffect(() => {
    fetch(`/api/instructor/sections?courseId=${courseId}`)
      .then((res) => res.json())
      .then((data) => setSections(data.sections ?? []))
      .finally(() => setLoading(false));
  }, [courseId]);

  async function refresh() {
    const res = await fetch(`/api/instructor/sections?courseId=${courseId}`);
    const data = await res.json();
    setSections(data.sections ?? []);
  }

  async function createSection() {
    if (!newSectionTitle.trim()) return;
    await fetch('/api/instructor/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, title: newSectionTitle.trim() }),
    });
    setNewSectionTitle('');
    await refresh();
  }

  async function updateSection(id: number, payload: Record<string, unknown>) {
    await fetch('/api/instructor/sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...payload }),
    });
    await refresh();
  }

  async function deleteSection(id: number) {
    await fetch('/api/instructor/sections', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await refresh();
  }

  async function addLecture(sectionId: number, type: string) {
    const draft = drafts[sectionId] ?? {};
    let r2Key = draft.r2Key ?? null;
    if (type === 'video' && draft.file) {
      const uploadRes = await fetch('/api/instructor/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, fileName: draft.file.name, contentType: draft.file.type || 'video/mp4' }),
      });
      const uploadData = await uploadRes.json();
      if (uploadData.presignedUrl) {
        await fetch(uploadData.presignedUrl, {
          method: 'PUT',
          headers: { 'Content-Type': draft.file.type || 'video/mp4' },
          body: draft.file,
        });
        r2Key = uploadData.r2Key;
      }
    }
    await fetch('/api/instructor/lectures', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sectionId,
        title: draft.title ?? 'Untitled lecture',
        type,
        r2Key,
        duration: draft.duration ? Number(draft.duration) : null,
        quizData: draft.quizData ?? null,
        markdownContent: draft.markdownContent ?? null,
      }),
    });
    setDrafts((prev) => ({ ...prev, [sectionId]: {} }));
    await refresh();
  }

  async function updateLecture(payload: Record<string, unknown>) {
    await fetch('/api/instructor/lectures', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    await refresh();
  }

  async function deleteLecture(id: number) {
    await fetch('/api/instructor/lectures', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    await refresh();
  }

  async function moveSection(index: number, direction: -1 | 1) {
    const current = sections[index];
    const target = sections[index + direction];
    if (!current || !target) return;
    await updateSection(current.id, { position: target.position });
    await updateSection(target.id, { position: current.position });
  }

  async function moveLecture(section: Section, index: number, direction: -1 | 1) {
    const current = section.lectures[index];
    const target = section.lectures[index + direction];
    if (!current || !target) return;
    await updateLecture({ id: current.id, position: target.position });
    await updateLecture({ id: target.id, position: current.position });
  }

  if (loading) return <div className='text-white/40'>Loading builder...</div>;

  return (
    <div className='space-y-8'>
      <div className='flex items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold text-white'>Course Builder</h1>
          <p className='text-white/40 text-sm mt-1'>Sections and lectures for this course</p>
        </div>
        <div className='flex items-center gap-2'>
          <input value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} placeholder='New section title' className='px-3 py-2 rounded-lg bg-[rgb(20,20,30)] border border-white/[0.08] text-white text-sm w-64' />
          <button onClick={createSection} className='px-3 py-2 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/20 text-sm inline-flex items-center gap-2'><Plus size={14} /> Add Section</button>
        </div>
      </div>

      <div className='grid gap-4'>
        {selectedCourseSections.map((section, index) => (
          <div key={section.id} className='rounded-xl border border-white/[0.08] bg-[rgb(20,20,30)] p-5'>
            <div className='flex items-center justify-between gap-3'>
              <input value={section.title} onChange={(e) => setSections((prev) => prev.map((s) => s.id === section.id ? { ...s, title: e.target.value } : s))} onBlur={() => updateSection(section.id, { title: section.title })} className='bg-transparent text-white font-medium text-lg outline-none w-full' />
              <div className='flex items-center gap-1'>
                <button onClick={() => moveSection(index, -1)} className='p-2 rounded hover:bg-white/5'><ArrowUp size={14} /></button>
                <button onClick={() => moveSection(index, 1)} className='p-2 rounded hover:bg-white/5'><ArrowDown size={14} /></button>
                <button onClick={() => deleteSection(section.id)} className='p-2 rounded hover:bg-red-500/10 text-red-400'><Trash2 size={14} /></button>
              </div>
            </div>
            <div className='mt-4 space-y-3'>
              {section.lectures.map((lecture, lectureIndex) => (
                <div key={lecture.id} className='rounded-lg border border-white/[0.06] bg-[rgb(18,18,26)] p-4'>
                  <div className='flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-3 flex-1'>
                      <input value={lecture.title} onChange={(e) => setSections((prev) => prev.map((s) => s.id === section.id ? { ...s, lectures: s.lectures.map((l) => l.id === lecture.id ? { ...l, title: e.target.value } : l) } : s))} onBlur={() => updateLecture({ id: lecture.id, title: lecture.title })} className='bg-transparent text-white outline-none w-full' />
                      <span className='text-xs text-white/30 uppercase'>{lecture.type}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <button onClick={() => moveLecture(section, lectureIndex, -1)} className='p-2 rounded hover:bg-white/5'><ArrowUp size={14} /></button>
                      <button onClick={() => moveLecture(section, lectureIndex, 1)} className='p-2 rounded hover:bg-white/5'><ArrowDown size={14} /></button>
                      <button onClick={() => deleteLecture(lecture.id)} className='p-2 rounded hover:bg-red-500/10 text-red-400'><Trash2 size={14} /></button>
                    </div>
                  </div>
                  {lecture.type === 'markdown' && (
                    <textarea value={lecture.markdown_content ?? ''} onChange={(e) => setPreviewMarkdown(e.target.value)} onBlur={(e) => updateLecture({ id: lecture.id, markdownContent: e.target.value })} className='mt-3 w-full min-h-28 rounded-lg bg-[rgb(12,12,18)] border border-white/[0.08] p-3 text-sm text-white' />
                  )}
                  {lecture.type === 'quiz' && (
                    <textarea defaultValue={JSON.stringify(lecture.quiz_data ?? {}, null, 2)} onBlur={(e) => updateLecture({ id: lecture.id, quizData: JSON.parse(e.target.value || '{}') })} className='mt-3 w-full min-h-28 rounded-lg bg-[rgb(12,12,18)] border border-white/[0.08] p-3 text-sm text-white font-mono' />
                  )}
                </div>
              ))}
            </div>
            <div className='mt-4 flex flex-wrap items-center gap-2'>
              <input placeholder='Lecture title' onChange={(e) => setDrafts((prev) => ({ ...prev, [section.id]: { ...(prev[section.id] ?? {}), title: e.target.value } }))} className='px-3 py-2 rounded-lg bg-[rgb(12,12,18)] border border-white/[0.08] text-white text-sm w-48' />
              <input type='number' placeholder='Minutes' onChange={(e) => setDrafts((prev) => ({ ...prev, [section.id]: { ...(prev[section.id] ?? {}), duration: e.target.value } }))} className='px-3 py-2 rounded-lg bg-[rgb(12,12,18)] border border-white/[0.08] text-white text-sm w-24' />
              <input type='file' accept='video/*' onChange={(e) => setDrafts((prev) => ({ ...prev, [section.id]: { ...(prev[section.id] ?? {}), file: e.target.files?.[0] } }))} className='text-sm text-white/40' />
              {lectureTypes.map((item) => (
                <button key={item.value} onClick={() => addLecture(section.id, item.value)} className='px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white/70 hover:text-white hover:bg-white/[0.06] inline-flex items-center gap-2'><item.icon size={14} /> {item.label}</button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className='rounded-xl border border-white/[0.08] bg-[rgb(20,20,30)] p-5'>
        <h3 className='text-white font-medium mb-2'>Markdown Preview</h3>
        <pre className='whitespace-pre-wrap text-sm text-white/60'>{previewMarkdown || 'Write markdown content to preview it here.'}</pre>
      </div>
    </div>
  );
}
