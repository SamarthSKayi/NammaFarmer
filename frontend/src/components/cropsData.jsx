// cropsData.js
const cropNames = [
    "Wheat", "Rice", "Barley", "Oats", "Corn", "Soybean", "Cotton", "Sugarcane", "Sunflower", "Canola", 
    "Tomato", "Potato", "Carrot", "Cabbage", "Lettuce", "Onion", "Garlic", "Peas", "Beans", "Chickpea",
    "Almond", "Apple", "Banana", "Grapes", "Orange", "Pineapple", "Mango", "Papaya", "Peach", "Plum",
    "Avocado", "Kiwi", "Pomegranate", "Watermelon", "Melon", "Cucumber", "Zucchini", "Eggplant", "Bell Pepper",
    "Strawberry", "Blueberry", "Raspberry", "Blackberry", "Coconut", "Date", "Fig", "Lemon", "Lime", "Chili",
    "Cabbage", "Spinach", "Broccoli", "Brussels Sprout", "Cauliflower", "Radish", "Sweet Potato", "Pumpkin",
    "Asparagus", "Artichoke", "Beetroot", "Turnip", "Rhubarb", "Squash", "Fennel", "Leek", "Chard", "Mustard",
    "Tobacco", "Tea", "Coffee", "Cocoa", "Cinnamon", "Nutmeg", "Clove", "Cardamom", "Saffron", "Ginger",
    "Lavender", "Chamomile", "Mint", "Basil", "Thyme", "Oregano", "Rosemary", "Sage", "Parsley", "Cilantro",
    "Marjoram", "Dill", "Tarragon", "Bay Leaf", "Elderberry", "Goji Berry", "Acai Berry", "Mulberry", "Gooseberry",
    // Add more crops as needed
  ];
  
  const generateMonthlyData = (startValue) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    // Randomized values for more irregular behavior
    const randomBaseAmplitude = Math.floor(Math.random() * 200) + 150; // Base amplitude random between 150 and 350
    const randomBaseFrequencyFactor = Math.random() * 5 + 1; // Base frequency random between 1 and 6 full cycles per year
    const randomPhaseShift = Math.random() * Math.PI;  // Random initial phase shift
    
    let amplitude = randomBaseAmplitude;
    let frequencyFactor = randomBaseFrequencyFactor;
  
    return months.map((month, index) => {
      // Introduce random variation each month for amplitude, frequency, and phase shift
      amplitude += Math.floor(Math.random() * 30) - 15;  // Randomly vary the amplitude between -15 and +15
      frequencyFactor += (Math.random() * 2 - 1);  // Randomly vary frequency factor between -1 and +1
      
      const B = (2 * Math.PI) * frequencyFactor / 12;  // Calculate frequency for this month
      const C = randomPhaseShift + (Math.random() * Math.PI - Math.PI / 2);  // Randomize phase shift slightly
  
      // Calculate the sine value with these randomized parameters
      const value = amplitude * Math.sin(B * index + C) + startValue;
      return {
        month,
        value: Math.round(value),  // Round to get integer values
      };
    });
  };
  
  // Function to generate crops data with 1000 crops
  const generateCropsData = (numCrops) => {
    const cropStartingValues = {
      "Wheat": 500,    // Wheat starting value
      "Rice": 400,     // Rice starting value
      "Barley": 300,   // Barley starting value
      "Oats": 350,     // Oats starting value
      "Corn": 600,     // Corn starting value
      "Soybean": 450,  // Soybean starting value
      "Cotton": 550,   // Cotton starting value
      "Sugarcane": 700, // Sugarcane starting value
      "Sunflower": 450,
      "Canola": 400,
      // Add more crops and their starting values...
    };
  
    let crops = {};
    for (let i = 0; i < numCrops; i++) {
      const cropName = cropNames[i % cropNames.length]; // Loop through crop names
      const startValue = cropStartingValues[cropName] || 400; // Use the crop's specific start value or default to 400
      crops[cropName] = generateMonthlyData(startValue);
    }
    return crops;
  };
  
  // Generating the data for 1000 crops
  export const cropsData = generateCropsData(1000);
  