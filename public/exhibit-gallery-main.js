var setW = 600;
var setH = 600;
window.resizeTo(setW, setH);

dragElement(document.querySelector(".iconBound"));

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
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
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


var iconBound = document.querySelector(".iconBound");
var previewWindow = document.querySelector(".previewWindow");
var previewFrame = document.querySelector("#previewFrame");
var previewinfo = document.querySelector('#previewinfo');
var previewfoto = document.querySelector('#previewfoto');
var previewtxt = document.querySelector('#previewtxt');
var artistName = document.querySelector('#artistName');
var workDescrip = document.querySelector('#workDescrip');

var folderName;
var folderNameArr = [];
var imgArr = [];
var iconImgArr = [];
var iconArr = [];
var filemess = document.querySelector(".filemess");
var iconDiv = document.querySelector(".iconBound");
var selectedIcon = [];
var PassengerThumbnailArr = [];
var passengerdata= [];
var constructordata = [];
var constructorArr = [];
var passengerArr = [];
var allFilesArr = [];
var visitorArr = [];
var currentFile = document.createElement('span');
var windowFeature = "width=1000,height=700";

let iconBoundMeasure = iconBound.getBoundingClientRect();
let filemessBoundMeasure = filemess.getBoundingClientRect();

window.addEventListener('resize', ()=>{ window.resizeTo(1000, 700)});

window.onload = loadFolderUIData(folderNameArr, PassengerThumbnailArr, iconImgArr, passengerdata, constructordata)
.then(() =>{
    window.resizeTo(1000, 700);
    loadFiles();

    iconArr.forEach(eachIcon=>{
        selectIcon(eachIcon);
    })
    document.querySelector('#folderpath').appendChild(currentFile);

});

async function loadFolderUIData(){
    const datajson = await fetch("/maingallery.UIdata");
    const data = await datajson.json();
    folderNameArr = await data.folderName;
    // PassengerThumbnailArr = await data.passengerThumbnail;
    iconImgArr = await data.iconImg;
    passengerdata = await data.fileInfoPassengers;
    constructordata = await data.fileInfoConstructors;
    // console.log(passengerdata); 
    // updateIconImg();
    // createNewFile(x, y, id, fn, iconimgsrc)
    return folderNameArr, PassengerThumbnailArr, iconImgArr, passengerdata, constructordata;
};

function loadFiles(){
    // passenger files
        for (let i=0; i<passengerdata.length; i++){
            let pFile = passengerdata[i];
            let pFileName = pFile.fileInfo.filename;
            let pFileType= pFile.fileInfo.type;
            let pFileSize = pFile.fileInfo.filesize;
            let pPreviewSrc = pFile.fileInfo.previewsrc;
            let pID = pFile._id;
            let pLink = pFile.fileInfo.worklink;
            let pX = pFile.fileInfo.position.x;
            let pY = pFile.fileInfo.position.y;
            let pCT = pFile.fileInfo.ct;
            let pMT = pFile.fileInfo.mt;
            let role = pFile.user.role;
            let username = pFile.user.name;
            // console.log(pFile);
            createNewFile(randomPos(iconBoundMeasure,filemessBoundMeasure)[0], randomPos(iconBoundMeasure,filemessBoundMeasure)[1], pFileName, pFileType, pFileSize, pCT, pMT, pPreviewSrc, pID, pLink, false, role, null, username, null);
        }

    // constructor files
        for (let i=0; i<constructordata.length; i++){
            let cFile = constructordata[i];
            let cFileName = cFile.fileInfo.filename;
            let cFileType= cFile.fileInfo.type;
            let cPreviewSrc = cFile.fileInfo.previewsrc;
            let cID = cFile._id;
            let cX = cFile.fileInfo.position.x;
            let cY = cFile.fileInfo.position.y;
            let cCT = cFile.fileInfo.ct;
            let cMT = cFile.fileInfo.mt;
            let cLink = cFile.fileInfo.worklink;
            let role = cFile.user.role;
            let artistLink = cFile.user.userlink;
            let username = cFile.user.name;
            let workDescrip = cFile.fileInfo.description;
            // console.log(constructordata);
            createNewFile(cX, cY, cFileName, cFileType, null, cCT, cMT, cPreviewSrc, cID, cLink, true, role, artistLink, username, workDescrip);
        }
    
}


function selectIcon(icon) {
    icon.onclick = () => {
        if(selectedIcon.length>0 && selectedIcon[0]!=icon){ // if selected icon is not pre-seleted
            // console.log('add this icon to array');
            selectedIcon[0].classList.remove("iconSelected");
            selectedIcon.length = 0;
            icon.classList.add("iconSelected");
            selectedIcon.push(icon);
            updateHeader();
            showPreview(icon);
        } 
        if(selectedIcon[0]==icon){
            return;
        }
        else if (selectedIcon.length == 0 ){ // if nothing is selected
            icon.classList.add("iconSelected");
            selectedIcon.push(icon);
            updateHeader();
            showPreview(icon);
        }
    }
};

function showPreview(icon){
    let start = new Date(2000, 0, 1);
    let randCdate = randomDate(start, new Date(), 0, 24);
    let randMdate = randomDate(start, new Date(), 0, 24);
    let randomCTime = randCdate.toLocaleString();
    let randomMTime = randMdate.toLocaleString();


    if(selectedIcon.indexOf(icon)==0){ // double insurance
        constructorArr.find((objc, i) => { // check if this is contructor portal
            if (objc.id == icon.id) {
                previewfoto.src = objc.preview;
                // // add artist name + work decription
                artistName.innerHTML = `<span onClick="window.open('${objc.artistLink}', '${objc.artistName}', '${windowFeature}')" >` + objc.artistName + '</span>'; // objc.artistName; //
                artistName.classList.add('b');
                // console.log(artistName.innerHTML);
                workDescrip.innerHTML = objc.description;
                workDescrip.style.textAlign = 'justify';
                workDescrip.style.paddingTop = 10 + 'px';
                workDescrip.style.paddingBottom = 10 + 'px';

                document.querySelector('#fileType').innerHTML = 'Undefined - ' + randomSize();
            } else { }
        });
        passengerArr.find((objp, i) => { // check if this is passenger portal
            if (objp.id == icon.id) {
                // console.log(objp);
                previewfoto.src = objp.preview;
                artistName.classList.remove('b');
                if(objp.artistName!='' && objp.artistName!=null){
                    artistName.innerHTML = objp.artistName; 
                }else{
                    artistName.innerHTML = '--';
                }
                workDescrip.innerHTML = '--';
                workDescrip.style.textAlign = 'right';
                if(objp.size!='' && objp.size!=null){
                    document.querySelector('#fileType').innerHTML = objp.type + " - " + objp.size;
                }else{
                    document.querySelector('#fileType').innerHTML = objp.type + " - " + randomSize();
                }

            }
        });
        visitorArr.find((objv, i) => { // check if this is visitor's folders
            if (objv.id == icon.id) {
                previewfoto.src = objv.preview;
                artistName.innerHTML = '--';
                artistName.classList.remove('b');
                workDescrip.innerHTML = '--';
                workDescrip.style.textAlign = 'right';
                document.querySelector('#fileType').innerHTML = objv.type + " - " + randomSize();
                }
        });

        // // randomized preview -> don't need this for current version
            // let imgIndex = Math.floor(Math.random()*PassengerThumbnailArr.length);
            // previewfoto.src = `${PassengerThumbnailArr[imgIndex]}`;
            // document.querySelector('#fileType').innerHTML = 'Folder - '+ Math.floor(Math.random()*800)+' MB';
    }

    if(IDmatch(icon)[1] != '' && IDmatch(icon)[1] != null){ // if created time is in db
        document.querySelector('#createdTime').innerHTML = IDmatch(icon)[1];
    }else{
        document.querySelector('#createdTime').innerHTML = randomCTime;
    }
    if(IDmatch(icon)[2] != '' && IDmatch(icon)[2] != null){ // if modified time is in db
        document.querySelector('#modifiedTime').innerHTML = IDmatch(icon)[2];
    }else{
        document.querySelector('#modifiedTime').innerHTML = randomMTime;
    }
      
    document.querySelector('#filename').innerHTML = IDmatch(icon)[0];

    previewinfo.style.visibility = 'visible';
}

function updateHeader(){
    currentFile.innerHTML = " / " + IDmatch(selectedIcon[0])[0];
    if(selectedIcon.length !== 1){
        currentFile.innerHTML = '';
    }
}

function dbClickAlert(icon){ // for non-worklink files
    var noAccessImg = [
        "https://nonplace.site/OS/file.png", //file No Found
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

function randomDate(start, end, startHour, endHour) {
    var date = new Date(+ start + Math.random() * (end - start));
    var hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    return date;
}


function updateIconImg() {
    // console.log(folderNameArr.length, thumbnailArr.length, iconImgArr.length, 'load 2'); 
    let iconCount = iconImgArr.length;
    for (i = 0; i <= 50; i++) {
        var iconClone = iconDiv.cloneNode(true); // the true is for deep cloning
        var folderName = folderNameArr[Math.floor(Math.random() * folderNameArr.length)]+'_'+i;
        // var folderName = 'untitled folder ';
        iconClone.id = folderName;
        iconArr.push(iconClone);
        let thisIcon = iconArr[i];
        let newIcon = document.createElement('img');
        // newIcon.src = iconImgArr[Math.floor(Math.random() * iconCount)];
        newIcon.src = '/OS/icons/folder-icon.png'; // folder img
        thisIcon.querySelector('#initialIcon').replaceWith(newIcon);
        thisIcon.querySelector('#iconTxt').innerHTML = folderName;

        let randX = Math.random() * window.innerWidth - 50;
        let randY = Math.random() * window.innerHeight - 50;
        thisIcon.style.transform = 'translate(' + randX + 'px,' + randY + 'px)';
        filemess.appendChild(thisIcon);

        dragElement(thisIcon);
        // selectIcon(thisIcon);
        thisIcon.style.visibility = 'visible';
    }
    iconDiv.style.visibility = 'visible';
    return iconArr;
};

function createNewFile(x, y, fn, filetype, filesize, ct, mt, previewsrc, id, link, specialIconCheck, role, artistLink, username, description){
    var iconClone = iconBound.cloneNode(true); // the true is for deep cloning

    let newIcon = document.createElement('img');
    if(link != null && link != ''){
        iconClone.addEventListener('dblclick', function() { // to work page
            let w = window.open(link, id, windowFeature);
            w.document.title = '/' + id;
            // location.href = `${link}`;
        }, false);
    }else{
        dbClickAlert(iconClone);
    }
    newIcon.src = icontypematch(filetype, specialIconCheck); // icon of file type
    iconClone.querySelector('#initialIcon').replaceWith(newIcon);
    
    if(id =='new' && fn == 'new'){ // if is new and not in db
        iconClone.id = "file" + timestamp; 
        iconClone.querySelector('#iconTxt').innerHTML = 'untitled memory';
    }
    else{ // if existed in db
        iconClone.id = id;
        iconClone.querySelector('#iconTxt').innerHTML = fn;
    }
    iconClone.style.left=`${x}px`;
    iconClone.style.top=`${y}px`;

    // let newfolderbound = newfolder.getBoundingClientRect();
    // console.log('new folder', iconClone.id, x, y);
    dragElement(iconClone);
    iconClone.style.visibility = 'visible';

    iconArr.push(iconClone);
    filemess.appendChild(iconClone);

    if(role == 'constructor'){
        let pair = {
            id: id,
            preview: previewsrc,
            artistLink: artistLink,
            artistName: username,
            description: description,
        };
        constructorArr.push(pair);
    }
    if(role == 'passenger'){
        let pair = {
            id: id,
            preview: previewsrc,
            artistName: username,
            type: filetype,
            size: filesize,
        };
        passengerArr.push(pair);
    }

    let fnidpair = {
        icon: iconClone,
        id: id,
        filename: fn,
        ct: ct,
        mt: mt,
        link: link
    }
    allFilesArr.push(fnidpair);
    // console.log(allFilesArr);

    return iconArr, constructorArr, passengerArr, allFilesArr;
    // return {newfolder, timestamp};
}


function icontypematch(type, specialIconCheck){
    let iconsrc;
    if(specialIconCheck){
        iconsrc = `/ExhibitMedia/constructors/special-icons/${type}.png`; // match default icon type
    }
    else{
        iconsrc = `/OS/bit-icons/${type}.png`; // match default icon type
    }
    return iconsrc;
}

function IDmatch(icon){
    let thisfilename;
    allFilesArr.find((o, i) => { // check if this is contructor portal
        if (o.id === icon.id) {
            thisfilename = allFilesArr[i].filename;
            thisct = allFilesArr[i].ct;
            thismt = allFilesArr[i].mt;
        }
    });
    let info=[thisfilename, thisct, thismt];
    return info;
}

function randomSize(){
    var unit = ['MB', 'GB', 'KB'];
    let sizestring = Math.floor(Math.random()*800) + " "+ unit[Math.floor(Math.random()* 3)];

    return sizestring;
}

function randomPos(icon, bgArea){
    let pos = [];
    let Xmax = bgArea.width - icon.width;
    let Hmax = bgArea.height - icon.height;
    let x = Xmax * Math.random();
    let y = Hmax * Math.random();
    pos.push(x);
    pos.push(y);
    return pos;
}



