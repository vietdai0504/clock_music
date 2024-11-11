import os
from tkinter import Tk, Label, Button, Entry, filedialog, messagebox, StringVar, Radiobutton, IntVar, OptionMenu, Frame, PhotoImage
from yt_dlp import YoutubeDL
from pydub import AudioSegment
from pydub.utils import which

def download_content():
    link = url_entry.get()
    save_path = folder_entry.get()
    file_name = name_entry.get()
    download_type = download_type_var.get()
    resolution = resolution_var.get()
    
    if not link or not save_path or not file_name:
        messagebox.showwarning("Cảnh báo", "Vui lòng điền đầy đủ thông tin.")
        return

    try:
        ydl_opts = {
            'outtmpl': os.path.join(save_path, f"{file_name}.%(ext)s"),
            'format': 'mp4',
            'quiet' : True,
        }
        if resolution:  # Chỉ thêm độ phân giải nếu được chọn
            ydl_opts['format'] = f"bestvideo[height={resolution.rstrip('p')}]+bestaudio/best"
        with YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(link, download=True)
            if download_type == 1:  # Convert to mp3 if audio download
                video_path = ydl.prepare_filename(info_dict)
                audio_path = os.path.splitext(video_path)[0] + '.mp3'
                
                # Ensure pydub finds ffmpeg
                ffmpeg_path = which("ffmpeg")  # Lấy đường dẫn đến ffmpeg
                if ffmpeg_path:
                    AudioSegment.converter = ffmpeg_path
                    AudioSegment.ffmpeg = ffmpeg_path
                    AudioSegment.ffprobe = ffmpeg_path
                
                audio = AudioSegment.from_file(video_path)
                audio.export(audio_path, format="mp3")
                os.remove(video_path)
                messagebox.showinfo("Thông báo", f"Tải xong: {audio_path}")
            else:
                messagebox.showinfo("Thông báo", f"Tải xong: {ydl.prepare_filename(info_dict)}")

    except Exception as e:
        messagebox.showerror("Lỗi", str(e))

def browse_folder():
    folder_path = filedialog.askdirectory()
    folder_entry.delete(0, 'end')
    folder_entry.insert(0, folder_path)

def fetch_resolutions():
    link = url_entry.get()
    if not link:
        messagebox.showwarning("Cảnh báo", "Vui lòng nhập link trước.")
        return
    
    try:
        ydl_opts = {}
        with YoutubeDL(ydl_opts) as ydl:
            info_dict = ydl.extract_info(link, download=False)
            formats = info_dict.get('formats', [])
            resolutions = [f"{f['height']}p" for f in formats if f.get('height') and f.get('vcodec') != 'none']
            resolutions = sorted(set(resolutions), key=lambda x: int(x.rstrip('p')))

            # Cập nhật menu độ phân giải
            resolution_menu['menu'].delete(0, 'end')
            for res in resolutions:
                resolution_menu['menu'].add_command(label=res, command=lambda value=res: resolution_var.set(value))
    except Exception as e:
        messagebox.showerror("Lỗi", str(e))

# Tạo cửa sổ chính
root = Tk()
root.title("Tải Nhạc hoặc Video từ YouTube, Facebook, TikTok")
root.iconbitmap("icon.ico")  # Đặt biểu tượng cho cửa sổ (nếu có)

# Đặt kích thước cố định cho cửa sổ
window_width = 600
window_height = 400
root.geometry(f"{window_width}x{window_height}")
root.resizable(False, False)  # Vô hiệu hóa thay đổi kích thước

# Tạo khung chứa các thành phần giao diện
frame = Frame(root, padx=10, pady=10, bg="lightblue")
frame.pack(expand=True, fill="both")

# Thêm logo hoặc hình ảnh
# image = PhotoImage(file="logo.png")  # Đường dẫn đến file ảnh (nếu có)
# logo_label = Label(frame, image=image, bg="lightblue")
# logo_label.grid(row=0, column=0, columnspan=3, pady=10)

# Các thành phần giao diện
Label(frame, text="Link Video:", bg="lightblue", font=("Helvetica", 10)).grid(row=1, column=0, padx=10, pady=10, sticky="e")
url_entry = Entry(frame, width=50)
url_entry.grid(row=1, column=1, padx=10, pady=10, columnspan=2)

Label(frame, text="Đặt tên file:", bg="lightblue", font=("Helvetica", 10)).grid(row=2, column=0, padx=10, pady=10, sticky="e")
name_entry = Entry(frame, width=50)
name_entry.grid(row=2, column=1, padx=10, pady=10, columnspan=2)

Label(frame, text="Chọn thư mục:", bg="lightblue", font=("Helvetica", 10)).grid(row=3, column=0, padx=10, pady=10, sticky="e")
folder_entry = Entry(frame, width=50)
folder_entry.grid(row=3, column=1, padx=10, pady=10)
Button(frame, text="Duyệt", command=browse_folder, bg="white", font=("Helvetica", 10)).grid(row=3, column=2, padx=10, pady=10)

# Tùy chọn tải nhạc hoặc video
download_type_var = IntVar(value=1)
Radiobutton(frame, text="Tải Nhạc", variable=download_type_var, value=1, bg="lightblue", font=("Helvetica", 10)).grid(row=4, column=0, padx=10, pady=10)
Radiobutton(frame, text="Tải Video", variable=download_type_var, value=2, bg="lightblue", font=("Helvetica", 10)).grid(row=4, column=1, padx=10, pady=10)

# Lựa chọn độ phân giải video
resolution_var = StringVar()
resolution_var.set("")  # Khởi tạo giá trị ban đầu là rỗng
resolution_label = Label(frame, text="Chọn độ phân giải:", bg="lightblue", font=("Helvetica", 10))
resolution_label.grid(row=5, column=0, padx=10, pady=10, sticky="e")
resolution_menu = OptionMenu(frame, resolution_var, "")
resolution_menu.grid(row=5, column=1, padx=10, pady=10)
Button(frame, text="Lấy độ phân giải", command=fetch_resolutions, bg="white", font=("Helvetica", 10)).grid(row=5, column=2, padx=10, pady=10)

Button(frame, text="Tải", command=download_content, width=20, height=2, bg="green", fg="white", font=("Helvetica", 12, "bold")).grid(row=6, column=0, columnspan=3, pady=20)

root.mainloop()