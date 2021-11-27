let detected = 0
let x = 0
let y = 0
let brightness_map_prev: number[] = []
Arducam.initCamera(Arducam.IMAGE_FORMAT.BMP, Arducam.IMAGE_RESOLUTION.OV2640_320x240)
radio.setGroup(1)
let brightness_map = Arducam.brightnessMap()
basic.forever(function () {
    Arducam.capture()
    brightness_map = Arducam.brightnessMap()
    for (let i = 0; i <= 24; i++) {
        serial.writeNumber(brightness_map[i])
        serial.writeString(",")
    }
    serial.writeLine("")
    for (let y2 = 0; y2 <= 4; y2++) {
        // serial.writeLine("" + (Math.abs(brightness_map[y2 * 5 + x2] - brightness_map_prev[y2 * 5 + x2])))
        // serial.writeLine("" + ((brightness_map[y2 * 5 + x2])))
        for (let x2 = 0; x2 <= 4; x2++) {
            if (brightness_map[y2 * 5 + x2] > 0.4) {
                led.plot(x2, y2)
            } else {
                led.unplot(x2, y2)
            }
            detected = 0
            if (Math.abs(brightness_map[y2 * 5 + x2] - brightness_map_prev[y2 * 5 + x2]) > 0.3) {
                detected = 1
            }
        }
    }
    // serial.writeLine("Detected!")
    if (detected == 1) {
        serial.writeLine("1")
        radio.sendNumber(1)
    } else {
        serial.writeLine("0")
        radio.sendNumber(0)
    }
    brightness_map_prev = brightness_map.slice()
})
