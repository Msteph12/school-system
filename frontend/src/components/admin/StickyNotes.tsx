import React, { useState, useRef } from 'react';
import { Search, Plus } from 'lucide-react';

interface NoteItem {
  id: number;
  text: string;
  time: string;
  date: string;
  colorIndex: number;
}

const colorClasses = [
  // Soft Peach Glass
  'bg-[#FFF1EE]/70 border-[#FFD1C9]/60 backdrop-blur-md shadow-lg shadow-red-200/40',
  
  // Soft Blue Glass
  'bg-[#9CCBFF]/70 border-[#7AB5FF]/60 backdrop-blur-md shadow-lg shadow-blue-200/40',
  
  // Dark Slate Glass
  'bg-slate-800/70 border-slate-700/60 backdrop-blur-md shadow-lg shadow-slate-900/40',
];

let noteIdCounter = 3;

const StickyNotes: React.FC = () => {
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState<NoteItem[]>([
  ]);

  const [nextColorIndex, setNextColorIndex] = useState(0);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [tempText, setTempText] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredNotes = notes.filter(note =>
    note.text.toLowerCase().includes(search.toLowerCase())
  );

  const addNote = () => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const newNoteItem: NoteItem = {
      id: ++noteIdCounter,
      text: '',
      time,
      date,
      colorIndex: nextColorIndex,
    };

    setNotes([newNoteItem, ...notes]);
    setNextColorIndex((nextColorIndex + 1) % 3);
    setEditingNoteId(newNoteItem.id);
    setTempText('');

    setTimeout(() => textareaRef.current?.focus(), 10);
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    if (editingNoteId === id) setEditingNoteId(null);
  };

  const startEditing = (id: number) => {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    setEditingNoteId(id);
    setTempText(note.text);
    setTimeout(() => textareaRef.current?.focus(), 10);
  };

  const saveNote = (id: number) => {
    if (!tempText.trim()) return;

    setNotes(notes.map(n => n.id === id ? { ...n, text: tempText } : n));
    setEditingNoteId(null);
  };

  const formatWithBullets = (text: string) =>
    text.split('\n').map((line, i) =>
      line.trim() ? (
        <div key={i} className="flex gap-2 mb-1">
          <span>•</span>
          <span>{line}</span>
        </div>
      ) : null
    );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-700">Short Notes</h3>
        <button
          onClick={addNote}
          title="Add new note"
          className="p-2 rounded-md bg-white/70 backdrop-blur-md border border-gray-200 shadow hover:shadow-md hover:bg-white transition"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/70 backdrop-blur-md border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none"
        />
      </div>

      {/* Notes Container */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(2 * (140px + 12px))' }}>
        <div className="space-y-3 pr-2">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              className={`
                relative border rounded-xl p-4
                transition-all duration-300
                hover:-translate-y-0.5 hover:shadow-xl
                ${colorClasses[note.colorIndex]}
              `}
            >
              {/* Glass overlay */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              {/* Header */}
              <div className={`relative flex justify-between text-sm mb-2 ${
                note.colorIndex === 2 ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <span>{note.time} • {note.date}</span>
                <button
                  onClick={() => deleteNote(note.id)}
                  title="Delete note"
                  className="hover:text-red-500 transition"
                >
                  ×
                </button>
              </div>

              {/* Body */}
              {editingNoteId === note.id ? (
                <textarea
                  ref={textareaRef}
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                  onBlur={() => saveNote(note.id)}
                  placeholder="Type your note here..."
                  className={`w-full bg-transparent resize-none min-h-20 outline-none ${
                    note.colorIndex === 2 ? 'text-white placeholder-gray-400' : 'text-gray-700 placeholder-gray-500'
                  }`}
                />
              ) : (
                <div
                  onClick={() => startEditing(note.id)}
                  className={`cursor-text min-h-20 ${
                    note.colorIndex === 2 ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {note.text ? formatWithBullets(note.text) : (
                    <span className="italic opacity-60">Click to add note...</span>
                  )}
                </div>
              )}

              {/* Accent dot */}
              <div className={`w-2 h-2 rounded-full mt-3 ${
                note.colorIndex === 0 ? 'bg-[#FFB4A9]' :
                note.colorIndex === 1 ? 'bg-[#7AB5FF]' :
                'bg-slate-500'
              }`} />
            </div>
          ))}
        </div>
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No notes found.
        </div>
      )}
    </div>
  );
};

export default StickyNotes;
