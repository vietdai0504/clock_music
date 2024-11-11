from pytube import YouTube
from pydub import AudioSegment
from pydub.utils import which
import os

def download_audio_from_youtube(link,i, output_path='audio'):
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    
    yt = YouTube(link)
    video = yt.streams.filter(only_audio=True).first()

    temp_file = os.path.join(output_path, 'temp_audio.mp4')
    video.download(output_path, filename='temp_audio.mp4')
    
    AudioSegment.converter = which("ffmpeg")
    AudioSegment.ffmpeg = which("ffmpeg")
    AudioSegment.ffprobe = which("ffprobe")
    
    audio = AudioSegment.from_file(temp_file)
    audio_file = os.path.join(output_path, f"audio_{i}.mp3")
    audio.export(audio_file, format="mp3")
    
    os.remove(temp_file)
    
    print(f"Tải xong: {audio_file}")
list_link = [
    'https://www.youtube.com/watch?v=OvLRybrkoaE',
    'https://www.youtube.com/watch?v=abPmZCZZrFA',
    'https://www.youtube.com/watch?v=0xAW6MAT_Wo',
    'https://www.youtube.com/watch?v=UEQ57U1WwVY',
    'https://www.youtube.com/watch?v=lvrM10KQsuo',
    'https://www.youtube.com/watch?v=IC2LGrtVuh4',
    'https://www.youtube.com/watch?v=IJML-4ZYejA',
    'https://www.youtube.com/watch?v=hhmslWPg8b4',
    'https://www.youtube.com/watch?v=OuNo8Tkb3lI',
    'https://www.youtube.com/watch?v=wht8Kg5u0nc',
    'https://www.youtube.com/watch?v=k9iW6OBOhZ4',
    'https://www.youtube.com/watch?v=f186dvntdDs',
    'https://www.youtube.com/watch?v=UGrtPQoWWrA',
    'https://www.youtube.com/watch?v=SArtYGfALY4',
    'https://www.youtube.com/watch?v=rfMKIFf1sXE',
    'https://www.youtube.com/watch?v=TpIqDm031gg',
    'https://www.youtube.com/watch?v=kSjj0LlsqnI',
]

i = 2

for link in list_link:
    download_audio_from_youtube(link,i)
    i+=1
