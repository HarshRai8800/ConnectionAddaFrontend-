

const colorMap = [
  { name: "Red", color: "#FF5733" },
  { name: "Green", color: "#33FF57" },
  { name: "Blue", color: "#3357FF" },
  { name: "Yellow", color: "#F5A623" },
  { name: "Purple", color: "#8E44AD" }
];




function getColorClass(code:number) {
   
  
    return colorMap[code] || "bg-gray-500 text-white border-gray-700 border-2"; // Default styling if code is invalid
  }
  export default getColorClass
  export  {colorMap}
  