export type Tool = {
  name: string;
  description: string;
  parameters: ToolParameter[];
};

type ToolParameter = {
  name: string;
  description: string;
  type: string;
  required: boolean;
};

type FunctionParameter = {
  parameterName: string;
  parameterValue: string;
};

// const cityToLatLonTool: Tool = {
//   name: "CityToLatLon",
//   description: "Get the latitude and longitude for a given city",
//   parameters: [
//     {
//       name: "city",
//       description: "The city to get the latitude and longitude for",
//       type: "string",
//       required: true,
//     },
//   ],
// };

// const weatherFromLatLonTool: Tool = {
//   name: "WeatherFromLatLon",
//   description: "Get the weather for a location",
//   parameters: [
//     {
//       name: "latitude",
//       description: "The latitude of the location",
//       type: "number",
//       required: true,
//     },
//     {
//       name: "longitude",
//       description: "The longitude of the location",
//       type: "number",
//       required: true,
//     },
//   ],
// };

// const latlonToCityTool: Tool = {
//   name: "LatLonToCity",
//   description: "Get the city name for a given latitude and longitude",
//   parameters: [
//     {
//       name: "latitude",
//       description: "The latitude of the location",
//       type: "number",
//       required: true,
//     },
//     {
//       name: "longitude",
//       description: "The longitude of the location",
//       type: "number",
//       required: true,
//     },
//   ],
// };

// const weatherFromLocationTool: Tool = {
//   name: "WeatherFromLocation",
//   description: "Get the weather for a location",
//   parameters: [
//     {
//       name: "location",
//       description: "The location to get the weather for",
//       type: "string",
//       required: true,
//     },
//   ],
// };

const makeDrinkTool: Tool = {
  name: "makeDrink",
  description: "Get the ingredients for a drink",
  parameters: [
    {
      name: "ingredient",
      description:
        'The ingredient to get the drink for. Return a json object with this schema: {name: string; unit: string; quantity: number; isOptional: boolean; }. For example:  {name: "whiskey", quantity: 1.5, unit: "oz", isOptional: false}',
      type: "string",
      required: true,
    },
  ],
};

async function CityToLatLon(city: string) {
  const output = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${city}&format=json`
  );
  const json = await output.json();
  return [json[0].lat, json[0].lon];
}
async function LatLonToCity(latitude: string, longitude: string) {
  const output = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
  );
  const json = await output.json();
  console.log(json.display_name);
}

async function WeatherFromLatLon(latitude: string, longitude: string) {
  const output = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=1`
  );

  const json = await output.json();
  console.log(`${json.current.temperature_2m} degrees Farenheit`);
}

async function WeatherFromLocation(location: string) {
  const latlon = await CityToLatLon(location);
  await WeatherFromLatLon(latlon[0], latlon[1]);
}

export const toolsString = JSON.stringify(
  {
    tools: [makeDrinkTool],
  },
  null,
  2
);

function getValueOfParameter(
  parameterName: string,
  parameters: FunctionParameter[]
) {
  return parameters.filter((p) => p.parameterName === parameterName)[0]
    .parameterValue;
}

export async function executeFunction(
  functionName: string,
  parameters: FunctionParameter[]
) {
  switch (functionName) {
    case "WeatherFromLocation":
      return await WeatherFromLocation(
        getValueOfParameter("location", parameters)
      );
    case "WeatherFromLatLon":
      return await WeatherFromLatLon(
        getValueOfParameter("latitude", parameters),
        getValueOfParameter("longitude", parameters)
      );
    case "LatLonToCity":
      return await LatLonToCity(
        getValueOfParameter("latitude", parameters),
        getValueOfParameter("longitude", parameters)
      );
  }
}
