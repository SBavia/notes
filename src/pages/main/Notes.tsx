import { useEffect, useState } from 'react';

type Note = {
  _id: number;
  title: string;
  content: string;
};

const Notes = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch('https://glittery-mermaid-653aa2.netlify.app/api/notes');

        const { notes } = await response.json();

        setNotes(notes);
      } catch (e) {
        console.log(e);
      }
    };

    fetchNotes();
  }, []);

  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('https://glittery-mermaid-653aa2.netlify.app/api/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const newNote = (await response.json()).note;

      setNotes([newNote, ...notes]);
      setTitle('');
      setContent('');
    } catch (e) {
      console.log(e);
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedNote) {
      return;
    }

    try {
      const response = await fetch(
        `https://glittery-mermaid-653aa2.netlify.app/api/notes/${selectedNote._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      const updatedNote = (await response.json()).note;

      const updatedNotesList = notes.map((note) =>
        note._id === selectedNote._id ? updatedNote : note
      );

      setNotes(updatedNotesList);
      setTitle('');
      setContent('');
      setSelectedNote(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setTitle('');
    setContent('');
    setSelectedNote(null);
  };

  const deleteNote = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();

    try {
      const response = await fetch(
        `https://glittery-mermaid-653aa2.netlify.app/api/notes/${noteId}`,
        {
          method: 'DELETE',
        }
      );
      await response.json();

      const updatedNotes = notes.filter((note) => note._id !== noteId);

      setNotes(updatedNotes);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="app-container">
      <form
        className="note-form"
        onSubmit={(event) => (selectedNote ? handleUpdateNote(event) : handleAddNote(event))}
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title"
          required
        />

        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Content"
          rows={10}
          required
        />

        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>
      <div className="notes-grid">
        {notes.length
          ? notes.map((note) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
              <div
                key={note._id}
                role="listitem"
                className="note-item"
                onClick={() => handleNoteClick(note)}
              >
                <div className="notes-header">
                  <button type="button" onClick={(event) => deleteNote(event, note._id)}>
                    x
                  </button>
                </div>
                <h2>{note.title}</h2>
                <p>{note.content}</p>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default Notes;
