// ImagePanel.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  uploadImage,
  listImagesForPatient,
  getImageAnnotations,
  saveImageAnnotations,
  getImageUrl
} from "../services/imageService";

export default function ImagePanel({ currentUser, patientId }) {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [actions, setActions] = useState([]);
  const [tool, setTool] = useState("line");
  const [textValue, setTextValue] = useState("Annotation");
  const [error, setError] = useState("");
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const lineStartRef = useRef(null);

  useEffect(() => {
    if (patientId) {
      loadImages();
    }
  }, [patientId]);

  useEffect(() => {
    if (selectedImage) {
      loadAnnotations(selectedImage.id);
    }
  }, [selectedImage]);

  useEffect(() => {
    drawCanvas();
  }, [selectedImage, actions]);

  async function loadImages() {
    try {
      const data = await listImagesForPatient(patientId);
      setImages(data);
      if (data.length > 0 && !selectedImage) {
        setSelectedImage(data[0]);
      }
    } catch (e) {
      setError(e.message);
    }
  }

  async function loadAnnotations(imageId) {
    try {
      const data = await getImageAnnotations(imageId);
      setActions(data.actions || []);
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("patientId", patientId);
      formData.append("uploadedByUserId", currentUser.id);

      await uploadImage(formData);
      await loadImages();
    } catch (e) {
      setError(e.message);
    }
  }

  function getCanvasCoordinates(event) {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function handleCanvasClick(event) {
    if (currentUser.role !== "DOCTOR") return;
    if (!selectedImage) return;

    const pos = getCanvasCoordinates(event);

    if (tool === "text") {
      setActions((prev) => [
        ...prev,
        {
          type: "text",
          x: pos.x,
          y: pos.y,
          text: textValue,
          color: "blue",
          fontSize: 18
        }
      ]);
      return;
    }

    if (tool === "line") {
      if (!lineStartRef.current) {
        lineStartRef.current = pos;
      } else {
        setActions((prev) => [
          ...prev,
          {
            type: "line",
            x1: lineStartRef.current.x,
            y1: lineStartRef.current.y,
            x2: pos.x,
            y2: pos.y,
            color: "red",
            width: 3
          }
        ]);
        lineStartRef.current = null;
      }
    }
  }

  function drawCanvas() {
    const canvas = canvasRef.current;
    if (!canvas || !selectedImage || !imageRef.current) return;

    const ctx = canvas.getContext("2d");
    const img = imageRef.current;

    canvas.width = img.clientWidth || 700;
    canvas.height = img.clientHeight || 400;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    actions.forEach((action) => {
      if (action.type === "line") {
        ctx.beginPath();
        ctx.moveTo(action.x1, action.y1);
        ctx.lineTo(action.x2, action.y2);
        ctx.lineWidth = action.width || 2;
        ctx.strokeStyle = action.color || "red";
        ctx.stroke();
      } else if (action.type === "text") {
        ctx.fillStyle = action.color || "blue";
        ctx.font = `${action.fontSize || 18}px Arial`;
        ctx.fillText(action.text || "", action.x, action.y);
      }
    });
  }

  async function handleSaveAnnotations() {
    try {
      await saveImageAnnotations(selectedImage.id, actions);
      alert("Annotationer sparade");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="card">
      <h3 className="title">Bildhantering</h3>

      {(currentUser.role === "DOCTOR" || currentUser.role === "STAFF") && (
        <div>
          <input type="file" accept="image/*" onChange={handleUpload} />
        </div>
      )}

      <div className="row">
        <div className="col">
          <h4>Bilder</h4>
          {images.map((img) => (
            <div key={img.id} className="card">
              <div>{img.originalName}</div>
              <div className="small">{img.createdAt}</div>
              <button onClick={() => setSelectedImage(img)}>Öppna</button>
            </div>
          ))}
        </div>

        <div className="col">
          {selectedImage ? (
            <>
              <div className="toolbar">
                {currentUser.role === "DOCTOR" && (
                  <>
                    <button onClick={() => setTool("line")}>Linje</button>
                    <button onClick={() => setTool("text")}>Text</button>
                    <input
                      placeholder="Text annotation"
                      value={textValue}
                      onChange={(e) => setTextValue(e.target.value)}
                    />
                    <button onClick={handleSaveAnnotations}>Spara annotationer</button>
                  </>
                )}
              </div>

              <div style={{ position: "relative", display: "inline-block" }}>
                <img
                  ref={imageRef}
                  src={getImageUrl(selectedImage.storedFilename)}
                  alt={selectedImage.originalName}
                  className="image-preview"
                  style={{ maxWidth: "700px", display: "block" }}
                  onLoad={drawCanvas}
                />
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    cursor: currentUser.role === "DOCTOR" ? "crosshair" : "default"
                  }}
                />
              </div>
            </>
          ) : (
            <div>Ingen bild vald</div>
          )}
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}