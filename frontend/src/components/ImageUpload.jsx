import { useRef, useState } from "react";
import { Upload, Link, X, Image } from "lucide-react";

export default function ImageUpload({ value, onChange, className = "" }) {
  const inputRef = useRef(null);
  const [tab, setTab] = useState("upload"); // "upload" | "url"
  const [urlInput, setUrlInput] = useState(value || "");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);

    const objectUrl = URL.createObjectURL(file);
    onChange(objectUrl);

    setUploading(false);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  function onInputChange(e) {
    handleFile(e.target.files[0]);
  }

  function applyUrl() {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Tab switcher */}
      <div className="flex gap-1 bg-bg dark:bg-dark-bg rounded-lg p-1 w-fit text-xs font-medium">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`px-3 py-1.5 rounded-md transition-colors ${tab === "upload" ? "bg-white dark:bg-dark-surface text-ink dark:text-dark-ink shadow-sm" : "text-muted"}`}
        >
          <Upload size={12} className="inline mr-1" />Upload
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`px-3 py-1.5 rounded-md transition-colors ${tab === "url" ? "bg-white dark:bg-dark-surface text-ink dark:text-dark-ink shadow-sm" : "text-muted"}`}
        >
          <Link size={12} className="inline mr-1" />URL
        </button>
      </div>

      {tab === "upload" ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-border dark:border-dark-border hover:border-primary"
          }`}
        >
          <input ref={inputRef} type="file" accept="image/*" onChange={onInputChange} className="hidden" />
          {uploading ? (
            <p className="text-sm text-muted animate-pulse">Uploading...</p>
          ) : (
            <>
              <Upload size={24} className="mx-auto text-muted mb-2" />
              <p className="text-sm font-medium text-ink dark:text-dark-ink">Drop image here or click to browse</p>
              <p className="text-xs text-muted mt-1">JPEG, PNG, WebP · Max 5 MB</p>
            </>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyUrl()}
            className="flex-1 border border-border dark:border-dark-border rounded-lg px-3 py-2 text-sm bg-transparent text-ink dark:text-dark-ink outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={applyUrl}
            className="bg-primary text-white text-sm font-semibold rounded-lg px-4 hover:bg-primary-dark transition-colors"
          >
            Apply
          </button>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-border dark:border-dark-border">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => { onChange(""); setUrlInput(""); }}
            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
          >
            <X size={12} />
          </button>
        </div>
      )}
      {!value && (
        <div className="w-32 h-32 rounded-xl border border-dashed border-border dark:border-dark-border flex items-center justify-center text-muted">
          <Image size={28} />
        </div>
      )}
    </div>
  );
}
