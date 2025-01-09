import { FileLoader, FileRepository, Plugin, SimpleUploadConfig, UploadAdapter, UploadResponse } from 'ckeditor5';

import { TokenProvider } from '@/auth/token.provider';
import { CKEDITOR_REFRESH_TOKEN_URL } from '@/common/app.constants';

export default class ImageUploadAdapter extends Plugin {
  static get requires() {
    return [FileRepository];
  }

  static get pluginName() {
    return 'ImageUploadAdapter';
  }

  init() {
    const options = this.editor.config.get('simpleUpload');

    if (!options) {
      return;
    }

    if (!options.uploadUrl) {
      console.warn('Missing the "uploadUrl" property in the "simpleUpload" editor configuration.');
      return;
    }

    this.editor.plugins.get(FileRepository).createUploadAdapter = (loader) => {
      return new Adapter(loader, options);
    };
  }
}

class Adapter implements UploadAdapter {
  loader: FileLoader;
  options: SimpleUploadConfig;
  xhr!: XMLHttpRequest;

  constructor(loader: FileLoader, options: SimpleUploadConfig) {
    this.loader = loader;
    this.options = options;
  }

  upload(): Promise<UploadResponse> {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          if (!file) {
            reject('Не вдалося завантажити файл.');
            return;
          }

          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        }),
    );
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());

    xhr.open('POST', this.options.uploadUrl, true);
    xhr.responseType = 'json';
  }

  _initListeners(
    resolve: (value: UploadResponse | PromiseLike<UploadResponse>) => void,
    reject: (reason?: unknown) => void,
    file: File,
    retries: number = 1,
  ) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Не вдалося завантажити файл: ${file.name}.`;

    xhr.addEventListener('error', () => reject(genericErrorText));
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;

      if (xhr.status === 401 && retries > 0) {
        return this._refreshToken()
          .then(() => {
            this._initRequest();
            this._initListeners(resolve, reject, file, retries - 1);
            this._sendRequest(file);
          })
          .catch(() => reject('У доступі відмовлено.'));
      }

      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText);
      }

      resolve({
        default: response.url,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          loader.uploadTotal = event.total;
          loader.uploaded = event.loaded;
        }
      });
    }
  }

  _sendRequest(file: File) {
    this.xhr.withCredentials = this.options.withCredentials ?? false;
    const headers = this.options.headers || {};

    for (const headerName of Object.keys(headers)) {
      this.xhr.setRequestHeader(headerName, headers[headerName]);
    }

    const data = new FormData();
    data.append('upload', file);

    this.xhr.send(data);
  }

  async _refreshToken() {
    const response = await fetch(CKEDITOR_REFRESH_TOKEN_URL, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        refreshToken: TokenProvider.getRefreshToken(),
      }),
    });

    const data = await response.json();

    TokenProvider.setAccessToken(data.accessToken);
    TokenProvider.setRefreshToken(data.refreshToken);

    this.options.headers ??= {};
    this.options.headers['Authorization'] = `Bearer ${TokenProvider.getAccessToken()}`;
  }
}
