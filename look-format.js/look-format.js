const txtExtensions = ['txt', 'log', 'md', 'cfg', 'ini', 'json', 'xml', 'csv', 'yaml'];
const imgExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'svg', 'webp', 'ico'];

function view(selector, fileName, fileContent, options = null) {
    return _getView(fileName).view(selector, fileContent, options);
}

function _getView(fileName) {
    const ext = _getFileExtension(fileName);
    if(txtExtensions.includes(ext)) {
        return new TextView();
    } else if(imgExtensions.includes(ext)) {
        return new ImageView();
    }

    return new TextView();
}

function _getFileExtension(fileName) {
    const splited = fileName.split('.');
    return splited.length > 1 ? splited[splited.length - 1] : splited[0];
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
        container.style.whiteSpace = 'nowrap';
        container.style.display = 'flex';
        container.style.flexDirection = 'row';

        const lineCountContainer = document.createElement('div');
        lineCountContainer.style.width = '3%';

        container.appendChild(lineCountContainer);

        const stringsContainer = document.createElement('div');
        stringsContainer.style.overflow = 'auto';
        stringsContainer.style.whiteSpace = 'nowrap';

        container.appendChild(stringsContainer);
        this._viewContainer = container;
        this._options = options;

        if(this._options) {
            this._applyOptions();
        }

        return container;
    }

    getStringsContainer() {
        return this._viewContainer.childNodes[1];
    }

    getLineCountContainer() {
        return this._viewContainer.childNodes[0];
    }

    _getCountElement(count) {
        const div = document.createElement('div');
        div.textContent = count;
        div.style.marginRight = '10px';
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
        const { margin, padding, fontFamily, fontSize, numberColor, textColor } = this._options;
        this._viewContainer.style.margin = margin || '';
        this._viewContainer.style.padding = padding || '';
        this._viewContainer.style.fontFamily = fontFamily || '';
        this._viewContainer.style.fontSize = fontSize || '';
        this.getLineCountContainer().style.color = numberColor || '';
        this.getStringsContainer().style.color = textColor || '';
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

    setImageBase64(string) {
        this._img.src = string;
    }

    _applyOptions() {
        const { margin, padding, width, height } = this._options;
        this._viewContainer.style.margin = margin || '';
        this._viewContainer.style.padding = padding || '';
        this._img.style.width = width || '';
        this._img.style.height = height || '';
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
    view(selector, fileContent, options = null) {
        const mainContainer = document.querySelector(selector);
        const containerObj = new ImageViewerContainer();
        const container = containerObj.get(options);
        mainContainer.appendChild(container)
        containerObj.setImageBase64(fileContent);

        return container;
    }
}
// ===========================================
// END VIEWS
// ===========================================

