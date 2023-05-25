let currentTab = 0;
const showTab = (n) => {
    const tabs = document.getElementsByClassName("tab");
    const backBtn = document.getElementById("backBtn");
    const nextBtn = document.getElementById("nextBtn");
    const circles = document.getElementById("circles");
    const displayStyle = n === 0 ? "none" : "block";
    // Hide the back button if it's the first tab
    if (n === 0) {
        backBtn.style.setProperty("display", "none", "important");
     } else {
        backBtn.style.display = displayStyle;
    }

    if (tabs[n].id === "progressTab") {
        circles.style.display = "none";
        nextBtn.style.display = "none";
    } else {
        circles.style.display = displayStyle;
        nextBtn.style.display = displayStyle;
    }

    nextBtn.innerHTML = n === tabs.length - 1 ? "Submit" : "Next";
    Array.from(tabs).forEach((tab, i) => {
        tab.style.display = i === n ? "block" : "none";
    });
    fixStepIndicator(n);
};
const nextPrev = (n) => {
    if (n === 1 && !validateForm()) return false;
    const tabs = document.getElementsByClassName("tab");
    tabs[currentTab].style.display = "none";
    currentTab += n;
    if (currentTab >= tabs.length) {
        document.getElementById("regForm").submit();
        return false;
    }
    showTab(currentTab);
};

const validateForm = () => {
    const tabs = document.getElementsByClassName("tab");
    const errorContainers = document.getElementsByClassName("error");
    const inputs = Array.from(tabs[currentTab].getElementsByTagName("input"));

    let valid = true;

    inputs.forEach((input) => {
        if (input.value === "") {
            input.classList.add("invalid");
            valid = false;
        } else {
            input.classList.remove("invalid");
        }
    });

    Array.from(errorContainers).forEach((errorContainer) => {
        errorContainer.innerHTML = valid ? "" : "Please fill all required fields";
    });

    return valid;
};

const fixStepIndicator = (n) => {
    const steps = document.getElementsByClassName("step");
    Array.from(steps).forEach((step) => {
        step.classList.toggle("active", steps[n] === step);
    });
};

showTab(currentTab);

// Code for upload id button
const fileInput = document.getElementById("file-upload");
const fileInputLabel = document.querySelector(".custom-file-input label");

fileInput.addEventListener("change", function () {
    fileInputLabel.textContent = this.files && this.files.length > 0 ? this.files[0].name : "Choose a file";
});

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAqgyxnNJ_U8vn-jQPszkvkQ8r43gbYGq4",
    authDomain: "romonk-4c0fb.firebaseapp.com",
    databaseURL: "https://romonk-4c0fb-default-rtdb.firebaseio.com",
    projectId: "romonk-4c0fb",
    storageBucket: "romonk-4c0fb.appspot.com",
    messagingSenderId: "491223978483",
    appId: "1:491223978483:web:0a936078168b4eefe7c286",
    measurementId: "G-85TP3TSPS9"
};
firebase.initializeApp(firebaseConfig);
const storageRef = firebase.storage().ref();

// Function to handle file upload
function handleFileUpload(event) {
    const file = event.target.files[0];
    const uploadTask = storageRef.child(file.name).put(file);

    uploadTask.on(
        "state_changed",
        null,
        (error) => {
            console.log("Error uploading file:", error);
        },
        () => {
            console.log("File uploaded successfully!");

            // Display the uploaded image on the next tab (imageTab)
            storageRef
                .child(file.name)
                .getDownloadURL()
                .then((url) => {
                    const imageTab = document.getElementById("imageTab");
                    const image = new Image();
                    image.src = url;
                    image.classList.add("uploadedImage");
                    imageTab.innerHTML = "";
                    imageTab.appendChild(image);
                })
                .catch((error) => {
                    console.log("Error getting download URL:", error);
                });
        }
    );
}

// Function to handle capturing an image
function captureImage() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const capturedImageContainer = document.getElementById("captured-image-container");

    if (!video || !video.videoWidth || !video.videoHeight) {
        console.log("Error accessing video or video metadata not loaded.");
        return;
    }

    const {videoWidth, videoHeight} = video;
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, videoWidth, videoHeight);

    const imageDataURL = canvas.toDataURL();
    const image = new Image();
    image.src = imageDataURL;

    capturedImageContainer.innerHTML = "";
    capturedImageContainer.appendChild(image);

    const imageTab = document.getElementById("imageTab");
    imageTab.innerHTML = "";
    image.classList.add("uploadedImage");
    imageTab.appendChild(image);
}

// Function to initialize camera stream
function openCamera() {
    navigator.mediaDevices
        .getUserMedia({ video: { facingMode: { exact: "environment" } } })
        .then((stream) => {
            const video = document.getElementById("video");
            if (video) {
                video.srcObject = stream;
                video.play();
            } else {
                console.log("Video element not found.");
            }
        })
        .catch((error) => {
            console.log("Error accessing camera:", error);
        });
}
// Add event listeners
const fileUploadInput = document.getElementById("file-upload");
const takePhotoButton = document.getElementById("takePhoto");

if (fileUploadInput) {
    fileUploadInput.addEventListener("change", handleFileUpload);
} else {
    console.log("File upload input element not found.");
}

if (takePhotoButton) {
    takePhotoButton.addEventListener("click", () => {
        openCamera();
        const video = document.getElementById("video");
        if (video) {
            video.style.display = "block";
            captureImage();
        } else {
            console.log("Video element not found.");
        }
    });
} else {
    console.log("Take Photo button element not found.");
}

const video = document.getElementById("video");
if (video) {
    video.style.display = "none";
} else {
    console.log("Video element not found");
}
