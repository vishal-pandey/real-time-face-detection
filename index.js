import * as faceapi from 'face-api.js';

Promise.all([
		faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
		faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
		faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
		// faceapi.nets.faceExpressionNet.loadFromUri('/models'),
		faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startVideo)



function startVideo(){
	const video = document.querySelector('#video')
	navigator.getUserMedia(
		{
			video: {}
		},
		stream => video.srcObject = stream,
		err => console.error(err)
	)
}


window.onload = ()=>{
	startVideo()
	console.log(faceapi.nets)
	video.addEventListener('play', ()=>{
		const canvas = faceapi.createCanvasFromMedia(video)
		document.querySelector(".content").append(canvas)
		const displaysize = { width: video.width, height: video.height }
		faceapi.matchDimensions(canvas, displaysize)
		setInterval(async () =>{
			const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withAgeAndGender();
			// console.log(detections)
			const resizedDetections = faceapi.resizeResults(detections, displaysize)
			canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
			faceapi.draw.drawDetections(canvas, resizedDetections)
			// faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
			resizedDetections.forEach(result => {
		        const { age, gender, genderProbability } = result
		        new faceapi.draw.DrawTextField(
		          [
		            `${faceapi.utils.round(age, 0)} years`,
		            `${gender} (${faceapi.utils.round(genderProbability)})`
		          ],
		          result.detection.box.bottomLeft
		        ).draw(canvas)
		    })


		}, 1000)
	})
}