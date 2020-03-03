#!/usr/bin/env bash

# SET YOUR VARIABES
PROJECT_PATH=/Users/seanrad/Documents/code/Projects/SkateSense3/ios
BUILD_PATH=/Users/seanrad/Desktop/Build
APP_NAME=SkateSense3
EXPORT_OPTIONS_PLIST=./SkateSense3/Info.plist
SCHEME=SkateSense3

# Increase build number (Assuming you added the xcibversion to your execution path)
xcibversion --path=$PROJECT_PATH

#Builds the xcarchive
xcodebuild -workspace $PWD/$APP_NAME.xcworkspace -scheme $SCHEME -sdk iphoneos -configuration Release archive -archivePath $BUILD_PATH/IntoAccount.xcarchive


# Builds the ipa and uploads it to the appstore
xcodebuild -exportArchive -archivePath $BUILD_PATH/IntoAccount.xcarchive -exportPath $BUILD_PATH -exportOptionsPlist $EXPORT_OPTIONS_PLIST


xcrun altool --upload-app --file $BUILD_PATH/SkateSense3.ipa --username seanconrad123@gmail.com --password pvoa-tadn-eubh-oacx
