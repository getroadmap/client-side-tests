# Client Side Tests
A variety of client side tests and API tests

## Prerequisites
You will need the following things properly installed on your computer.
* [Node.js](http://nodejs.org/) (with npm)
* [Mocha](http://mochajs.org/)
* [Selenium](http://www.seleniumhq.org/) (we need only selenium-webdriver when running without selenium grid)
* [Firefox](https://www.mozilla.org/) (with xvfb X server it can run on machines with no display hardware and no physical input devices)

## Installation
### Windows
* `npm install mocha -g`
* `npm install selenium-webdriver --msvs_version=2012`

### Linux
* `npm install mocha -g`
* `npm install selenium-webdriver`

### Mac
* see Linux

## Running Tests
### Windows
* `startAllTests.bat` (current example assumes that selenium grid is running)

### Linux
* `./startAllTests.sh` (current example doesn't need selenium grid running)
* `./xvfbAllTests.sh` (current example uses xvfb to run firefox on a headless machine)

### Mac
* see Linux

## Further Reading / Useful Links
* [Selenium Client & WebDriver JavaScript(Node) Bindings](http://seleniumhq.github.io/selenium/docs/api/javascript/index.html)
