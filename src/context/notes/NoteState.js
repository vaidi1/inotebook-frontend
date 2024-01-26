import React, { useState } from "react";
import noteContext from "./noteContext";
// import { json } from "react-router-dom";

const NoteState = (props)=> {
  const host = "http://localhost:5000"
    const notesInitial = []
      const [notes, setNotes] = useState(notesInitial)
      //Get all notes
      const getNotes = async ()=> {
        //API Call
        const response = await fetch(`${host}/api/note/fetchallnotes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token' : localStorage.getItem('token')
          }
        });
        const json = await response.json()
        setNotes(json)
      }

      //Add a note
      const addNote = async (title, description, tag)=> {
        //API Call
        const response = await fetch(`${host}/api/note/addnote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'auth-token' : localStorage.getItem('token')
          },
          body: JSON.stringify({title, description, tag})
        });
        const note = await response.json();
        console.log("adding a new note")
        setNotes(notes.concat(note))
      }
      //Delete a note
      const deleteNote = async (id)=> {
        //API Call
        const response = await fetch(`${host}/api/note/deletenote/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'auth-token' : localStorage.getItem('token')
          }
        });
        const json = response.json();
        console.log(json)

        //console.log("delete node")
        const newNotes = notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes)
      }
      //Edit a note
      const editNote = async (id, title, description, tag)=> {
        //API Call
        const response = await fetch(`${host}/api/note/updatenote/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'auth-token' : localStorage.getItem('token')
          },
          body: JSON.stringify({title, description, tag})
        });
        const json = await response.json();
        console.log(json)

        let newNotes = JSON.parse(JSON.stringify(notes))
        
        //Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if(element._id === id){
            newNotes[index].title = title;
            newNotes[index].description = description;
            newNotes[index].tag = tag;
            break;
          }
          
        }
        setNotes(newNotes);
      }

    return (
        <noteContext.Provider value={{notes, deleteNote, addNote, editNote, getNotes}}>
            {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;