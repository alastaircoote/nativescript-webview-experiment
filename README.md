# NativeScript webview experiment

A really basic experiment playing around with NativeScript to see what it's like to
work with "raw".

It's an attempt to automate searching for mobile ads that redirect users to the App
Store - loading the NYT mobile home page, then moving to a new page every 30 seconds
(by detecting article links on the page). It currently doesn't actually do anything
when it detects such an ad, it's just a proof of concept.

## Installation

Follow NativeScript's [getting started](http://docs.nativescript.org/start/getting-started)
guide to set up NativeScript on your machine. Then clone this repo and run:

    tns platform add ios
    
## Test

Run:

    tns run ios --emulator
    
to open the app in the iOS Simulator.