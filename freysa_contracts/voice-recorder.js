import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export async function recordVoice(outputPath, durationSeconds = 15) {  
    try {
        const tempPath = "./temp_recording.mp3";
        const noiseProfilePath = "./noise_profile";

        console.log("📝 Sampling background noise (stay quiet)...");
        
        // Record noise profile (1 second of background noise)
        await execAsync(`sox -d -c 1 -r 16000 ${tempPath} trim 0 1`);
        
        // Generate noise profile
        await execAsync(`sox ${tempPath} -n noiseprof ${noiseProfilePath}`);
        
        // Start actual recording
        console.log("🎤 Recording started... Speak now!");
        console.log("⏳ You have 15 seconds to speak...");
        
        // Record audio
        await execAsync(`sox -d -c 1 -r 16000 ${tempPath} trim 0 ${durationSeconds}`);
        
        // Apply noise reduction and normalize volume
        await execAsync(`sox ${tempPath} ${outputPath} noisered ${noiseProfilePath} 0.21 norm`);
        
        // Clean up temporary files
        fs.unlinkSync(tempPath);
        fs.unlinkSync(noiseProfilePath);
        
        console.log("✅ Recording completed and cleaned!");
        return true;
    } catch (error) {
        console.error("Error recording voice:", error.message);
        // Clean up any partial files
        const filesToClean = ['./temp_recording.mp3', './noise_profile', outputPath];
        filesToClean.forEach(file => {
            if (fs.existsSync(file)) {
                fs.unlinkSync(file);
            }
        });
        return false;
    }
}
