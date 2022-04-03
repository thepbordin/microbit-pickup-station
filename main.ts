enum RadioMessage {
    message1 = 49434
}
radio.onReceivedNumber(function (receivedNumber) {
    readyCallback = receivedNumber
})
function getDistanceCm () {
    return sonar.ping(
    DigitalPin.P0,
    DigitalPin.P1,
    PingUnit.Centimeters
    )
}
radio.onReceivedValue(function (name, value) {
    if (name == "pickup") {
        pickup = value
    } else if (name == "drop") {
        drop = value
    }
    OLED.writeStringNewLine("Pickup at: " + convertToText(pickup))
    OLED.writeStringNewLine("Drop at: " + convertToText(drop))
})
let onUsing = 0
let drop = 0
let pickup = 0
let readyCallback = 0
OLED.init(128, 64)
radio.setGroup(10)
let holdmSecs = 0
readyCallback = 0
serial.writeString("Starting!")
OLED.clear()
servos.P2.setAngle(0)
basic.pause(1000)
servos.P2.setAngle(180)
basic.pause(1000)
servos.P2.setAngle(0)
let ChkPID = 11
let uniqueID = 2
pickup = 0
basic.forever(function () {
    if (getDistanceCm() <= 10 && getDistanceCm() != 0 && pickup == uniqueID) {
        serial.writeString("Distance <15 cm!")
        holdmSecs = holdmSecs + 100
        basic.pause(100)
        if (holdmSecs >= 300) {
            onUsing = 1
            serial.writeString("Checking Radio")
            OLED.clear()
            holdmSecs = 0
            readyCallback = 0
            radio.sendNumber(ChkPID)
            for (let index = 0; index < 10; index++) {
                basic.showIcon(IconNames.SmallDiamond)
                basic.pause(100)
                basic.showIcon(IconNames.SmallSquare)
                basic.pause(100)
                if (readyCallback != 0) {
                    break;
                }
            }
            if (readyCallback != 0) {
                basic.showIcon(IconNames.Happy)
                onUsing = 0
                pickup = 0
            } else {
                basic.showIcon(IconNames.Sad)
                basic.pause(2000)
                basic.clearScreen()
                onUsing = 0
                pickup = 0
            }
        }
    } else {
        holdmSecs = 0
    }
})
basic.forever(function () {
    if (!(onUsing) && !(input.buttonIsPressed(Button.A))) {
        if (pickup == uniqueID) {
            basic.showIcon(IconNames.TShirt)
            basic.pause(500)
            basic.clearScreen()
        } else {
            basic.clearScreen()
        }
    }
    if (input.buttonIsPressed(Button.A)) {
        basic.showNumber(ChkPID)
    }
})
