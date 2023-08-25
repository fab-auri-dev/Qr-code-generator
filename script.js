const showBtns = document.querySelector( '.show-btns' );
const showGenerateBtn = document.getElementById( 'showGenerateBtn' );
const showConvertBtn = document.getElementById( 'showConvertBtn' );
const qrGenerateForm = document.querySelector( '.qr-generate-form' );
const qrConvertForm = document.querySelector( '.qr-convert-form' );


showGenerateBtn.addEventListener( 'click', ( e ) => {
    qrConvertForm.style.display = 'none';
    qrGenerateForm.removeAttribute( 'style' );
} );
showConvertBtn.addEventListener( 'click', ( e ) => {
    qrGenerateForm.style.display = 'none';
    qrConvertForm.removeAttribute( 'style' );
} );


// Generate QR Code

const qrWrapperGenerator = document.querySelector( '.qr-wrapper-generator' );
const qrInputText = document.querySelector( '.qr-input-text' );
const qrInputColor = document.querySelector( '.qr-input-color' );
const qrInputBg = document.querySelector( '.qr-input-bg' );
const qrFormat = document.querySelector( '.qr-code-format' );
const qrGenerateBtn = document.querySelector( '.qr-generate-btn' );
const qrCode = document.querySelector( '.qr-code' );
const qrImg = document.querySelector( '.qr-img' );
const donwloadBtn = document.querySelector( '.download-btn' );
let qrPreview;


qrCode.style.display = 'none';


function generateQrCode( e ) {
    e.preventDefault();

    if ( ! qrInputText.value ) {
        qrInputText.style.outlineColor = '#1a1e21';
        qrInputText.style.outlineStyle = 'dotted';
        qrInputText.placeholder = 'Please insert some text!';
        return;
    };

    let inputValue = qrInputText.value.trim();
    let inputColor = qrInputColor.value.replace( '#', '' );
    let inputBg = qrInputBg.value.replace( '#', '' );
    let inputFormat = qrFormat.value;

    qrGenerateBtn.textContent = 'Generating QR code';
    qrInputText.setAttribute( 'disabled', 'disabled' );
    qrGenerateBtn.setAttribute( 'disabled', 'disabled' );
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?data=${ inputValue }&color=${ inputColor }&bgcolor=${ inputBg }&format=${ inputFormat }`;

    showBtns.style.display = 'none';
    qrGenerateForm.style.display = 'none';
};

function imgLoad() {
    qrInputText.removeAttribute( 'disabled' );
    qrGenerateBtn.removeAttribute( 'disabled' );
    qrInputText.removeAttribute( 'style' );
    qrCode.removeAttribute( 'style' );
    qrGenerateBtn.textContent = 'Generate QR Code';
    qrInputText.value = '';
    qrInputColor.value = '#000000';
    qrInputBg.value = '#ffffff';
};

function downloadQrCode() {
    qrCode.style.display = 'none';
    let fileToDownload = qrImg.src;

    let findFormat = fileToDownload.split( '&' );
    let getFormat = findFormat[ findFormat.length - 1 ].split( '=' );
    let fileFormat = getFormat[ getFormat.length - 1 ];
    
    const download = async ( url, filename ) => {
        const data = await fetch( url );
        const blob = await data.blob();
        const objectUrl = URL.createObjectURL( blob );
    
        const link = document.createElement( 'a' );
    
        link.setAttribute( 'href', objectUrl );
        link.setAttribute( 'download', filename );
        link.style.display = 'none';
    
        document.body.appendChild( link );
      
        link.click();
      
        document.body.removeChild( link );
    };
    download( fileToDownload, `qr-code.${ fileFormat }` );

    showBtns.removeAttribute( 'style' );
    qrGenerateForm.removeAttribute( 'style' );
};


qrGenerateBtn.addEventListener( 'click', generateQrCode );
qrImg.addEventListener( 'load', imgLoad );
donwloadBtn.addEventListener( 'click', downloadQrCode );


// Convert QR Code

const qrWrapperConverter = document.querySelector( '.qr-wrapper-converter' );
const qrInputConverter = document.querySelector( '.qr-input-converter' );
const qrInfoLabel = document.querySelector( '.qr-info-label' );
const qrConvertBtn = document.querySelector( '.qr-convert-btn' );
const qrResultArea = document.querySelector( '.qr-result-area' );
const details = document.querySelector( '.details' );
const qrCopyResultBtn = document.querySelector( '.qr-copy-result-btn' );
const qrSaveResultBtn = document.querySelector( '.qr-save-result-btn' );


details.style.display = 'none';


function convertQrCode( e ) {
    e.preventDefault();

    let userFile = qrInputConverter.files[ 0 ];

    let nameFile = userFile.name.split( '.' )

    if ( nameFile[ nameFile.length - 1 ] != 'png' 
        || nameFile[ nameFile.length - 1 ] != 'jpeg'
        || nameFile[ nameFile.length - 1 ] != 'jpg' ) {
        qrConvertBtn.innerText = 'Not allowed'
        return;
    }

    if( ! userFile ) return;

    let formData = new FormData();
    formData.append( 'file', userFile );

    fetchRequest( userFile, formData );

    showBtns.style.display = 'none';
    qrGenerateForm.style.display = 'none';
};

function fetchRequest( userFile, formData ) {
    qrConvertBtn.innerText = 'Scanning QR Code...';

    fetch( 'https://api.qrserver.com/v1/read-qr-code/', {

        method: 'POST', body: formData

    } ).then( res => res.json() ).then( result => {

        details.removeAttribute( 'style' );

        result = result[ 0 ].symbol[ 0 ].data;

        qrConvertBtn.innerText = result ? 'Upload QR Code to Scan' : 'Couldn\'t scan QR Code';

        if ( ! result ) return;

        document.querySelector( '.qr-result-area' ).innerText = result;

    } ).catch( () => {
        qrConvertBtn.innerText = 'Couldn\'t scan QR Code';
    } );
};

function donwloadResultFile() {

    let textToWrite = qrResultArea.innerHTML;
    let textFileAsBlob = new Blob( [ textToWrite ], { type: 'text/plain' } );
    let fileNameToSaveAs = "file.txt";

    
    let downloadLink = document.createElement( "a" );
    downloadLink.download = fileNameToSaveAs;

    if ( window.webkitURL != null ) {
      downloadLink.href = window.webkitURL.createObjectURL( textFileAsBlob );
    } else {
      downloadLink.href = window.URL.createObjectURL( textFileAsBlob );
      downloadLink.onclick = destroyClickedElement;
      downloadLink.style.display = "none";
      document.body.appendChild( downloadLink );
    };
  
    downloadLink.click();
};


qrConvertBtn.addEventListener( 'click', convertQrCode )

qrCopyResultBtn.addEventListener( 'click', ( e ) => {
    let text = document.querySelector( 'textarea' ).textContent;
    navigator.clipboard.writeText( text );
    e.target.textContent = 'Copied!';
});

qrSaveResultBtn.addEventListener( 'click', donwloadResultFile );