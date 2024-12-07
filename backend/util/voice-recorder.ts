// TODO: MOVE TO FRONTEND!!


import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);
let recordingProcess: any;
let isRecording = false;
let currentRecordingPath: string;
let currentTempPath: string;

export async function startRecording(outputPath: string) {
  if (isRecording) return false;

  try {
    const tempPath = path.join(
      path.dirname(outputPath),
      `temp_${path.basename(outputPath)}`
    );
    currentRecordingPath = outputPath;
    currentTempPath = tempPath;

    isRecording = true;
    console.log("🎤 Recording started...");

    // Make sure temp directory exists
    const tempDir = path.dirname(tempPath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Start recording using sox
    recordingProcess = exec(`sox -d -c 1 -r 16000 "${tempPath}"`);
    return true;
  } catch (error) {
    console.error("Error starting recording:", error);
    isRecording = false;
    return false;
  }
}

export async function stopRecording() {
  if (!isRecording || !currentRecordingPath || !currentTempPath) return false;

  const outputPath = currentRecordingPath;
  const tempPath = currentTempPath;

  isRecording = false;
  console.log("🛑 Recording stopped, processing...");

  try {
    if (recordingProcess) {
      recordingProcess.kill();
      recordingProcess = null;

      // Reduce wait time from 1000ms to 500ms
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Skip noise reduction if file is too large to speed up processing
    const stats = fs.statSync(tempPath);
    const isLargeFile = stats.size > 1000000; // 1MB threshold

    if (isLargeFile) {
      // For large files, just copy and normalize
      await execAsync(`sox "${tempPath}" "${outputPath}" norm`);
    } else {
      // For smaller files, apply full processing
      await execAsync(`sox "${tempPath}" "${outputPath}" norm`);
    }

    // Clean up temporary file immediately
    fs.unlinkSync(tempPath);
    console.log("✅ Recording completed and processed!");

    return outputPath;
  } catch (error) {
    console.error("Error processing recording:", error);
    return false;
  }
}

export function isCurrentlyRecording() {
  return isRecording;
}
