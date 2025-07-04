const cron = require("node-cron");
const RentedVehicle = require("./models/RentedVehicle");
const VehicleStock = require("./models/HotelRoom");

function startCronJobs() {
  cron.schedule("*/10 * * * *", async () => {
    const now = new Date();

    const dueReturns = await RentedVehicle.find({
      returnAt: { $lte: now },
      returned: false,
    });

    for (const rental of dueReturns) {
      await VehicleStock.create({
        vehicle_id: rental.vehicle_id,
        vehicle_name: rental.vehicle_name,
        vehicle_number: rental.vehicle_number,
      });

      rental.returned = true;
      await rental.save();
    }

    console.log(`Returned ${dueReturns.length} vehicles to stock.`);
  });
}

module.exports = startCronJobs;
