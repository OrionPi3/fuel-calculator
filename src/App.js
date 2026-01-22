import { useState } from "react";

function App() {
  const [tankCapacity, setTankCapacity] = useState("");
  const [kmsLeft, setKmsLeft] = useState("");
  const [fractionLeft, setFractionLeft] = useState("full");
  const [gasPrice, setGasPrice] = useState("");
  const [fuelEconomy, setFuelEconomy] = useState("");
  const [customLitres, setCustomLitres] = useState("");
  const [pumpMode, setPumpMode] = useState("full"); // NEW: choose mode
  const [fuelNeeded, setFuelNeeded] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const handleCalculate = () => {
    const capacity = parseFloat(tankCapacity);
    const price = parseFloat(gasPrice);
    const economy = parseFloat(fuelEconomy);

    if (!capacity || !price) {
      alert("Please enter valid tank capacity and gas price.");
      return;
    }

    // --- Custom Litres Mode ---
    if (pumpMode === "custom") {
      const litres = parseFloat(customLitres);
      if (!litres) {
        alert("Please enter litres to pump.");
        return;
      }
      if (litres > capacity) {
        alert("Litres exceed tank capacity.");
        return;
      }
      const cost = (litres * price) / 1.13;
      setFuelNeeded({
        litres: litres.toFixed(2),
        cost: cost.toFixed(2),
        percentage: ((litres / capacity) * 100).toFixed(0),
      });
      return;
    }

    // --- Pump to Full Mode ---
    let fuelRemaining = 0;

    if (fractionLeft === "quarter") {
      fuelRemaining = capacity * 0.25;
    } else if (fractionLeft === "half") {
      fuelRemaining = capacity * 0.5;
    } else if (fractionLeft === "threequarter") {
      fuelRemaining = capacity * 0.75;
    } else {
      if (!kmsLeft || !economy) {
        alert("Please enter KMs left and fuel economy (L/100km).");
        return;
      }
      fuelRemaining = (parseFloat(kmsLeft) / 100) * economy;
      if (fuelRemaining > capacity) fuelRemaining = capacity;
    }

    const fuelToFill = capacity - fuelRemaining;
    const totalCost = (fuelToFill * price) / 1.13;

    setFuelNeeded({
      litres: fuelToFill.toFixed(2),
      cost: totalCost.toFixed(2),
      percentage: ((fuelRemaining / capacity) * 100).toFixed(0),
    });
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 max-w-lg w-full">
          {/* Dark/Light Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="mb-4 px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>

          <h1 className="text-3xl font-bold mb-6 text-center text-green-500 dark:text-green-400">
            Fuel Calculator
          </h1>

          <div className="space-y-4">
            {/* Tank Capacity */}
            <div>
              <label className="block mb-1">Tank Capacity (Litres)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={tankCapacity}
                  onChange={(e) => setTankCapacity(e.target.value)}
                  className="w-full p-2 rounded-lg text-black"
                />
                <button
                  onClick={() => setTankCapacity("")}
                  className="bg-red-500 hover:bg-red-600 px-3 rounded-lg"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Pump Mode Selection */}
            <div className="flex gap-2">
              <button
                onClick={() => setPumpMode("full")}
                className={`flex-1 py-2 rounded-lg ${
                  pumpMode === "full"
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                Pump to Full
              </button>
              <button
                onClick={() => setPumpMode("custom")}
                className={`flex-1 py-2 rounded-lg ${
                  pumpMode === "custom"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              >
                Custom Amount
              </button>
            </div>

            {/* Custom Litres Input (only if custom mode) */}
            {pumpMode === "custom" && (
              <div>
                <label className="block mb-1">Litres to Pump</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={customLitres}
                    onChange={(e) => setCustomLitres(e.target.value)}
                    className="w-full p-2 rounded-lg text-black"
                    placeholder="e.g., 15"
                  />
                  <button
                    onClick={() => setCustomLitres("")}
                    className="bg-red-500 hover:bg-red-600 px-3 rounded-lg"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {/* KMs Left (only if full mode) */}
            {pumpMode === "full" && (
              <>
                <div>
                  <label className="block mb-1">KMs Left (if known)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={kmsLeft}
                      onChange={(e) => setKmsLeft(e.target.value)}
                      className="w-full p-2 rounded-lg text-black"
                      placeholder="Leave empty if using fraction"
                    />
                    <button
                      onClick={() => setKmsLeft("")}
                      className="bg-red-500 hover:bg-red-600 px-3 rounded-lg"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Fuel Economy (L/100km)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={fuelEconomy}
                      onChange={(e) => setFuelEconomy(e.target.value)}
                      className="w-full p-2 rounded-lg text-black"
                      step="0.1"
                      placeholder="Required if using KMs left"
                    />
                    <button
                      onClick={() => setFuelEconomy("")}
                      className="bg-red-500 hover:bg-red-600 px-3 rounded-lg"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block mb-1">Or Select Fuel Gauge Fraction</label>
                  <select
                    value={fractionLeft}
                    onChange={(e) => setFractionLeft(e.target.value)}
                    className="w-full p-2 rounded-lg text-black"
                  >
                    <option value="full">Full (using KMs left)</option>
                    <option value="quarter">¼ Tank Left</option>
                    <option value="half">½ Tank Left</option>
                    <option value="threequarter">¾ Tank Left</option>
                  </select>
                </div>
              </>
            )}

            {/* Gas Price */}
            <div>
              <label className="block mb-1">Gas Price ($ per Litre)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={gasPrice}
                  onChange={(e) => setGasPrice(e.target.value)}
                  className="w-full p-2 rounded-lg text-black"
                  step="0.01"
                />
                <button
                  onClick={() => setGasPrice("")}
                  className="bg-red-500 hover:bg-red-600 px-3 rounded-lg"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={handleCalculate}
              className="w-full bg-green-500 hover:bg-green-600 p-3 rounded-lg font-bold mt-4"
            >
              Calculate
            </button>

            {/* Results */}
            {fuelNeeded && (
              <div className="mt-6 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg text-center">
                <p className="text-xl font-bold text-green-600 dark:text-green-300">
                  Pump {fuelNeeded.litres} Litres
                </p>
                <p className="text-lg text-gray-800 dark:text-gray-200">
                  Estimated Cost: ${fuelNeeded.cost}
                </p>

                {/* Fuel Gauge */}
                <div className="mt-4">
                  <p className="mb-1">Fuel Gauge:</p>
                  <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-6 overflow-hidden">
                    <div
                      className={`h-6 transition-all duration-700 ease-in-out`}
                      style={{
                        width: `${fuelNeeded.percentage}%`,
                        backgroundColor:
                          fuelNeeded.percentage <= 35
                            ? "red"
                            : fuelNeeded.percentage <= 70
                            ? "yellow"
                            : "green",
                      }}
                    ></div>
                  </div>
                  <p className="mt-1 text-sm">{fuelNeeded.percentage}% full</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
