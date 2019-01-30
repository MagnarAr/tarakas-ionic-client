# tarakas-ionic-client

## Introduction
This is a Ionic 2 cross-platform piggy bank application for children.

Currently, the application can only be tested on Android by downloading the apk from build directory: ```/build/android-debug.apk```

To test the application on iOS, check "Build/installation notes" below.

## Build/installation notes

* Make sure you have NodeJS installed and *npm* in system path.
* Run: ```npm install -g ionic cordova```
* Clone repository
* Run: ```npm install``` (get all dependenciess)
* To run in local browser (default will be used), run: ```ionic serve```
* To build APK for Android, run: ```ionic build android``` (APK will be created, make sure You have Android Studio installed with latest sdk-tools before doing this, also ```android``` and ```ant``` must be reachable as system path variables)
  * If build is successful, an APK file will be generated to: ```/platforms/android/build/outputs/apk/android-debug.apk```
  * Copy the .apk to Your phone and install it. Make sure tick "Unknown sources" from Settings -> Applications
* To run on iOS, make sure You have [Xcode](https://developer.apple.com/xcode/) installed, connect Your iPhone or iPad to Your Mac, and run: ```ionic build ios```
  * Then open the project in Xcode, using project file generated: ```/platforms/ios/Tarakas.xcodeproj```
  
* For framework specific instructions, please refer to official [Ionic 2 documentation](http://ionicframework.com/docs/intro/installation/)
* To install Android Studio, click [here](https://developer.android.com/studio/index.html).
* If You are having problems running test application on Your Apple device, please refer to [Apple documentation](https://developer.apple.com/library/content/documentation/IDEs/Conceptual/AppDistributionGuide/LaunchingYourApponDevices/LaunchingYourApponDevices.html)
