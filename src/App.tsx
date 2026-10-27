import { useState } from "react";
import type { ChangeEvent } from "react";

interface Shape {
  type: string;
}
interface Circle extends Shape {
  type: "circle";
  radius: number;
}

interface Rectangle extends Shape {
  type: "rectangle";
  width: number;
  height: number;
}

interface Triangle extends Shape {
  type: "triangle";
  base: number;
  height: number;
}


type Shapes = Circle | Rectangle | Triangle;
type ShapeType = Shapes["type"]

const ShapeFieldsConfig: Record<ShapeType, string[]> = {
  circle: ["radius"],
  rectangle: ["width", "height"],
  triangle: ["base", "height"]
}

const exaustiveMach = (_: never): never => {
  throw new Error("U shouldn't be here")
}

const calculateArea = (shape: Shapes): number => {
  switch (shape.type) {
    case "circle":
      return 3.14 * shape.radius * shape.radius
    case "rectangle":
      return shape.width * shape.height
    case "triangle":
      return (shape.base * shape.height) * 0.5
    default:
      return exaustiveMach(shape)
  }
}

function App() {
  const [selectedShape, setSelectedShape] = useState<ShapeType | "">("");
  const [values, setValues] = useState<Record<string, number | undefined>>({})

  const handleInputsChange = (event: ChangeEvent<HTMLInputElement>, fieldName: string) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: Number(event.target.value)
    }))
  }

  const handleShapeChange = (shape: ShapeType) => {
    setSelectedShape(shape);
    const initialValues: Record<string, number | undefined> = {}
    ShapeFieldsConfig[shape].forEach(field => {
      initialValues[field] = undefined
    })
    setValues(initialValues)
  }

  const updateResult = (shapeType: string) => {
    if (shapeType === "circle") {
      return calculateArea({
        type: shapeType,
        radius: values.radius || 0
      })
    } else if (shapeType === "rectangle") {
      return calculateArea({
        type: shapeType,
        width: values.width || 0,
        height: values.height || 0
      })
    } else if (shapeType === "triangle") {
      return calculateArea({
        type: shapeType,
        base: values.base || 0,
        height: values.height || 0
      })
    }
    
  }

  const shapes: ShapeType[] = ["circle", "rectangle", "triangle"];
  return (
    <section className="text-center font-Montserrat text-gray-700 flex items-center justify-start flex-col gap-4 min-h-svh bg-gray-100">
      <div className="container mx-auto mt-24 px-4 ">
        <h1 className="text-7xl font-bold">Shape Manager</h1>
        <p className="text-3xl mt-6 text-gray-600">Calculate areas of geometric shapes</p>
        <div className="card bg-white mt-6 rounded-lg  max-w-md mx-auto text-start ">
          <div className="cardHeader text-2xl font-semibold border-b border-gray-200">
            <h2 className="p-6">Shape Calculator</h2>
          </div>
          <div className="cardContent p-6">
            <div className="selectGroup">
              <label className="block text-lg" htmlFor="shapeSelect">Shape type</label>
              <select
                onChange={(e) => handleShapeChange(e.target.value as Shapes["type"])}
                value={selectedShape}
                id="shapeSelect"
                className="block w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option value="" disabled>Select a shape</option>
                {shapes.map((shape) => (
                  <option key={shape} value={shape}>
                    {shape.charAt(0).toUpperCase() + shape.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="inputsGroup">
                {selectedShape && ShapeFieldsConfig[selectedShape].map((field) => (
                  <div key={`${field}`}>
                    <label className="block mt-4" htmlFor={`${field}Input`}>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                    <input className="block w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                      type="number"
                      id = {`${field}Input`}
                      min="0"
                      value={values[field]}
                      onChange={(e) => handleInputsChange(e, field)}
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        {selectedShape != "" ? 
        <div className="card bg-white mt-6 rounded-lg  max-w-md mx-auto text-start">
          <p className="text-lg p-4 mt-6 text-gray-600">{`Area of ${selectedShape}:`} <span className="text-md">{`${updateResult(selectedShape)?.toFixed(2)}`}</span></p>
        </div>
        : ""
      }
      </div>
    </section>
  )
}

export default App
