"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { siteConfig } from "@/config/site";
import { formatCurrency } from "./utils";
import { useRouter } from "next/navigation";

// Dynamic imports
const CalculatorHeader = dynamic(() => import("./CalculatorHeader"), {
  ssr: false,
});
const CalculatorForm = dynamic(() => import("./CalculatorForm"), { ssr: false });
const CalculatorResults = dynamic(() => import("./CalculatorResults"), { ssr: false });
const PriceCards = dynamic(() => import("./PriceCards"), { ssr: false });

const CalculatorSection = () => {
  const [calculatorResult, setCalculatorResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { prices, savingsPercentage, co2PerLiter, vehicleMultipliers } =
    siteConfig.calculator;
  const resultsRef = useRef(null);
  const router = useRouter();

  const onNavClick = (path) => router.push(path);

  useEffect(() => {
    if (calculatorResult && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [calculatorResult]);

  // Function for handling savings and CO2 reduction calculations
  const handleCalculatorSubmit = (e, values) => {
    e.preventDefault();
    setIsCalculating(true);
    setCalculatorResult(null);

    const { calculatorInputType, monthlySpend, monthlyLiters, vehicleType } =
      values;

    const parsedSpend =
      calculatorInputType === "spend" ? parseFloat(monthlySpend) || 0 : 0;
    const parsedLiters =
      calculatorInputType === "liters" ? parseFloat(monthlyLiters) || 0 : 0;

    let monthlyFuelSpend, monthlyFuelLiters;

    // Calculating fuel spend or liters based on input type (spend or liters)
    if (calculatorInputType === "spend") {
      monthlyFuelSpend = parsedSpend;
      monthlyFuelLiters = monthlyFuelSpend / prices.petrol; // Always using petrol price
    } else {
      monthlyFuelLiters = parsedLiters;
      monthlyFuelSpend = monthlyFuelLiters * prices.petrol; // Always using petrol price
    }

    // Calculate savings and CO2 reduction using fixed savings percentage
    const monthlySavings = monthlyFuelSpend * (savingsPercentage / 100);
    const yearlySavings = monthlySavings * 12;

    // Get the correct CO2 value based on petrol (starting fuel type) and calculate reduction when converting to CNG
    const co2Reduction = monthlyFuelLiters * co2PerLiter; // Always use petrol CO2 factor
    const multiplier = vehicleMultipliers[vehicleType] || 1;

    setCalculatorResult({
      monthlySavings: formatCurrency(monthlySavings * multiplier),
      yearlySavings: formatCurrency(yearlySavings * multiplier),
      savingsPercentage: savingsPercentage, // Displaying the fixed savings percentage
      co2Reduction: Math.round(co2Reduction * multiplier), // CO2 reduction from petrol to CNG
      vehicleType: vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1),
    });

    setTimeout(() => setIsCalculating(false), 300);
  };

  return (
    <motion.section
      id="calculator"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="py-20 bg-linear-to-br from-deep-blue via-dark-blue to-deep-blue text-white relative overflow-hidden"
    >
      <CalculatorHeader />
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/10 grid lg:grid-cols-2">
          <CalculatorForm
            onSubmit={handleCalculatorSubmit}
            isCalculating={isCalculating}
          />
          <div ref={resultsRef}>
            <CalculatorResults
              calculatorResult={calculatorResult}
              onNavClick={onNavClick}
            />
          </div>
        </div>
        <PriceCards />
      </div>
    </motion.section>
  );
};;;;

export default CalculatorSection;
