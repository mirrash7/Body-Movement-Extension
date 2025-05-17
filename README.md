# Chrome Extension for Motion Control

A Chrome extension that lets you control web games using your body movements through your webcam.
![Screen Recording 2025-05-17 165421 - Trim - frame at 0m8s](https://github.com/user-attachments/assets/e8c17242-3d6b-490e-bea5-6647302236b2)
# Features:
Control web games using natural body movements
Real-time pose detection using TensorFlow.js
Automatic calibration to your body dimensions
Visual feedback with skeleton overlay
Optional emoji that follows your face
Works with most web-based games without modification
# How It Works
The extension uses your webcam and TensorFlow.js to track your body movements in real-time. After a quick calibration, it converts your movements into keyboard inputs that control the game:
Move left/right: Lean your body left or right
Jump (Arrow Up): Raise both shoulders above the jump line
Action (Space): Raise one hand above nose level
Duck (Arrow Down): Lower shoulders below the duck line
Pause (Escape): Extend both arms outward at shoulder level
# Installation
1. Download or clone this repository
2. Open Chrome and go to chrome://extensions/
Enable "Developer mode" in the top-right corner
Click "Load unpacked" and select the extension folder
The Subway Motion Controller icon should appear in your toolbar
# Usage
1. Navigate to a web game like Subway Surfers
Click the extension icon in your toolbar
Click "Enable Motion Control"
Follow the calibration instructions (stand in front of camera and raise hand)
Start playing with your body movements!
# Privacy
All video processing happens locally on your device
No video data is sent to any server
The extension only works on the tab where you activate it
# Requirements
Chrome browser (version 88 or higher recommended)
Webcam
Sufficient lighting for pose detection
Enough space to move around
# Development
The extension consists of:
background.js: Manages extension lifecycle
content.js: Injects the overlay into web pages
overlay.js: Handles webcam, pose detection, and game control
popup.html/js: User interface for controlling the extension
To modify the extension:
Make your changes to the code
Reload the extension in chrome://extensions/
Test your changes
# License
MIT License
# Acknowledgements
TensorFlow.js for the pose detection model
MoveNet for efficient pose estimation

Contributions are welcome! Please feel free to submit a Pull Request.
