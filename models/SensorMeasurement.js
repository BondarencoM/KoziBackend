module.exports = class SensorMeasurement{
    constructor(measurements){
        if (!measurements) return

        let first = measurements[0]
        this.floor = first.floor;
        this.loc_x = first.loc_x;
        this.loc_y = first.loc_y;
        
        for(let measurement of measurements){
            this[measurement._field] = measurement._value
        }
    }
}

