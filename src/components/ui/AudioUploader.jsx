
import { useRef, useState } from "react";
import {
  FileAudio,
  Upload,
  Music2,
  AlertCircle,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

function AudioUploader({ onUpload, className = "" }) {
  const inputRef = useRef(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");

  async function handleFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    const validFiles = files.filter((file) =>
      file.type.startsWith("audio/")
    );

    if (validFiles.length !== files.length) {
      setError("Some selected files are not supported audio files.");
    } else {
      setError("");
    }

    if (!validFiles.length) {
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (typeof onUpload !== "function") {
      setError("Audio upload is not connected yet.");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setUploading(true);
    setStatus("");
    let uploaded = 0;

    try {
      for (const file of validFiles) {
        setStatus(`Uploading ${file.name}...`);
        await onUpload(file);
        uploaded += 1;
      }

      setStatus(
        `${uploaded} ${uploaded === 1 ? "file" : "files"} added successfully.`
      );
    } catch (err) {
      setError(err?.message || "An audio file could not be uploaded.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      className={`rounded-2xl bg-[#252933] p-5 shadow-[7px_7px_14px_rgba(0,0,0,0.3),_-7px_-7px_14px_rgba(255,255,255,0.025)] ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        multiple
        disabled={uploading}
        onChange={(event) => handleFiles(event.target.files)}
        className="hidden"
        aria-label="Choose audio files"
      />

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center rounded-xl bg-[#20232B] px-5 py-8 text-center shadow-[inset_4px_4px_8px_rgba(0,0,0,0.3),inset_-4px_-4px_8px_rgba(255,255,255,0.025)] transition hover:outline-1 hover:outline-[#A78BFA] focus-visible:outline-2 focus-visible:outline-[#A78BFA] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#252933] text-[#A78BFA] shadow-[5px_5px_10px_rgba(0,0,0,0.3),_-5px_-5px_10px_rgba(255,255,255,0.025)]">
          {uploading ? (
            <LoaderCircle size={26} className="animate-spin" />
          ) : (
            <FileAudio size={26} />
          )}
        </div>

        <h3 className="mt-4 font-semibold text-[#F0F0F5]">
          {uploading ? "Uploading music..." : "Add music to your queue"}
        </h3>

        <p className="mt-2 text-sm text-[#A0A6B5]">
          Choose one or multiple audio files.
        </p>

        <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#A78BFA] px-4 py-3 text-sm font-semibold text-[#20232B]">
          {uploading ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Upload size={16} />
          )}
          {uploading ? "Please wait..." : "Choose audio files"}
        </span>
      </button>

      {status && (
        <p
          role="status"
          className="mt-4 flex items-center gap-2 text-sm text-[#A0A6B5]"
        >
          <CheckCircle2 size={16} className="shrink-0 text-[#A78BFA]" />
          {status}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="mt-4 flex items-center gap-2 text-sm text-red-400"
        >
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </p>
      )}

      <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#737B8D]">
        <Music2 size={14} />
        Audio uploads will be shared through your room queue once connected.
      </p>
    </div>
  );
}

export default AudioUploader;
