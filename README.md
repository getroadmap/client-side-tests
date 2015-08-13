# Client Side Tests
A variety of client side tests and API tests

## Prerequisites
You will need the following things properly installed on your computer.
* [Node.js](http://nodejs.org/) (with npm)
* [Mocha](http://mochajs.org/)
* [Selenium](http://www.seleniumhq.org/) (we need only selenium-webdriver when running without selenium grid)
* [Firefox](https://www.mozilla.org/) (with xvfb server it can be run on machines with no display hardware and no physical input devices)

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
* `startAllTests.bat` (requires selenium grid running)

### Linux
* `./startAllTests.sh` (does not require selenium grid running)
* `./xvfbAllTests.sh` (uses xvfb to run firefox on a headless machine)

### Mac
* see Linux

## Further Reading / Useful Links
* [Selenium Client & WebDriver JavaScript(Node) Bindings](http://seleniumhq.github.io/selenium/docs/api/javascript/index.html)
