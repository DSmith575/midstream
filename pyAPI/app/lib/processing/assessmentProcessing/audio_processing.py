import os
# import gc
import sys
from pydub import AudioSegment
# from pydub.utils import make_chunks
import time
from app.lib.constants.constants import CHUNK_LENGTH_MS, SILENCE_THRESHOLD, MIN_SILENCE_LEN, PROCESSED_FOLDER
from app.lib.processing.audio.audio_processing import process_chunks
from app.lib.processing.pdfProcessing import save_audio_transcription_to_pdf
from app.lib.aiCompletions.gpt_completions import process_client_audio


def process_audio(audio_path):
    """Main processing function: chunk audio, process, transcribe, and convert."""
    try:
        start_time = time.time()
        # Load audio and clean previous files
        audio = AudioSegment.from_file(audio_path)
        filename = os.path.splitext(os.path.basename(audio_path))[0]

        audio.export(os.path.join(PROCESSED_FOLDER, f"{filename}.wav"), format="wav", bitrate="64k", parameters=["-ar", "16000"])

        # get new audio path
        wav_path = os.path.join(PROCESSED_FOLDER, f"{filename}.wav")
        full_transcription = process_client_audio(wav_path)


        # processed_audio_paths = []

        # # Transcribe each processed chunk and combine transcriptions
        # full_transcription = ""

        # # Process each chunk
        # for i, chunk in enumerate(make_chunks(audio, CHUNK_LENGTH_MS)):
        #     processed_chunk = process_chunks(
        #         chunk, MIN_SILENCE_LEN, SILENCE_THRESHOLD)
        #     processed_chunk_path = os.path.join(
        #         PROCESSED_FOLDER, f"{filename}_chunk{i}.wav")
        #     processed_chunk.export(processed_chunk_path, format="wav")
        #     processed_audio_paths.append(processed_chunk_path)

        # for processed_path in processed_audio_paths:
        #     transcription = process_client_audio(processed_path)
        #     full_transcription += transcription + "\n\n"

        # gc.collect()
        

        # # clean up chunks
        # for processed_path in processed_audio_paths:
        #     try:
        #         # Check if the file exists before removing
        #         if os.path.exists(processed_path):
        #             os.remove(processed_path)
        #             print(f"Removed: {processed_path}")
        #         else:
        #             print(
        #                 f"File not found, skipping removal: {processed_path}")
        #     except Exception as e:
        #         print(f"Error removing {processed_path}: {e}")


        print(f"Processing time: {time.time() - start_time} seconds")
        print(f"Full transcription: {full_transcription}")
        # Save transcription and convert to PDF
        pdf_path = save_audio_transcription_to_pdf(
            full_transcription, filename, PROCESSED_FOLDER)
        return pdf_path
    except Exception as e:
        raise


# --- Entry Point ---
if __name__ == '__main__':
    if len(sys.argv) != 2:
        print("Usage: python audio_process.py <audio_path>")
        sys.exit(1)
    process_audio(sys.argv[1])
