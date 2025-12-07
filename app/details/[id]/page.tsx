"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getArtworkById, getExhibitionById } from "@/lib/harvardApi";

interface Note {
  _id: string;
  text: string;
  author?: { username: string; avatar?: string };
  createdAt: string;
}

export default function DetailsPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { type?: string };
}) {
  const id = params.id;
  const type = searchParams.type || "artwork"; // artwork | exhibition

  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");


// LOAD ARTWORK OR EXHIBITION DETAILS

  useEffect(() => {
    async function load() {
      try {
        const data =
          type === "artwork"
            ? await getArtworkById(id)
            : await getExhibitionById(id);

        setItem(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }

    load();
  }, [id, type]);


  // LOAD NOTES FROM BACKEND

  useEffect(() => {
    async function loadNotes() {
      try {
        const res = await fetch(
          `http://localhost:4000/api/notes/${type}/${id}`
        );
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Failed to load notes", err);
      }
    }

    loadNotes();
  }, [id, type]);


  // CREATE A NEW NOTE

  async function submitNote() {
    if (!newNote.trim()) return;

    try {
      const res = await fetch("http://localhost:4000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newNote,
          targetType: type,
          targetId: id,
        }),
      });

      const saved = await res.json();
      setNotes((n) => [...n, saved]);
      setNewNote("");
    } catch (err) {
      console.error("Failed to create note", err);
    }
  }

  if (loading || !item) {
    return (
      <div className="p-10 text-center text-gray-600 text-xl">Loading...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-6">{item.title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* IMAGE */}
        <div>
          {item.primaryimageurl ? (
            <Image
              src={item.primaryimageurl}
              alt={item.title}
              width={800}
              height={800}
              className="rounded-lg shadow-md object-cover"
            />
          ) : (
            <div className="h-80 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No Image Available</p>
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="space-y-4">
          {item.people?.length > 0 && (
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Artist:</span>{" "}
              {item.people[0].name}
            </p>
          )}

          {item.dated && (
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Date:</span> {item.dated}
            </p>
          )}

          {item.description && (
            <p className="text-gray-600 leading-relaxed">{item.description}</p>
          )}

          {/* Exhibitions have additional metadata */}
          {type === "exhibition" && (
            <>
              <p className="text-gray-700">
                <span className="font-semibold">Start:</span> {item.begindate}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">End:</span> {item.enddate}
              </p>
            </>
          )}
        </div>
      </div>

      {/* ---------------------- NOTES SECTION ---------------------- */}
      <div className="mt-14">
        <h2 className="text-3xl font-bold mb-4">Notes</h2>

        {/* Add Note */}
        <div className="flex gap-3 mb-6">
          <input
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a note…"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={submitNote}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Add
          </button>
        </div>

        {/* List Notes */}
        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div
                key={note._id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <p className="text-gray-800">{note.text}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {note.author?.username ? (
                    <>— {note.author.username}</>
                  ) : (
                    <>— Anonymous</>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
