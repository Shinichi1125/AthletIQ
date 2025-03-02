import React from "react";
import { Note } from "../types";

interface NotesProps {
  notes: Note[];
}

const Notes: React.FC<NotesProps> = ({ notes }) => {
  return (
    <div>
      <h3>Notes</h3>
      {notes.map((noteObj, index) => (
        <p key={index}>
          {Array.isArray(noteObj.note) ? (
            noteObj.note.map((item, i) => (
              <span key={i}>
                {item.link ? (
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.text}
                  </a>
                ) : (
                  item.text
                )}{" "}
              </span>
            ))
          ) : (
            <span>{noteObj.note.text}</span>
          )}
        </p>
      ))}
    </div>
  );
};

export default Notes;
