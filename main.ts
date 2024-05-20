function Pong () {
    radio.sendString("" + PodName + " is alive")
}
function LedSwitch () {
    if (LedStatus == 1) {
        LedOFF()
    } else {
        LedON()
    }
}
function LedON () {
    MatriceLed.showColor(neopixel.colors(NeoPixelColors.White))
    LedStatus = 1
    MatriceLed.show()
    radio.sendString("" + PodName + "," + "LED" + "," + LedStatus)
}
input.onButtonPressed(Button.A, function () {
    LedSwitch()
})
function LedOFF () {
    MatriceLed.showColor(neopixel.colors(NeoPixelColors.Black))
    LedStatus = 0
    MatriceLed.show()
    radio.sendString("" + PodName + "," + "LED" + "," + LedStatus)
}
function pompeSwitch () {
    if (PompeStatus == 0) {
        pompeON()
    } else {
        pompeOFF()
    }
}
function pompeON () {
    PompeStatus = 1
    pins.digitalWritePin(DigitalPin.P15, 1)
    radio.sendString("" + PodName + "," + "POMPE" + "," + PompeStatus)
}
function pompeOFF () {
    PompeStatus = 0
    pins.digitalWritePin(DigitalPin.P15, 0)
    radio.sendString("" + PodName + "," + "POMPE" + "," + PompeStatus)
}
radio.onReceivedString(function (receivedString) {
    Message = receivedString.split(",")
    if (Message[0].compare(PodName) == 0 || Message[0].compare("ALL") == 0) {
        if (Message[1].compare("POMPE-ON") == 0) {
            pompeON()
        } else if (Message[1].compare("POMPE-OFF") == 0) {
            pompeOFF()
        } else if (Message[1].compare("POMPE-SW") == 0) {
            if (PompeStatus == 0) {
                pompeON()
            } else {
                pompeOFF()
            }
        } else if (Message[1].compare("LED-ON") == 0) {
            LedON()
        } else if (Message[1].compare("LED-OFF") == 0) {
            LedOFF()
        } else if (Message[1].compare("LED-SW") == 0) {
            if (LedStatus == 0) {
                LedON()
            } else {
                LedOFF()
            }
        } else if (Message[1].compare("ALL-OFF") == 0) {
            pompeOFF()
            LedOFF()
            radio.sendString("" + PodName + " is OFF")
        } else if (Message[1].compare("HUM?") == 0) {
            radio.sendString("" + PodName + "," + "HUM" + "," + HumiditeSol)
        } else if (Message[1].compare("LUM?") == 0) {
            radio.sendString("" + PodName + "," + "LUM" + "," + Luminosite)
        } else if (Message[1].compare("TEMP?") == 0) {
            radio.sendString("" + PodName + "," + "TEMP" + "," + Temperature)
        } else if (Message[1].compare("STATUS?") == 0) {
            basic.pause(50 * randint(0, 10))
            radio.sendString("" + PodName + ",STATUS," + LedStatus + "," + PompeStatus + "," + Luminosite + "," + HumiditeSol + "," + Temperature)
        }
    }
})
input.onButtonPressed(Button.B, function () {
    pompeSwitch()
})
function checkSensors () {
    HumiditeSol = pins.analogReadPin(AnalogPin.P1)
    Luminosite = pins.analogReadPin(AnalogPin.P2)
    Temperature = input.temperature()
}
let Message: string[] = []
let PompeStatus = 0
let LedStatus = 0
let MatriceLed: neopixel.Strip = null
let Luminosite = 0
let HumiditeSol = 0
let Temperature = 0
let PodName = ""
radio.setGroup(1)
let PodID = 1
PodName = "Pod" + PodID
Temperature = input.temperature()
HumiditeSol = pins.analogReadPin(AnalogPin.P1)
Luminosite = pins.analogReadPin(AnalogPin.P2)
MatriceLed = neopixel.create(DigitalPin.P0, 64, NeoPixelMode.RGB)
pompeOFF()
LedOFF()
Pong()
basic.showNumber(PodID)
basic.forever(function () {
    checkSensors()
})
