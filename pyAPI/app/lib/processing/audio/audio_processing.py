"""Audio processing module for transcription and format conversion."""
import os
import re
import logging
from io import BytesIO

from pydub import AudioSegment
from pydub.silence import detect_silence
import noisereduce as nr
import numpy as np
from fastapi import UploadFile
from openai import OpenAI

# Configure logging
logger = logging.getLogger(__name__)

# Lazy-initialized OpenAI client to avoid import-time failures when env is missing
client: OpenAI | None = None


def get_openai_client() -> OpenAI:
    """Return a cached OpenAI client, validating that the API key exists."""
    global client
    if client:
        return client

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        logger.error("OPENAI_API_KEY environment variable is not set")
        raise RuntimeError("OPENAI_API_KEY environment variable is required")

    client = OpenAI(api_key=api_key)
    return client


def convert_to_wav(file: UploadFile, filename: str) -> BytesIO:
    """
    Convert audio file to .wav format using pydub.
    
    Args:
        file: The audio file to convert
        filename: The filename (without extension)
    
    Returns:
        BytesIO buffer containing the WAV data
    
    Raises:
        Exception: If conversion fails
    """
    try:
        # Determine the input format from the file extension
        file_extension = file.filename.rsplit('.', 1)[-1].lower() if file.filename else 'wav'
        
        # Special handling for webm files
        if file_extension == 'webm':
            # pydub can handle webm, but we need to specify the format explicitly
            input_audio = AudioSegment.from_file(file.file, format='webm')
        elif file_extension == 'ogg':
            input_audio = AudioSegment.from_file(file.file, format='ogg')
        else:
            # For other formats, let pydub auto-detect
            input_audio = AudioSegment.from_file(file.file)
        
        output_buffer = BytesIO()
        # Export as high-quality WAV for better transcription
        input_audio.export(
            output_buffer,
            format="wav",
            parameters=["-ar", "16000", "-ac", "1"]  # 16kHz mono - optimal for Whisper
        )
        output_buffer.seek(0)
        output_buffer.name = f"{filename}.wav"
        logger.info(f"Successfully converted {filename} ({file_extension}) to WAV format")
        return output_buffer
    except Exception as e:
        logger.error(f"Error converting audio to WAV: {e}")
        raise


def process_chunks(chunk, min_silence_len: int = 1000, silence_threshold: int = -40):
    """
    Reduce noise and trim silence from an audio chunk.
    
    Args:
        chunk: The audio chunk to process
        min_silence_len: Minimum silence duration in milliseconds (default: 1000)
        silence_threshold: Silence threshold in dB (default: -40)
    
    Returns:
        Processed AudioSegment with noise reduced and silence trimmed
    
    Raises:
        Exception: If processing fails
    """
    try:
        # Reduce noise
        reduced_chunk = nr.reduce_noise(
            y=np.array(chunk.get_array_of_samples()),
            sr=chunk.frame_rate,
            prop_decrease=0.8
        )
        
        # Reconstruct audio from reduced samples
        audio = AudioSegment(
            reduced_chunk.tobytes(),
            frame_rate=chunk.frame_rate,
            sample_width=chunk.sample_width,
            channels=chunk.channels
        )

        # Trim silence
        silences = detect_silence(
            audio,
            min_silence_len=min_silence_len,
            silence_thresh=silence_threshold
        )
        
        if silences:
            return audio[silences[0][0]:silences[-1][1]]
        return audio
    except Exception as e:
        logger.error(f"Error processing chunk: {e}")
        raise


def transcribe_audio_to_paragraphs(audio_file: UploadFile) -> list[str]:
    """
    Transcribe audio file to text using OpenAI Whisper API and split into paragraphs.
    
    Args:
        audio_file: The audio file to transcribe (supports mp3, mp4, mpeg, mpga, m4a, wav, webm)
    
    Returns:
        List of paragraphs (strings)
    
    Raises:
        Exception: If transcription fails
    """
    try:
        logger.info(f"Starting transcription for {audio_file.filename}")
        
        # Ensure the file buffer is at the beginning
        if hasattr(audio_file.file, 'seek'):
            audio_file.file.seek(0)
        
        # Transcribe audio using OpenAI Whisper with improved settings
        transcript = get_openai_client().audio.transcriptions.create(
            model="whisper-1",
            file=audio_file.file,
            language="en",
            response_format="text",
            temperature=0.0,  # More deterministic transcription
        )
        
        # Get the transcribed text
        text = transcript if isinstance(transcript, str) else transcript.text
        logger.info(f"Transcription completed: {len(text)} characters")
        
        if not text or len(text.strip()) < 10:
            logger.warning(f"Transcription resulted in very short or empty text: '{text}'")
            return ["No speech detected in the audio recording. Please try recording again and speak clearly into the microphone."]
        
        # Split into paragraphs using sentence boundaries and natural breaks
        paragraphs = split_into_paragraphs(text)
        logger.info(f"Split transcription into {len(paragraphs)} paragraphs")
        
        return paragraphs
    except Exception as e:
        logger.error(f"Error transcribing audio: {e}", exc_info=True)
        raise


def split_into_paragraphs(text: str, max_lines: int = 3) -> list[str]:
    """
    Split transcribed text into logical paragraphs.
    
    Uses sentence boundaries and groups sentences to create readable paragraphs.
    
    Args:
        text: The transcribed text
        max_lines: Maximum number of sentences per paragraph (default: 3)
    
    Returns:
        List of paragraphs
    
    Raises:
        ValueError: If text is empty
    """
    if not text or not text.strip():
        raise ValueError("Text cannot be empty")
    
    # Split by common sentence endings and preserve punctuation
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    
    # Remove empty sentences
    sentences = [s.strip() for s in sentences if s.strip()]
    
    if not sentences:
        return [text.strip()]
    
    # Group sentences into paragraphs
    paragraphs = []
    current_paragraph = []
    
    for sentence in sentences:
        current_paragraph.append(sentence)
        
        # Create a new paragraph after max_lines sentences
        if len(current_paragraph) >= max_lines:
            paragraphs.append(' '.join(current_paragraph))
            current_paragraph = []
    
    # Add any remaining sentences
    if current_paragraph:
        paragraphs.append(' '.join(current_paragraph))
    
    return paragraphs