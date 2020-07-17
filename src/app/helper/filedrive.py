import os
from datetime import datetime
from werkzeug.utils import secure_filename
import urllib.request

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
upload_dir = os.path.join(basedir, 'upload')
MAX_CONTENT_LENGTH = 128 * 1024 * 1024  # 128Mb
ALLOWED_EXTENSIONS = set(['wav', 'mp3', 'jpg', 'jpeg', 'png', 'zip'])


def allowed_file(filename):
    return '.' in filename and filename.rsplit(
        '.', 1)[1].lower() in ALLOWED_EXTENSIONS


def saveToFile(folder_name, name, ext, data):
    filename = secure_filename(name) + '.' + ext

    # create upload folder
    currentDateDir = os.path.join(
        upload_dir, folder_name + '/' + datetime.today().strftime('%Y/%m'))
    os.makedirs(currentDateDir, exist_ok=True)
    file_path = os.path.join(currentDateDir, filename)

    # write file
    file = open(file_path, "w")
    file.write(data)
    file.close()

    return datetime.today().strftime('%Y/%m') + '/' + filename


def downloadFromUrl(folder_name, dest_url):
    f_name, f_ext = os.path.splitext(secure_filename(dest_url))
    if f_ext not in ALLOWED_EXTENSIONS:
        f_ext = '.jpg'
    filename = f_name + f_ext

    # create upload folder
    currentDateDir = os.path.join(
        upload_dir, folder_name + '/' + datetime.today().strftime('%Y/%m'))
    os.makedirs(currentDateDir, exist_ok=True)
    file_path = os.path.join(currentDateDir, filename)

    try:
        opener = urllib.request.build_opener()
        opener.addheaders = [(
            'User-Agent',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.1 Safari/603.1.30'
        )]
        urllib.request.install_opener(opener)
        urllib.request.urlretrieve(dest_url, file_path)
    except urllib.error.URLError as e:
        print(e.reason)
        pass

    return datetime.today().strftime('%Y/%m') + '/' + filename


def read(filepath):
    try:
        file = open(os.path.join(filepath), encoding="utf-8")
        content = file.read()
    except IOError:
        raise Exception("File not found or path is incorrect")
    finally:
        file.close()

    return content


def write(filepath, content):
    try:
        file = open(os.path.join(filepath), 'w', encoding="utf-8")
        file.write(content)
    except IOError:
        raise Exception("File not found or path is incorrect")
    finally:
        file.close()

    return True


def create(filepath, type, name):
    finalPath = os.path.join(filepath + '/' + name)
    if type == 'FILE':
        if not os.path.exists(finalPath):
            try:
                file = open(finalPath, 'w')
            except IOError:
                raise Exception("File not found or path is incorrect")
            finally:
                file.close()
        else:
            raise Exception('File existed')
    elif type == 'DIRECTORY':
        if not os.path.exists(finalPath):
            try:
                os.makedirs(finalPath)
                try:
                    file = open(finalPath + '/.keep', 'w')
                except IOError:
                    raise Exception("File not found or path is incorrect")
                finally:
                    file.close()
            except IOError:
                raise Exception("File not found or path is incorrect")
        else:
            raise Exception('Directory existed')

    return True


def delete(filepath):
    finalPath = os.path.join(filepath)
    if os.path.isfile(finalPath):
        os.remove(finalPath)
    elif os.path.isdir(finalPath):
        shutil.rmtree(finalPath)
    else:
        raise ValueError("file {} is not a file or dir.".format(finalPath))

    return True
