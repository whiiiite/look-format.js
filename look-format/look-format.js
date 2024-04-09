const txtExtensions = ['txt', 'log', 'md', 'cfg', 'ini', 'json', 'xml', 'csv', 'yaml'];
const imgExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'svg', 'webp', 'ico'];
const vidExtensions = ['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'mpeg'];
const audExtentions = ['mp3', 'wav', 'ogg', 'aac'];

async function view(selector, fileName, data, options = null) {
    if (options.readFromNetwork) {
        data = await _getFromNetwork(data);
    }

    return _getView(fileName).view(selector, data, options);
}

function _getView(fileName) {
    const ext = _getFileExtension(fileName).toLowerCase();
    if(txtExtensions.includes(ext)) {
        return new TextView();
    } else if(imgExtensions.includes(ext)) {
        return new ImageView();
    } else if(vidExtensions.includes(ext)) {
        return new VideoView();
    } else if(audExtentions.includes(ext)) {
        return new AudioView();
    }

    function _getFileExtension(fileName) {
        const splited = fileName.split('.');
        return splited.length > 1 ? splited[splited.length - 1] : splited[0];
    }

    return new TextView();
}

async function _getFromNetwork(address) {
    const response = await fetch(address, {}) // type: Promise<Response>
    if (!response.ok) {
        throw Error(response.statusText)
    }
    return response.text();
}

// ===========================================
// START VIEWER CONTAINERS
// ===========================================

class ViewerContainer {
    _viewContainer;
    _options;

    get(options = null) {
        return document.createElement('div');
    }

    _applyOptions() {
    }
}

class TextViewerContainer extends ViewerContainer {
    get(options = null) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.overflow = 'auto';

        const lineCountContainer = document.createElement('div');
        lineCountContainer.style.width = 'fit-content';
        lineCountContainer.style.marginRight = '10px';
        lineCountContainer.classList.add('line-count-container');

        const stringsContainer = document.createElement('div');
        stringsContainer.classList.add('strings-container');

        const resultContainer = document.createElement('div');
        resultContainer.style.whiteSpace = 'pre';
        resultContainer.style.display = 'flex';
        resultContainer.style.flexDirection = 'row';
        resultContainer.classList.add('result-container');
        
        resultContainer.appendChild(lineCountContainer);
        resultContainer.appendChild(stringsContainer);
        container.appendChild(resultContainer);

        this._viewContainer = container;
        this._options = options;

        if(this._options) {
            this._applyOptions();
        }

        return container;
    }

    _getResultContainer() {
        return this._viewContainer.childNodes[0];
    }

    getStringsContainer() {
        return this._viewContainer.childNodes[0].childNodes[1];
    }

    getLineCountContainer() {
        return this._viewContainer.childNodes[0].childNodes[0];
    }

    _getCountElement(count) {
        const div = document.createElement('div');
        div.textContent = count;
        div.style.userSelect = 'none';
        return div;
    }

    _getTextElement(lineText) {
        const div = document.createElement('div');
        div.innerText = lineText;
        return div;
    }

    appendLine(lineText, countLine) {
        const { marginBetweenStrings } = this._options;
        const count = this._getCountElement(countLine);
        const text = this._getTextElement(lineText);
        count.style.marginBottom = marginBetweenStrings || '';
        text.style.marginBottom = marginBetweenStrings || '';
        this.getLineCountContainer().appendChild(count);
        this.getStringsContainer().appendChild(text);
    }

    _applyOptions() {
        const { margin, padding, fontFamily, fontSize, numberColor, textColor, width, height, bg, numerated } = this._options;
        this._viewContainer.style.margin = margin || '';
        this._viewContainer.style.padding = padding || '';
        this._viewContainer.style.fontFamily = fontFamily || '';
        this._viewContainer.style.fontSize = fontSize || '';
        this._viewContainer.style.width = width || '';
        this._viewContainer.style.height = height || '';
        this._viewContainer.style.backgroundColor = bg || '';
        this.getLineCountContainer().style.color = numberColor || '';
        this.getStringsContainer().style.color = textColor || '';
        this.getLineCountContainer().style.display =  (typeof numerated !== 'undefined' ? numerated : true)  ? 'block' : 'none';
    }
}

class ImageViewerContainer extends ViewerContainer {
    _img;

    get(options = null) {
        const container = document.createElement('div');
        const img = document.createElement('img');

        container.appendChild(img);

        this._img = img;
        this._viewContainer = container;
        this._options = options;

        if(this._options) {
            this._applyOptions();
        }

        return container;
    }

    setImage(data) {
        this._img.src = data;
    }

    _applyOptions() {
        const { margin, padding, width, height } = this._options;
        this._viewContainer.style.margin = margin || '';
        this._viewContainer.style.padding = padding || '';
        this._img.style.width = width || '';
        this._img.style.height = height || '';
    }
}

class VideoViewerContainer extends ViewerContainer {
    _video;

    get(options = null) {
        const container = document.createElement('div');
        const video = document.createElement('video');
        video.setAttribute('controls', '');

        container.appendChild(video);

        this._video = video;
        this._viewContainer = container;
        this._options = options;

        if(this._options) {
            this._applyOptions();
        }

        return container;
    }

    setVideo(data) {
        this._video.src = data;
    }

    _applyOptions() {
        const { margin, padding, width, height } = this._options;
        this._viewContainer.style.margin = margin || '';
        this._viewContainer.style.padding = padding || '';
        this._video.style.width = width || '';
        this._video.style.height = height || '';
    }
}

class AudioViewerContainer extends ViewerContainer {
    _audio;

    get(options = null) {
        const container = document.createElement('div');
        const audio = document.createElement('audio');
        audio.setAttribute('controls', '');

        container.appendChild(audio);

        this._audio = audio;
        this._viewContainer = container;
        this._options = options;

        if(this._options) {
            this._applyOptions();
        }

        return container;
    }

    setAudio(data) {
        this._audio.src = data;
    }

    _applyOptions() {
        const { margin, padding, width, height } = this._options;
        this._viewContainer.style.margin = margin || '';
        this._viewContainer.style.padding = padding || '';
        this._audio.style.width = width || '';
        this._audio.style.height = height || '';
    }
}

// ===========================================
// END VIEWER CONTAINERS
// ===========================================



// ===========================================
// START VIEWS
// ===========================================
class View {
    view(selector, fileContent, options = null) {
        
    }
}

class TextView extends View {
    view(selector, fileContent, options = null) {
        const mainContainer = document.querySelector(selector);
        const containerObj = new TextViewerContainer();
        const container = containerObj.get(options);
        mainContainer.appendChild(container);

        let lineCount = 1;
        const contents = fileContent.split('\n');
        if(contents.length > 1) {
            contents.forEach(function(line) {
                if (line.trim() === '') {
                    containerObj.appendLine('\n', lineCount);
                    lineCount++;
                } else {
                    containerObj.appendLine(line, lineCount);
                    lineCount++;
                }
            });
        } else {
            containerObj.appendLine(contents[0], lineCount);
        }

        return container;
    }
}

class ImageView extends View {
    view(selector, content, options = null) {
        const mainContainer = document.querySelector(selector);
        const containerObj = new ImageViewerContainer();
        const container = containerObj.get(options);
        mainContainer.appendChild(container)
        containerObj.setImage(content);

        return container;
    }
}

class VideoView extends View {
    view(selector, content, options = null) {
        const mainContainer = document.querySelector(selector);
        const containerObj = new VideoViewerContainer();
        const container = containerObj.get(options);
        mainContainer.appendChild(container)
        containerObj.setVideo(content);

        return container;
    }
}

class AudioView extends View {
    view(selector, content, options = null) {
        const mainContainer = document.querySelector(selector);
        const containerObj = new AudioViewerContainer();
        const container = containerObj.get(options);
        mainContainer.appendChild(container)
        containerObj.setAudio(content);

        return container;
    }
}
// ===========================================
// END VIEWS
// ===========================================

