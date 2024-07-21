import React, { useState, useEffect } from "react";

type ExcelData = { term: string; description: string };

const abbreviations = {
  scale: ["resize"],
  num: ["number"],
  str: ["string"],
  arr: ["array"],
  obj: ["object"],
  func: ["function"],
  var: ["variable"],
  param: ["parameter"],
  args: ["arguments"],
  calc: ["calculate"],
  temp: ["temporary"],
  val: ["value"],
  idx: ["index"],
  elem: ["element"],
  btn: ["button"],
  evt: ["event"],
  msg: ["message"],
  err: ["error"],
  req: ["request"],
  res: ["response"],
};

const Dashboard = () => {
  const [dataMap, setDataMap] = useState<Map<string, ExcelData[]>>(new Map());
  const [input, setInput] = useState("");
  const [parts, setParts] = useState([]);
  const [sentence, setSentence] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  //   const [abbreviations, setAbbreviations] = useState<Map<string, string[]>>(
  //     new Map([
  //       ["dl", ["Downlink", null]],
  //       ["scale", ["resize", null]],
  //       ["num", ["number", null]],
  //       ["str", ["string", null]],
  //       ["arr", ["array", null]],
  //       ["obj", ["object", null]],
  //       ["func", ["function", null]],
  //       ["var", ["variable", null]],
  //       ["param", ["parameter", null]],
  //       ["args", ["arguments", null]],
  //       ["calc", ["calculate", null]],
  //       ["temp", ["temporary", null]],
  //       ["val", ["value", null]],
  //       ["idx", ["index", null]],
  //       ["elem", ["element", null]],
  //       ["btn", ["button", null]],
  //       ["evt", ["event", null]],
  //       ["msg", ["message", null]],
  //       ["err", ["error", null]],
  //       ["req", ["request", null]],
  //       ["res", ["response", null]],
  //     ])
  //   );

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const splitCamelCaseWithTerm = (term) => {
    setInput(term);
    const result = term
      .split(/(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|\d+|_/)
      .filter(Boolean)
      .map((part) => ({
        part,
        explanations: abbreviations[part.toLowerCase()] || [],
        selectedExplanation: abbreviations[part.toLowerCase()]
          ? abbreviations[part.toLowerCase()][0]
          : null,
      }));
    setParts(result);
  };

  const splitCamelCase = () => {
    const result = input
      .split(/(?<=[a-z])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])|\d+|_/)
      .filter(Boolean)
      .map((part) => ({
        part,
        explanations: abbreviations[part.toLowerCase()] || [],
        selectedExplanation: abbreviations[part.toLowerCase()]
          ? abbreviations[part.toLowerCase()][0]
          : null,
      }));
    setParts(result);
    setRecentSearches((prev) =>
      [input, ...prev.filter((term) => term !== input)].slice(0, 20)
    );
  };

  const handleExplanationChange = (index, explanation) => {
    const newParts = [...parts];
    newParts[index].selectedExplanation = explanation;
    setParts(newParts);
  };

  useEffect(() => {
    const newSentence = parts
      .map((part) => part.selectedExplanation || part.part)
      .join(" ");
    setSentence(newSentence);
  }, [parts]);

  useEffect(() => {
    fetch("/api/read-excel")
      .then((response) => response.json())
      .then((data) => {
        const map = new Map<string, ExcelData[]>(data);
        setDataMap(map);
        // dataMap을 abbreviations에 추가
        data.forEach(([key, values]: [string, ExcelData[]]) => {
          if (!abbreviations[key]) {
            abbreviations[key] = [];
          }
          values.forEach((value) => {
            if (!abbreviations[key].includes(value.term)) {
              abbreviations[key].push(value.term);
              console.log("Abbreviations:", value.term);
            }
          });
        });

        console.log("Abbreviations:", abbreviations);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-8">
      {/* <pre>{JSON.stringify([...dataMap], null, 2)}</pre> */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-700">
          RAN Abbreviation Navigator
        </h1>

        {sentence && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            {/* <h2 className="text-xl font-semibold mb-2 text-indigo-700">
              Constructed Meaning:
            </h2> */}
            <p className="text-gray-800 italic">{sentence}</p>
          </div>
        )}

        <div className="mb-6 flex">
          <input
            type="text"
            className="flex-grow border-2 border-indigo-300 rounded-l-md p-2 focus:outline-none focus:border-indigo-500 transition-colors text-black"
            placeholder="Enter complex variable or function name"
            value={input}
            onChange={handleInputChange}
          />
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            onClick={splitCamelCase}
          >
            Split
          </button>
        </div>

        <div className="flex">
          {parts.length > 0 && (
            <div className="flex w-4/5 grid grid-cols-1  gap-4">
              {parts.map((item, index) => (
                <div
                  key={index}
                  className="border border-indigo-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow duration-300"
                >
                  <h2 className="text-xl font-semibold mb-2 text-indigo-600">
                    {item.part}
                  </h2>
                  {item.explanations.length > 0 ? (
                    <div className="space-y-2">
                      {item.explanations.map((exp, i) => (
                        <div key={i} className="flex items-center">
                          <input
                            type="radio"
                            id={`${item.part}-${i}`}
                            name={`explanation-${index}`}
                            value={exp}
                            checked={item.selectedExplanation === exp}
                            onChange={() => handleExplanationChange(index, exp)}
                            className="mr-2 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`${item.part}-${i}`}
                            className="text-gray-700 hover:text-indigo-600 cursor-pointer transition-colors"
                          >
                            {exp}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-yellow-600 italic">
                      No explanation found
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
          {sentence && (
            <div className="pl-5 w-1/5">
              <div className="text-center rounded-lg">
                <p className="text-xs font-semibold text-gray-800">
                  Recent Search
                </p>
              </div>
              <div className="text-left rounded-lg">
                <ul>
                  {recentSearches.map((term, index) => (
                    <li key={index} className="text-xs">
                      <button
                        onClick={() => splitCamelCaseWithTerm(term)}
                        className="text-blue-500 hover:underline"
                      >
                        {term}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
