

const express = require('express');
var app = express();
const http = require('http').createServer(app);
const server = app.listen(2023);
console.log("listening on port 2023");
const { AsyncNedb } = require('nedb-async');
const nedb = require('nedb');

let dbPassengers = new AsyncNedb({
    filename: 'dbPassengers.db',
    autoload: true
})
dbPassengers.find({}, function (err, docs) {
    console.log("# of passengers db entries:", docs.length);
});
let dbConstructors = new AsyncNedb({
  filename: 'dbConstructors.db',
  autoload: true
})
dbConstructors.find({}, function (err, docs) {
  console.log("# of constructors db entries:", docs.length);
});
let dbCredit = new AsyncNedb({
  filename: 'dbCredit.db',
  autoload: true
})
dbCredit.find({}, function (err, docs) {
  console.log("# of credit db entries:", docs.length);
});

let dbVisitors = new AsyncNedb({
  filename: 'dbVisitors.db',
  autoload: true
})
dbVisitors.find({}, function (err, docs) {
  console.log("# of visitors db entries:", docs.length);
});


const fs = require('fs');

// Tell Express to look in the "public" folder for any files first
app.use(express.static('public'));

// setting the templating engine so express / the server knows what to use
app.set("view engine", "ejs");

app.get('/test', function (request, response) {
  response.send("Test: Server is working");
})


/*---------------------global functions------------------------------------------------------------------------------------------------------------------------------*/
function formatPath(originalPath) {
  var newPath = "/" + originalPath.split('/').slice(-4).join('/');
  return newPath;
}


// ------ Landing page for exhibition -----------//
app.get('', (req, res, next) => { 
  res.render("exhibit-landing.ejs", '')
  });


// ------ About page for exhibition -----------//
var aboutTxtPath = __dirname + '/public/ExhibitMedia/about.txt';
app.get('/Documents/About.txt', (req, res, next) => { // 'next' means run next request after this; 
  var aboutData = {
    aboutTxt: fs.readFileSync(aboutTxtPath, 'utf8'),
  }
  res.render("exhibit-about.ejs", aboutData);
});

// ------ README page for exhibition -----------//
app.get('/Documents/README.md', (req, res, next) => {  
  res.sendFile("/views/exhibit-readme.html", {root: __dirname });
});

// ------ Statement page for exhibition -----------//
app.get('/Documents/Statement.pdf', (req, res, next) => { 
  // res.sendFile("exhibit-statement.html");
  var stream = fs.createReadStream(__dirname + '/public/ExhibitMedia/nonplace-exhibit-statementPDF.pdf');
  var filename = "statement.pdf"; 
  filename = encodeURIComponent(filename+"#toolbar=0&navpanes=0&scrollbar=0&view=FitH");
  res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
  res.setHeader('Content-type', 'application/pdf');

  stream.pipe(res);
});

// ------ Credit page for exhibition -----------//
app.get('/Documents/Credit.zip', (req, res, next) => { 
  res.render("exhibit-credit.ejs", '');
});
app.get('/creditinfo.data', async (req, res, next) => {
  // artist handle name + link
  // credit role
  // representational image
  // id
  var creditdbdata = await dbCredit.asyncFind({ }, function (err, docs) {
    resolve(docs);
  });  
  res.json(creditdbdata);
});

/*----------------------Gallery Layer-----------------------------------------------------------------------------------------------------------------------------------------------*/
const iconsPath = __dirname + '/public/OS/icons';
var PassengerThumbnailArr=[];
var iconImgArr=[];

// a list of all icon files path
let allIcons = [];
fs.readdirSync(iconsPath).forEach(file => {
  if (file.endsWith('.png')) {
    allIcons.push(iconsPath + file);
  }
  return allIcons;
});


fs.readdirSync(iconsPath).forEach(iconimg => {
  if (iconimg.endsWith(".png") || iconimg.endsWith(".jpg")) {
    iconImgArr.push('LMid_media/img/icons/' + iconimg.toString('base64'));
  }
  return iconImgArr;
});

// anynomous passengers' img thumbnails
var PassengerThumbnailArr = [];
var PassengerThumbnailPath = __dirname + '/public/ExhibitMedia/passengers/img/noname'
fs.readdirSync(PassengerThumbnailPath).forEach(img => {
  if (img.endsWith(".png") || img.endsWith(".jpg")) {
    PassengerThumbnailArr.push('ExhibitMedia/passengers/img/' + img.toString('base64'));

  }
  return PassengerThumbnailArr;
});



// ------ gallery main page / browsing -----------//
var mainGalleryIMGfileData = {};
app.get("/Users", (req, res) => {
  mainGalleryIMGfileData = {
    randomIcon: formatPath(allIcons[Math.floor(Math.random() * allIcons.length)]),
  }
  res.render("exhibit-gallery-main.ejs", mainGalleryIMGfileData);
});

app.get("/maingallery.UIdata", async (req,res) =>{
  // get existing entries from passengers and constructors db
  var fileInfoPassengers = await dbPassengers.asyncFind({ }, function (err, docs) {
    resolve(docs);
  });
  var fileInfoConstructors = await dbConstructors.asyncFind({ }, function (err, docs) {
    resolve(docs);
  });
  let data = getMainGalleryUIdata(fileInfoPassengers, fileInfoConstructors);
  res.json(data);
});



function getMainGalleryUIdata(passengerdata, constructordata){
  
  var MainGalleryUIdata = {
    "fileInfoPassengers": passengerdata,
    "fileInfoConstructors": constructordata,
    "iconImg": iconImgArr,
    "passengerThumbnail": PassengerThumbnailArr,
  }
  // console.log(iconImgArr, thumbnailArr, folderNameArr);
  return MainGalleryUIdata;
}
  

// ------ gallery sub pages / each artist's folder (currently not applying) -----------//


// other feature
app.get('/am_i_lost_on_the_way_back?', (req,res)=>{
  res.statusCode = 302;

  res.setHeader("Location", "http://nonplace.site:3333/desktop.html");
  res.end();
})
