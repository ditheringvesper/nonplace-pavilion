
const desktopGridWrapper = document.querySelector('.desktopGridWrapper');
var totalIconNum = 99;
var mainIconIndexLimit = 33;
var mainIconArr = getMainIconIndexes(mainIconIndexLimit);

for(let i =0; i<=totalIconNum; i++){
    var randFolder = document.createElement("div");
    var randFolderIcon = document.createElement('img');
    var randFolderNameBox = document.createElement('span');
    var folderNameText;

    if(i<=mainIconIndexLimit && mainIconArr.includes(i)){
        var linktag = document.createElement('a');
            // + hyperlink -> 除了nonplace都是popup

        if( i == mainIconArr[0]){
            randFolder.id = 'nonplaceicon';
            folderNameText = 'nonplace.site';
            randFolderIcon.src = '/OS/bit-icons/FOLDER.png'; // bit folder
            randFolderIcon.classList.toggle('blink');
            randFolder.addEventListener('dblclick', function() { // to gallery page
                window.open('https://nonplace.site/Users', '', 'width=1400,height=800');
                window.close();
                // location.href = '...'
            }, false);
        }
        if( i == mainIconArr[1]){
            randFolder.id = 'thewrongicon';
            folderNameText = 'TheWrong';
            randFolderIcon.src = '/OS/thewrongbiennale-logo-white.png'; // the wrong biennale logo
            // the wrong biennale credit popup as an image file -> link to the wrong
            randFolder.addEventListener('dblclick', function() { // to the wrong page
                var thewrong = window.open('https://thewrong.org/', 'TheWrong', 'width=1400,height=800');
                thewrong.addEventListener('resize', ()=>{ thewrong.resizeTo(1400, 800)});
            }, false);
        }
        if( i == mainIconArr[2]){
            randFolder.id = 'abouticon';
            folderNameText = 'About.txt';
            randFolderIcon.src = '/OS/bit-icons/TXT.png'; // About icon
            randFolder.addEventListener('dblclick', function() { // to about page
                window.open('https://nonplace.site/Documents/About.txt', '', 'width=600,height=600');
            }, false);

        }
        if( i == mainIconArr[3]){
            randFolder.id = 'crediticon';
            folderNameText = 'Credit.zip';
            randFolderIcon.src = '/OS/bit-icons/ZIP.png'; // Credit icon 
            randFolder.addEventListener('dblclick', function() { // to credit page
                window.open('https://nonplace.site/Documents/Credit.zip', '', 'width=1200,height=700');
            }, false);
        }
        if( i == mainIconArr[4]){
            randFolder.id = 'statementicon';
            folderNameText = 'Statement.pdf';
            randFolderIcon.src = '/OS/bit-icons/PDF.png'; // Statement icon
            // pdf file contains statement; will be present in other pages as well
            randFolder.addEventListener('dblclick', function() { // to gallery page
                window.open('https://nonplace.site/Documents/Statement.pdf', '', 'width=500,height=600');
            }, false);
        }
        if( i == mainIconArr[5]){
            randFolder.id = 'readmeicon';
            folderNameText = 'README.md';
            randFolderIcon.src = '/OS/bit-icons/txt-vesper.png'; // README icon
            randFolder.addEventListener('dblclick', function() { // to gallery page
                window.open('https://nonplace.site/Documents/README.md', '', 'width=500,height=500');
            }, false);
            // text file contains instruction; will be present in other pages as well
            // popupCreate('readmetext','bbbbb', 'readmepop');
        }

        randFolder.appendChild(linktag);
    } else{
        randFolderIcon.src = '/OS/folder-icon.png'; // blue folder
        folderNameText = randomFolderName(10);
        randFolder.id = 'randFolder' + i;
        dbClickAlert(randFolder);
    }

    var folderName = document.createTextNode(folderNameText);
    randFolder.appendChild(randFolderIcon);
    randFolderNameBox.appendChild(folderName);
    randFolder.appendChild(randFolderNameBox);

    randFolder.setAttribute('class', 'randFolderItem');
    desktopGridWrapper.appendChild(randFolder);
    dragElement(randFolder);
}

// after init:
var iconbound = document.querySelector(".randFolderItem");
// console.log(iconbound);
// dragElement();
var readmeicon = document.getElementById('readmeicon');
readmeicon.addEventListener('click', ()=>{
    popupToggle('readmepop');
});

// random index folder 
// -> replace img src to: 
    // 0 - nonplace portal; 
    // 1 - the wrong biennale portal; 
    // 2 - about portal; 
    // 3 - credit portal
function getMainIconIndexes(num){
    let arr = [];

    while(arr.length <= 5){
        var r = Math.floor(Math.random() * num + 1);
        if(arr.indexOf(r) == -1){
            arr.push(r);
        }
    }
    // console.log(arr);
    return arr;
}


function randomFolderName(length){
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


// 给nonplace icon一些关注！
// document.addEventListener('load', setTimeout(()=>{
//     document.getElementById('nonplaceicon').classList.toggle('blink');
// }, 800));


// 点击nonplace的转场 -> glitch view flash



// infinite scroll -> soooooo many folders XD
var threshold = 50;
document.addEventListener("scroll",infiniteScroll,false);
function infiniteScroll(e){
    // console.log(desktopGridWrapper.scrollHeight);
    if(desktopGridWrapper.scrollHeight - desktopGridWrapper.clientHeight - desktopGridWrapper.scrollTop < 50) {
        for(let i =0; i<=10; i++){
            var randFolder = document.createElement("div");
            var randFolderIcon = document.createElement('img');
            randFolderIcon.src = '/OS/icons/folder-icon.png'; // blue folder
            var randFolderNameBox = document.createElement('span');
            var folderName = document.createTextNode(randomFolderName(10));
            randFolder.appendChild(randFolderIcon);
            randFolderNameBox.appendChild(folderName);
            randFolder.appendChild(randFolderNameBox);
            randFolder.setAttribute('class', 'randFolderItem');
            desktopGridWrapper.appendChild(randFolder);
        }
    }
}

function popupCreate(content, title, id) {
    var newpop = document.createElement('div');
    newpop.classList.add('popup');
    newpop.id = id;

    var popContent = document.createElement('span');
    popContent.classList.add('popContent');
    popContent.innerHTML = content;
    // var popTitle = createElement('span');
    // popContent.setAttribute('class', 'popTitle');
    // popTitle.innerHTML = title;
    newpop.appendChild(popContent);
    document.body.appendChild(newpop);
    // console.log()
}

function popupToggle(popElementID) {
    var popup = document.getElementById(popElementID);
    console.log(popup);

    popup.classList.toggle("show");
}


// function that makes the element draggable; elmnt needs to be positioned right:
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    elmnt.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
        console.log(elmnt);
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        elmnt.style.zIndex = 5;
        // elmnt.style.position = 'absolute';

        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function dbClickAlert(icon){ // for non-worklink files
    var noAccessImg = [
        "https://nonplace.site/OS/file.png", //file Not Found
        "https://nonplace.site/OS/filee.png", //file Damaged
    ];
    var popImgURL = noAccessImg[Math.floor(Math.random() * noAccessImg.length)];
    icon.ondblclick=(e)=>{
        e.preventDefault();
        let winW = window.screen.width / 2;
        let winH = window.screen.height / 2;
        let x = winW + (Math.random() * 150 - 300);
        let y = winH + (Math.random() * 175 - 350);

        var popWin = window.open('', '_blank', `width=300; height= 350; left= ${x}; top= ${y};`);
        popWin.document.write(`<html> <head> <title> Oops! </title> </head> <body style='background-color: rgb(164, 164, 164); background-image: url(${popImgURL}); background-size: cover; background-position: center; width: 300; height: 350;
        '> </body></html>`);
        popWin.document.write("<script> document.get</script>")
        popWin.addEventListener('resize', ()=> { popWin.resizeTo(300,350); });
        popWin.addEventListener('mouseup', ()=> { popWin.close(); });
    } 
}
