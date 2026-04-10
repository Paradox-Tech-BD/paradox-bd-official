"use client"
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { ArrowUp, ArrowDown, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

type LectureType = 'video' | 'quiz' | 'markdown';

type QuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
};

type QuizDataV1 = {
  version: 1;
  questions: QuizQuestion[];
};

type DraftLecture = {
  type: LectureType;
  title: string;
  duration: string;
  file?: File;
  quizData: QuizDataV1;
  markdownContent: string;
};

function makeId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyQuiz(): QuizDataV1 {
  return {
    version: 1,
    questions: [
      {
        id: makeId(),
        prompt: '',
        options: ['', '', '', ''],
        correctIndex: 0,
      },
    ],
  };
}

function coerceQuizData(raw: unknown): QuizDataV1 {
  const fallback = emptyQuiz();
  if (!raw || typeof raw !== 'object') return fallback;
  const maybe = raw as any;
  const questions = Array.isArray(maybe.questions) ? maybe.questions : null;
  if (!questions) return fallback;

  const normalizedQuestions: QuizQuestion[] = questions
    .map((q: any) => {
      const options = Array.isArray(q.options) ? q.options.map((o: any) => String(o ?? '')).slice(0, 6) : ['', '', '', ''];
      const safeOptions = options.length >= 2 ? options : ['', '', '', ''];
      const correctIndex = Number.isInteger(q.correctIndex) ? q.correctIndex : 0;
      return {
        id: typeof q.id === 'string' && q.id.length > 0 ? q.id : makeId(),
        prompt: typeof q.prompt === 'string' ? q.prompt : '',
        options: safeOptions,
        correctIndex: Math.max(0, Math.min(safeOptions.length - 1, correctIndex)),
      };
    })
    .filter(Boolean);

  return {
    version: 1,
    questions: normalizedQuestions.length > 0 ? normalizedQuestions : fallback.questions,
  };
}

function defaultDraft(): DraftLecture {
  return {
    type: 'video',
    title: '',
    duration: '',
    file: undefined,
    quizData: emptyQuiz(),
    markdownContent: '',
  };
}

function renderInline(text: string): React.ReactNode {
  // Very small, safe inline renderer: `code`, **bold**.
  const parts: React.ReactNode[] = [];
  let i = 0;
  while (i < text.length) {
    const codeStart = text.indexOf('`', i);
    const boldStart = text.indexOf('**', i);
    const next = [codeStart === -1 ? Infinity : codeStart, boldStart === -1 ? Infinity : boldStart].reduce((a, b) => Math.min(a, b));
    if (next === Infinity) {
      parts.push(text.slice(i));
      break;
    }
    if (next > i) parts.push(text.slice(i, next));
    if (next === codeStart) {
      const end = text.indexOf('`', codeStart + 1);
      if (end === -1) {
        parts.push(text.slice(codeStart));
        break;
      }
      parts.push(
        <code key={`${codeStart}-${end}`} className='px-1 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-white/80'>
          {text.slice(codeStart + 1, end)}
        </code>
      );
      i = end + 1;
      continue;
    }
    if (next === boldStart) {
      const end = text.indexOf('**', boldStart + 2);
      if (end === -1) {
        parts.push(text.slice(boldStart));
        break;
      }
      parts.push(
        <strong key={`${boldStart}-${end}`} className='text-white/80'>
          {text.slice(boldStart + 2, end)}
        </strong>
      );
      i = end + 2;
      continue;
    }
  }
  return <>{parts.map((p, idx) => <Fragment key={idx}>{p}</Fragment>)}</>;
}

function MarkdownPreview({ value }: { value: string }) {
  const lines = value.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];

  let idx = 0;
  while (idx < lines.length) {
    const line = lines[idx];
    if (!line.trim()) {
      idx += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const text = heading[2];
      const Tag: 'h3' | 'h4' | 'h5' = level === 1 ? 'h3' : level === 2 ? 'h4' : 'h5';
      blocks.push(
        <Tag key={`h-${idx}`} className={cn('text-white font-semibold', level === 1 ? 'text-lg' : level === 2 ? 'text-base' : 'text-sm')}>
          {renderInline(text)}
        </Tag>
      );
      idx += 1;
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (idx < lines.length && (lines[idx].startsWith('- ') || lines[idx].startsWith('* '))) {
        items.push(lines[idx].slice(2));
        idx += 1;
      }
      blocks.push(
        <ul key={`ul-${idx}`} className='list-disc pl-5 space-y-1 text-sm text-white/60'>
          {items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // paragraph until blank line
    const para: string[] = [];
    while (idx < lines.length && lines[idx].trim()) {
      para.push(lines[idx]);
      idx += 1;
    }
    blocks.push(
      <p key={`p-${idx}`} className='text-sm text-white/60 leading-relaxed'>
        {renderInline(para.join(' '))}
      </p>
    );
  }

  return <div className='space-y-3'>{blocks.length ? blocks : <p className='text-sm text-white/30'>Nothing to preview yet.</p>}</div>;
}

export default function CourseBuilderPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [drafts, setDrafts] = useState<Record<number, DraftLecture>>({});
  const [lectureEdits, setLectureEdits] = useState<Record<number, { quizData?: QuizDataV1; markdownContent?: string }>>({});

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

  async function addLecture(sectionId: number) {
    const draft = drafts[sectionId] ?? defaultDraft();

    if (!draft.title.trim()) return;
    if (draft.type === 'video' && !draft.file) return;

    let r2Key: string | null = null;
    if (draft.type === 'video' && draft.file) {
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
        title: draft.title.trim(),
        type: draft.type,
        r2Key,
        duration: draft.duration ? Number(draft.duration) : null,
        quizData: draft.type === 'quiz' ? draft.quizData : null,
        markdownContent: draft.type === 'markdown' ? draft.markdownContent : null,
      }),
    });
    setDrafts((prev) => ({ ...prev, [sectionId]: defaultDraft() }));
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
          <input value={newSectionTitle} onChange={(e) => setNewSectionTitle(e.target.value)} placeholder='New section title' className='px-3 py-2 rounded-lg bg-dark-surface border border-white/[0.08] text-white text-sm w-64' />
          <button onClick={createSection} className='px-3 py-2 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/20 text-sm inline-flex items-center gap-2'><Plus size={14} /> Add Section</button>
        </div>
      </div>

      <div className='grid gap-4'>
        {selectedCourseSections.map((section, index) => (
          <div key={section.id} className='rounded-xl border border-white/[0.08] bg-dark-card p-5'>
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
                <div key={lecture.id} className='rounded-lg border border-white/[0.06] bg-dark-surface p-4'>
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
                    <div className='mt-4 grid md:grid-cols-2 gap-4'>
                      <div>
                        <p className='text-xs text-white/30 mb-2 font-mono uppercase tracking-wider'>Markdown</p>
                        <textarea
                          value={lectureEdits[lecture.id]?.markdownContent ?? (lecture.markdown_content ?? '')}
                          onChange={(e) => setLectureEdits((prev) => ({ ...prev, [lecture.id]: { ...(prev[lecture.id] ?? {}), markdownContent: e.target.value } }))}
                          className='w-full min-h-40 rounded-lg bg-dark-bg border border-white/[0.08] p-3 text-sm text-white'
                          placeholder='Write markdown instructions...'
                        />
                        <div className='mt-2 flex justify-end'>
                          <button
                            onClick={() => updateLecture({ id: lecture.id, markdownContent: lectureEdits[lecture.id]?.markdownContent ?? (lecture.markdown_content ?? '') })}
                            className='px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/70 hover:text-white hover:bg-white/[0.06]'
                          >
                            Save
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className='text-xs text-white/30 mb-2 font-mono uppercase tracking-wider'>Preview</p>
                        <div className='rounded-lg bg-dark-bg border border-white/[0.08] p-4'>
                          <MarkdownPreview value={lectureEdits[lecture.id]?.markdownContent ?? (lecture.markdown_content ?? '')} />
                        </div>
                      </div>
                    </div>
                  )}

                  {lecture.type === 'quiz' && (
                    <div className='mt-4 space-y-3'>
                      <p className='text-xs text-white/30 font-mono uppercase tracking-wider'>Quiz</p>
                      {(() => {
                        const quiz = lectureEdits[lecture.id]?.quizData ?? coerceQuizData(lecture.quiz_data);
                        return (
                          <div className='space-y-4'>
                            {quiz.questions.map((q, qIndex) => (
                              <div key={q.id} className='rounded-lg border border-white/[0.08] bg-dark-bg p-4'>
                                <div className='flex items-center justify-between gap-3'>
                                  <p className='text-xs text-white/30 font-mono'>Question {qIndex + 1}</p>
                                  <button
                                    onClick={() => {
                                      const next = { ...quiz, questions: quiz.questions.filter((qq) => qq.id !== q.id) };
                                      setLectureEdits((prev) => ({ ...prev, [lecture.id]: { ...(prev[lecture.id] ?? {}), quizData: next.questions.length ? next : emptyQuiz() } }));
                                    }}
                                    className='text-xs text-red-400 hover:text-red-300'
                                  >
                                    Remove
                                  </button>
                                </div>

                                <input
                                  value={q.prompt}
                                  onChange={(e) => {
                                    const next = {
                                      ...quiz,
                                      questions: quiz.questions.map((qq) => (qq.id === q.id ? { ...qq, prompt: e.target.value } : qq)),
                                    };
                                    setLectureEdits((prev) => ({ ...prev, [lecture.id]: { ...(prev[lecture.id] ?? {}), quizData: next } }));
                                  }}
                                  placeholder='Question prompt'
                                  className='mt-2 w-full px-3 py-2 rounded-lg bg-dark-surface border border-white/[0.08] text-sm text-white'
                                />

                                <div className='mt-3 grid md:grid-cols-2 gap-3'>
                                  {q.options.map((opt, optIndex) => (
                                    <label key={optIndex} className='flex items-center gap-2'>
                                      <input
                                        type='radio'
                                        name={`correct-${lecture.id}-${q.id}`}
                                        checked={q.correctIndex === optIndex}
                                        onChange={() => {
                                          const next = {
                                            ...quiz,
                                            questions: quiz.questions.map((qq) => (qq.id === q.id ? { ...qq, correctIndex: optIndex } : qq)),
                                          };
                                          setLectureEdits((prev) => ({ ...prev, [lecture.id]: { ...(prev[lecture.id] ?? {}), quizData: next } }));
                                        }}
                                      />
                                      <input
                                        value={opt}
                                        onChange={(e) => {
                                          const nextOptions = q.options.map((o, i) => (i === optIndex ? e.target.value : o));
                                          const next = {
                                            ...quiz,
                                            questions: quiz.questions.map((qq) => (qq.id === q.id ? { ...qq, options: nextOptions } : qq)),
                                          };
                                          setLectureEdits((prev) => ({ ...prev, [lecture.id]: { ...(prev[lecture.id] ?? {}), quizData: next } }));
                                        }}
                                        placeholder={`Option ${optIndex + 1}`}
                                        className='flex-1 px-3 py-2 rounded-lg bg-dark-surface border border-white/[0.08] text-sm text-white'
                                      />
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}

                            <div className='flex items-center justify-between gap-3'>
                              <button
                                onClick={() => {
                                  const next: QuizDataV1 = {
                                    ...quiz,
                                    questions: [
                                      ...quiz.questions,
                                      { id: makeId(), prompt: '', options: ['', '', '', ''], correctIndex: 0 },
                                    ],
                                  };
                                  setLectureEdits((prev) => ({ ...prev, [lecture.id]: { ...(prev[lecture.id] ?? {}), quizData: next } }));
                                }}
                                className='px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/70 hover:text-white hover:bg-white/[0.06]'
                              >
                                Add Question
                              </button>
                              <button
                                onClick={() => updateLecture({ id: lecture.id, quizData: quiz })}
                                className='px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/70 hover:text-white hover:bg-white/[0.06]'
                              >
                                Save Quiz
                              </button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {(() => {
              const draft = drafts[section.id] ?? defaultDraft();
              return (
                <div className='mt-5 rounded-lg border border-white/[0.08] bg-dark-surface p-4'>
                  <p className='text-xs text-white/30 font-mono uppercase tracking-wider mb-3'>Add Lecture</p>
                  <div className='flex flex-wrap items-center gap-2'>
                    <select
                      value={draft.type}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [section.id]: { ...(prev[section.id] ?? defaultDraft()), type: e.target.value as LectureType } }))}
                      className='px-3 py-2 rounded-lg bg-dark-bg border border-white/[0.08] text-white text-sm'
                    >
                      <option value='video'>Video</option>
                      <option value='quiz'>Quiz</option>
                      <option value='markdown'>Markdown</option>
                    </select>

                    <input
                      value={draft.title}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [section.id]: { ...(prev[section.id] ?? defaultDraft()), title: e.target.value } }))}
                      placeholder='Lecture title'
                      className='px-3 py-2 rounded-lg bg-dark-bg border border-white/[0.08] text-white text-sm w-56'
                    />

                    <input
                      type='number'
                      value={draft.duration}
                      onChange={(e) => setDrafts((prev) => ({ ...prev, [section.id]: { ...(prev[section.id] ?? defaultDraft()), duration: e.target.value } }))}
                      placeholder='Minutes'
                      className='px-3 py-2 rounded-lg bg-dark-bg border border-white/[0.08] text-white text-sm w-24'
                    />

                    <button
                      onClick={() => addLecture(section.id)}
                      className='px-3 py-2 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/20 text-sm inline-flex items-center gap-2'
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>

                  {draft.type === 'video' && (
                    <div className='mt-3'>
                      <p className='text-xs text-white/30 mb-2'>Video file</p>
                      <input
                        type='file'
                        accept='video/*'
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [section.id]: { ...(prev[section.id] ?? defaultDraft()), file: e.target.files?.[0] } }))}
                        className='text-sm text-white/40'
                      />
                    </div>
                  )}

                  {draft.type === 'markdown' && (
                    <div className='mt-4 grid md:grid-cols-2 gap-4'>
                      <div>
                        <p className='text-xs text-white/30 mb-2'>Markdown</p>
                        <textarea
                          value={draft.markdownContent}
                          onChange={(e) => setDrafts((prev) => ({ ...prev, [section.id]: { ...(prev[section.id] ?? defaultDraft()), markdownContent: e.target.value } }))}
                          className='w-full min-h-32 rounded-lg bg-dark-bg border border-white/[0.08] p-3 text-sm text-white'
                          placeholder='Write markdown instructions...'
                        />
                      </div>
                      <div>
                        <p className='text-xs text-white/30 mb-2'>Preview</p>
                        <div className='rounded-lg bg-dark-bg border border-white/[0.08] p-4'>
                          <MarkdownPreview value={draft.markdownContent} />
                        </div>
                      </div>
                    </div>
                  )}

                  {draft.type === 'quiz' && (
                    <div className='mt-4 space-y-4'>
                      <p className='text-xs text-white/30 mb-2'>Questions</p>
                      {draft.quizData.questions.map((q, qIndex) => (
                        <div key={q.id} className='rounded-lg bg-dark-bg border border-white/[0.08] p-4'>
                          <div className='flex items-center justify-between'>
                            <p className='text-xs text-white/30 font-mono'>Question {qIndex + 1}</p>
                            <button
                              onClick={() => {
                                const next = {
                                  ...draft,
                                  quizData: {
                                    ...draft.quizData,
                                    questions: draft.quizData.questions.filter((qq) => qq.id !== q.id),
                                  },
                                };
                                setDrafts((prev) => ({
                                  ...prev,
                                  [section.id]: next.quizData.questions.length ? next : { ...defaultDraft(), type: 'quiz' },
                                }));
                              }}
                              className='text-xs text-red-400 hover:text-red-300'
                            >
                              Remove
                            </button>
                          </div>
                          <input
                            value={q.prompt}
                            onChange={(e) => {
                              const next = {
                                ...draft,
                                quizData: {
                                  ...draft.quizData,
                                  questions: draft.quizData.questions.map((qq) => (qq.id === q.id ? { ...qq, prompt: e.target.value } : qq)),
                                },
                              };
                              setDrafts((prev) => ({ ...prev, [section.id]: next }));
                            }}
                            placeholder='Question prompt'
                            className='mt-2 w-full px-3 py-2 rounded-lg bg-dark-surface border border-white/[0.08] text-sm text-white'
                          />
                          <div className='mt-3 grid md:grid-cols-2 gap-3'>
                            {q.options.map((opt, optIndex) => (
                              <label key={optIndex} className='flex items-center gap-2'>
                                <input
                                  type='radio'
                                  name={`draft-correct-${section.id}-${q.id}`}
                                  checked={q.correctIndex === optIndex}
                                  onChange={() => {
                                    const next = {
                                      ...draft,
                                      quizData: {
                                        ...draft.quizData,
                                        questions: draft.quizData.questions.map((qq) => (qq.id === q.id ? { ...qq, correctIndex: optIndex } : qq)),
                                      },
                                    };
                                    setDrafts((prev) => ({ ...prev, [section.id]: next }));
                                  }}
                                />
                                <input
                                  value={opt}
                                  onChange={(e) => {
                                    const nextOptions = q.options.map((o, i) => (i === optIndex ? e.target.value : o));
                                    const next = {
                                      ...draft,
                                      quizData: {
                                        ...draft.quizData,
                                        questions: draft.quizData.questions.map((qq) => (qq.id === q.id ? { ...qq, options: nextOptions } : qq)),
                                      },
                                    };
                                    setDrafts((prev) => ({ ...prev, [section.id]: next }));
                                  }}
                                  placeholder={`Option ${optIndex + 1}`}
                                  className='flex-1 px-3 py-2 rounded-lg bg-dark-surface border border-white/[0.08] text-sm text-white'
                                />
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div>
                        <button
                          onClick={() => {
                            const next = {
                              ...draft,
                              quizData: {
                                ...draft.quizData,
                                questions: [
                                  ...draft.quizData.questions,
                                  { id: makeId(), prompt: '', options: ['', '', '', ''], correctIndex: 0 },
                                ],
                              },
                            };
                            setDrafts((prev) => ({ ...prev, [section.id]: next }));
                          }}
                          className='px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/70 hover:text-white hover:bg-white/[0.06]'
                        >
                          Add Question
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        ))}
      </div>
    </div>
  );
}
