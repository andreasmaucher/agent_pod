import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);
let recordingProcess = null;
let isRecording = false;
let currentRecordingPath = null;
let currentTempPath = null;

export async function startRecording(outputPath) {
  if (isRecording) return false;
  
  try {
    const tempPath = path.join(path.dirname(outputPath), `temp_${path.basename(outputPath)}`);
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
    // First check if the recording process exists
    if (recordingProcess) {
      recordingProcess.kill();
      recordingProcess = null;
      
      // Wait a bit for the file to be fully written
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Check if temp file exists and has content
    if (!fs.existsSync(tempPath)) {
      console.error("❌ No recording file was created");
      return false;
    }

    const stats = fs.statSync(tempPath);
    if (stats.size === 0) {
      console.error("❌ Recording file is empty");
      fs.unlinkSync(tempPath);
      return false;
    }

    // Make sure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Make sure the output file doesn't exist
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    // Apply noise reduction and normalize volume
    console.log("✨ Processing recording...");
    await execAsync(`sox "${tempPath}" "${outputPath}" norm`);

    // Verify the output file
    if (!fs.existsSync(outputPath)) {
      throw new Error("Failed to create processed audio file");
    }

    const outputStats = fs.statSync(outputPath);
    if (outputStats.size === 0) {
      throw new Error("Processed audio file is empty");
    }

    // Clean up temporary file
    fs.unlinkSync(tempPath);
    console.log("✅ Recording completed and processed!");
    
    // Return the output path for the backend to use
    return outputPath;
  } catch (error) {
    console.error("Error processing recording:", error);
    // Clean up any partial files
    [tempPath, outputPath].forEach(file => {
      if (fs.existsSync(file)) {
        try {
          fs.unlinkSync(file);
        } catch (e) {
          console.error(`Failed to clean up file ${file}:`, e.message);
        }
      }
    });
    return false;
  } finally {
    currentRecordingPath = null;
    currentTempPath = null;
  }
}

export function isCurrentlyRecording() {
  return isRecording;
}
