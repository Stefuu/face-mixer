"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "./components/Spinner";

export default function DropdownPage() {
  const [leftDropdownOpen, setLeftDropdownOpen] = useState(false);
  const [rightDropdownOpen, setRightDropdownOpen] = useState(false);
  const [people, setPeople] = useState<any[]>([]);
  const [person1, setPerson1] = useState<any>(null);
  const [person2, setPerson2] = useState<any>(null);
  const [mergedImage, setMergedImage] = useState<string>("");
  const [mergedName, setMergedName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const runAsync = async () => {
    const result = await axios.get("/api/people");
    return result;
  };

  useEffect(() => {
    runAsync()
      .then((res: any) => setPeople(res.data))
      .catch((err) => console.error(err));
  }, []);

  function handleSelectPerson(person: any, dropdown: number) {
    console.log("selected person", person);
    if (dropdown === 1) {
      setLeftDropdownOpen(false);
      setPerson1(person);
    } else {
      setRightDropdownOpen(false);
      setPerson2(person);
    }
  }

  function merge() {
    if (person1 && person2) {
      setLoading(true);
      axios
        .post("/api/mix", { person1, person2 })
        .then((res) => {
          setMergedImage(res.data);
          setLoading(false);
        })
        .catch((err) => console.error(err));

      axios
        .post("/api/gpt3", {
          prompt: `merge those two names into a name that is a combination of the two, but try to make a believable name out of it, the name must be at most a two word name, all words must be capitalized\n${person1.name}\n${person2.name}`,
        })
        .then((res) => {
          setMergedName(res.data);
        })
        .catch((err) => console.error(err));
    }
  }
  console.log("mergedName", mergedName);
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <div
          className={`relative inline-block text-left  ${
            leftDropdownOpen ? "dropdown-open" : ""
          }`}
        >
          <button
            onClick={() => setLeftDropdownOpen(!leftDropdownOpen)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Left Dropdown
          </button>
          {person1 && (
            <div className="max-w-md mx-auto">
              <div className="bg-white shadow-lg rounded-lg">
                <img
                  src={person1.picture}
                  alt="Your Image"
                  className="w-full h-auto rounded-t-lg"
                />
                <div className="px-6 py-4">{person1.name}</div>
              </div>
            </div>
          )}
          <div
            className={`origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-in-out duration-150 ${
              leftDropdownOpen
                ? "scale-y-100 opacity-100"
                : "scale-y-0 opacity-0"
            } transform`}
          >
            <div className="py-1">
              {people.map((person) => (
                <div
                  key={person.name + "1"}
                  onClick={() => handleSelectPerson(person, 1)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  {person.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-10 h-15" />
        <div
          className={`relative inline-block text-left ${
            rightDropdownOpen ? "dropdown-open" : ""
          }`}
        >
          <button
            onClick={() => setRightDropdownOpen(!rightDropdownOpen)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Right Dropdown
          </button>
          {person2 && (
            <div className="max-w-md mx-auto">
              <div className="bg-white shadow-lg rounded-lg">
                <img
                  src={person2.picture}
                  alt="Your Image"
                  className="w-full h-auto rounded-t-lg"
                />

                <div className="px-6 py-4">{person2.name}</div>
              </div>
            </div>
          )}
          <div
            className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-in-out duration-150 ${
              rightDropdownOpen
                ? "scale-y-100 opacity-100"
                : "scale-y-0 opacity-0"
            } transform`}
          >
            <div className="py-1">
              {people.map((person) => (
                <div
                  key={person.name + "2"}
                  onClick={() => handleSelectPerson(person, 2)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                >
                  {person.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        {loading ? (
          <Spinner />
        ) : (
          <button
            onClick={merge}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded w-40%"
          >
            Merge
          </button>
        )}
      </div>
      <div className="h-10 w-10" />
      {mergedImage && !loading && (
        <div className="max-w-md mx-auto">
          <div className="bg-white shadow-lg rounded-lg">
            <img
              src={mergedImage}
              alt="Your Image"
              className="w-full h-auto rounded-t-lg"
            />
            <div className="px-6 py-4">
              {mergedName ? mergedName : "Loading..."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
