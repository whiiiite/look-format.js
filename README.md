# look-format.js
Lightweight js lib. File viewer for any file formats 

using example: 
```
<div id="file-viewer"><p>test</p></div>

<script src="look-format.js"></script>
<script>
    const exampleText = `your 
    file
    data`;

    view('#file-viewer', 'text.txt', exampleText, {
        padding: '10px',
        fontFamily: 'Tahoma',
        fontSize: '12px',
        numberColor: 'gray',
        textColor: 'wheat',
        marginBetweenStrings: '4px',
        width: '50%',
        height: '50%',
        bg: 'black',
    });

    view('#file-viewer', 'img.png', 
    'img.bmp',
     {
        width: '64px',
        height: '64px',
        padding: '10px'
    });
</script>
```
