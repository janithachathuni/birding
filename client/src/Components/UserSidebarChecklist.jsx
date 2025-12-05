import React, { useState } from "react";

const UserSidebarChecklist = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleAddNote = () => {
    if (newNote.trim() !== "") {
      const currentTime = new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setNotes([...notes, {
        id: Date.now(),
        content: newNote,
        time: currentTime
      }]);
      setNewNote("");
      setShowNoteInput(false);
    }
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    setDeleteConfirm(null);
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm(id);
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const handleCancelNote = () => {
    setNewNote("");
    setShowNoteInput(false);
  };

  const SearchIcon = () => (
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const PlusIcon = () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const CloseIcon = () => (
    <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const noteColor = "bg-[#f5f6f5]";

  return (
    <div className="fixed top-0 right-0 h-screen w-[30%] bg-white flex flex-col border-l border-gray-300">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search birds"
            className="w-full p-3 pl-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#506142]"
          />
          <div className="absolute right-3 top-3.5">
            <SearchIcon />
          </div>
        </div>
        
        {/* Field Notes Header */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-lg font-semibold text-[#143829]">Field Notes</p>
          <button
            onClick={() => setShowNoteInput(true)}
            className="p-2 text-[#143829] rounded-full transition-colors"
          >
            <PlusIcon />
          </button>
        </div>

        {/* Add Note Input Area - Only shows when + button is clicked */}
        {showNoteInput && (
          <div className="mt-4 bg-white border border-gray-300 rounded-lg p-4 relative">
            {/* Cross button in red background - top right corner */}
            <button
              onClick={handleCancelNote}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors flex items-center justify-center"
            >
              <CloseIcon />
            </button>
            
            {/* Note input area */}
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your note here..."
              className="w-full resize-none focus:outline-none"
              rows="4"
            />
            
            {/* Post button - bottom right */}
            <div className="flex justify-end mt-3">
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="px-4 py-2 bg-[#143829] text-white rounded-lg hover:bg-[#0f2b20] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Post
              </button>
            </div>
          </div>
        )}

        {/* Notes List */}
        <div className="mt-4 space-y-3">
          {notes.length === 0 && !showNoteInput ? (
            <div className="bg-[#f5f6f5] rounded-lg p-4 min-h-[200px]">
              <p className="text-gray-500 text-center py-8">No field notes yet. Click the + button to add one!</p>
            </div>
          ) : (
            notes.map((note, index) => (
              <div 
                key={note.id} 
                className={`${noteColor} rounded-lg p-4 relative`}
              >
                {/* Time - top right */}
                <div className="absolute top-3 right-3 text-xs text-gray-500">
                  {note.time}
                </div>
                
                {/* Note content */}
                <p className="text-gray-700 pr-12">{note.content}</p>
                
                {/* Delete button - bottom right */}
                <button
                  onClick={() => handleDeleteClick(note.id)}
                  className="absolute bottom-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <TrashIcon />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sticky footer */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <p className="text-xs text-gray-500">© 2025 Kurullo</p>
      </div>

      {/* Delete Confirmation Popup */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <p className="text-gray-800 font-medium mb-2">Delete Note</p>
            <p className="text-gray-600 text-sm mb-4">Are you sure you want to delete this note?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteNote(deleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSidebarChecklist;