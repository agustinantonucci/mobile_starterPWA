/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";

import { useQuill } from "react-quilljs";

import "react-quill/dist/quill.snow.css";
import { GlobalContext } from "../../context/GlobalContext";

const Note = ({ editValue, width, height }) => {

  const { note, setNote } = useContext(GlobalContext);

  const [value, setValue] = useState("");
  

  var toolbarOptions = [
    ["bold", "italic", "underline"],
    [{ link: true }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ];
  const { quill, quillRef, Quill } = useQuill({
    modules: { magicUrl: true, toolbar: toolbarOptions },
  });
  // Idioma

  if (Quill && !quill) {
    // For execute this line only once.
    const MagicUrl = require("quill-magic-url").default; // Install with 'yarn add quill-magic-url'
    Quill.register("modules/magicUrl", MagicUrl);
  }

  useEffect(() => {
    // si existe una nota la debe setear como valor
    if (editValue) {
      setValue(editValue);
      //
      if (quill) {
        quill.clipboard.dangerouslyPasteHTML(editValue);
        setValue(editValue);
        setNote(editValue);
      }
    }
    if (quill) {
      quill.on("text-change", (v) => {
        setValue(quill.root.innerHTML);
        setNote(quill.root.innerHTML);
      });
    }
  }, [editValue, quill, setNote]);

  return (
    <>
      <div style={{display:"flex", flexDirection:"row", width: "98%", marginLeft:"6px"}}>
        <div style={{display:"flex", flexDirection:"column", width: "100%", height:"100%", marginBottom: "30px"}}>
          <div style={{ width: width }}>
            <div ref={quillRef} style={{ minHeight: height }} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Note;