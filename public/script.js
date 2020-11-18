const imageUpload = document.getElementById('imageUpload')

Promise.all([
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)

var imageHere = $("#imageHere")
var linksHere = $("#linksHere")
var heading = $("#heading")
var addLoader = $("#addLoader")

async function start() {
  const labeledFaceDescriptors = await loadLabeledImages()
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
  let image
  let canvas
  document.body.append('Loaded')

  imageUpload.addEventListener('change', async () => {
    if (image) image.remove()
    if (canvas) canvas.remove()
    heading.hide()
    linksHere.empty()
    addLoader.addClass("loader")
    image = await faceapi.bufferToImage(imageUpload.files[0])
    imageHere.append(image)
    canvas = faceapi.createCanvasFromMedia(image)
    const displaySize = { width: 300, height: 300 }
    faceapi.matchDimensions(canvas, displaySize)
    const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
    addLoader.removeClass("loader")
    heading.show()
    heading.text("Your results are")
    results.forEach((result, i) => {
      const box = resizedDetections[i].detection.box
      var indexOf = result.toString().indexOf(':')
      var name = result.toString().slice(0,indexOf)
      var id = result.toString().slice(indexOf+1,indexOf+25)
      console.log(name.toString() + " is the name with id : " + id.toString())
      const drawBox = new faceapi.draw.DrawBox(box, { label: name  })
      drawBox.draw(canvas)
      if(!name.includes("unknown") ){
        linksHere.prepend(`<h3> <a href='/viewItem-${id.toString()}'> <i class='fa fa-eye' ></i> ${name.toString()} </a> </h3>`)
      }else{
        linksHere.append(`<h3> <a href='#'> <i class='fa fa-eye'loader ></i> Unknown </a> </h3>`)
      }      
    })

  })
}

function loadLabeledImages() {
  const labels = links
  return Promise.all(
    labels.map(async label => {
      const descriptions = []
        var img = await faceapi.fetchImage(label.imageUrl)
        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
        var nameAndId = label.name.toString() + ":" + label.userItem.toString()
      return new faceapi.LabeledFaceDescriptors(nameAndId, descriptions)
    })
  )

}
