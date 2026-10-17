
import supabase from "./supabase";

const BUCKET = "syncroom-audio";
const SIGNED_URL_EXPIRY = 60 * 60;

export async function uploadAudio(file, roomId) {
  if (!file || !file.type.startsWith("audio/")) {
    throw new Error("Please select a valid audio file.");
  }

  if (!roomId) {
    throw new Error("A room ID is required to upload audio.");
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${roomId}/${crypto.randomUUID()}-${safeName}`;

  const { data: uploaded, error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Audio upload failed: ${uploadError.message}`);
  }

  // Use the exact path returned by the successful upload.
  const storedPath = uploaded?.path || filePath;

  const { data, error: urlError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storedPath, SIGNED_URL_EXPIRY);

  if (urlError || !data?.signedUrl) {
    console.error("Signed URL error:", urlError);
    console.error("Uploaded file path:", storedPath);

    throw new Error(
      `Audio uploaded, but its playback URL could not be created: ${
        urlError?.message || "No signed URL returned"
      }. Path: ${storedPath}`
    );
  }

  return {
    audioUrl: data.signedUrl,
    storagePath: storedPath,
    title: file.name.replace(/\.[^/.]+$/, ""),
    artist: "Uploaded audio",
    duration: 0,
  };
}

export async function createAudioSignedUrl(storagePath) {
  if (!storagePath) {
    throw new Error("Audio storage path is required.");
  }

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_EXPIRY);

  if (error || !data?.signedUrl) {
    throw new Error(
      `Could not create audio playback URL for "${storagePath}": ${
        error?.message || "No signed URL returned"
      }`
    );
  }

  return data.signedUrl;
}

export async function deleteAudio(storagePath) {
  if (!storagePath) return;

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (error) {
    throw new Error(`Audio deletion failed: ${error.message}`);
  }
}
