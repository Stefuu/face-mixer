"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "./components/Spinner";
import PersonDescriptionField from "./components/Description";
import { useGlobal } from "./context/globalContext";
import LoadingOverlay from "./components/OverlayLoading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DropdownPage() {
  const [leftDropdownOpen, setLeftDropdownOpen] = useState(false);
  const [rightDropdownOpen, setRightDropdownOpen] = useState(false);
  const [people, setPeople] = useState<any[]>([]);
  const [person1, setPerson1] = useState<any>(null);
  const [person2, setPerson2] = useState<any>(null);
  const [mergedImage, setMergedImage] = useState<string>("");
  const [mergedName, setMergedName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPeople, setLoadingPeople] = useState<boolean>(true);
  const [filteredPeople, setFilteredPeople] = useState<any[]>([]);
  const [mergedDescription, setMergedDescription] = useState<string>("");
  const [loadingDescription, setLoadingDescription] = useState<boolean>(false);

  const { pdp1, pdp2, setPdp1, setPdp2 } = useGlobal();

  useEffect(() => {
    setLoadingPeople(true);
    axios
      .get("/api/people")
      .then((res: any) => {
        setPeople(res.data);
        setLoadingPeople(false);
      })
      .catch((err) => {
        setLoadingPeople(false);
        console.error(err);
      });
  }, []);

  useEffect(() => {
    setFilteredPeople(people);
  }, [people]);

  function handleSelectPerson(person: any, dropdown: number) {
    setMergedDescription("");
    setFilteredPeople(people);
    if (dropdown === 1) {
      setLeftDropdownOpen(false);
      setPerson1(person);
      setPdp1(null);
      axios
        .post("/api/pdp", {
          name: person.name,
          emails: [person.email],
        })
        .then((pdpRes) => {
          setPdp1(pdpRes.data);
        })
        .catch(({ response }) => {
          toast.error(<>Could not find {response.data.name}'s PDP</>, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    } else {
      setRightDropdownOpen(false);
      setPerson2(person);
      setPdp2(null);
      axios
        .post("/api/pdp", {
          name: person.name,
          emails: [person.email],
        })
        .then((pdpRes) => {
          setPdp2(pdpRes.data);
        })
        .catch(({ response }) => {
          toast.error(<>Could not find {response.data.name}'s PDP</>, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    }
  }

  async function merge() {
    setMergedDescription("");

    let mergedNameResponse;
    if (person1 && person2) {
      setLoading(true);
      axios
        .post("/api/mix", { person1, person2 })
        .then((res) => {
          setMergedImage(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });

      const res = await axios.post("/api/gpt4", {
        prompt: `merge those two names into a name that is a combination of the two, the result must contain two words and should each word should not be exactly equal to the original names. The generated names must be capitalized, do not add punctuation\n${person1.name}\n${person2.name}`,
      });
      mergedNameResponse = res.data;
      setMergedName(mergedNameResponse);
    }

    if (pdp1 && pdp2) {
      setLoadingDescription(true);
      const pdp1Desc = await axios.post("/api/gpt4", {
        prompt: `Give me a short description of this person based on all of this characteristics\n${JSON.stringify(
          pdp1
        )}`,
      });
      const pdp2Desc = await axios.post("/api/gpt4", {
        prompt: `Give me a short description of this person based on all of this characteristics\n${JSON.stringify(
          pdp2
        )}`,
      });

      const merged = await axios.post("/api/gpt4", {
        prompt: `Give me a very short description of ${mergedNameResponse} (${mergedNameResponse} is it's name, don't change it) a fictional person that is the fusion of these two people\nperson 1: ${pdp1Desc.data}\nperson 2: ${pdp2Desc.data}\n\nTry to actually merge their traits instead of just mentioning both of them. Also don't mention that they are a fictional character and don't mention that it is a fusion, treat it like it was a real person`,
      });
      setLoadingDescription(false);
      setMergedDescription(merged.data);
    }
  }

  function handleDropdownChange(e: any) {
    const value = e.target.value;

    const filteredPeople = people.filter((person) =>
      person.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredPeople(filteredPeople);
  }

  return (
    <div className="container mx-auto p-4">
      {mergedImage && !loading && (
        <div className="hide-above-md">
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
          <div style={{ height: "15px" }} />
        </div>
      )}
      <div className="flex justify-between">
        <div
          className={`relative inline-block text-left  ${
            leftDropdownOpen ? "dropdown-open" : ""
          }`}
        >
          <div className="flex items-center mb-2">
            <input
              placeholder="Select person"
              type="text"
              onChange={handleDropdownChange}
              onClick={() => setLeftDropdownOpen(!leftDropdownOpen)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            />
            <div
              className="ml-2 cursor-pointer"
              onClick={() => {
                handleSelectPerson(
                  people[Math.floor(Math.random() * people.length)],
                  1
                );
              }}
            >
              <div className="fa-regular fa-dice fa-2xl " />
            </div>
          </div>
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
            className={`origin-top-left top-[30px] absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-in-out duration-150 ${
              leftDropdownOpen
                ? "scale-y-100 opacity-100"
                : "scale-y-0 opacity-0"
            } transform`}
          >
            <div className="py-1">
              {filteredPeople.map((person) => (
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
        <div className="w-5 h-15" />
        {mergedImage && !loading && (
          <div className="hide-below-md min-w-[500px]">
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
            <div style={{ height: "15px" }} />
          </div>
        )}
        <div className="w-5 h-15" />
        <div
          className={`relative inline-block text-left ${
            rightDropdownOpen ? "dropdown-open" : ""
          }`}
        >
          <div className="flex items-center mb-2">
            <input
              placeholder="Select person"
              type="text"
              onChange={handleDropdownChange}
              onClick={() => setRightDropdownOpen(!rightDropdownOpen)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            />
            <div
              className="ml-2 cursor-pointer"
              onClick={() => {
                handleSelectPerson(
                  people[Math.floor(Math.random() * people.length)],
                  2
                );
              }}
            >
              <div className="mt-1 fa-regular fa-dice fa-2xl " />
            </div>
          </div>
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
            className={`top-[30px] origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-in-out duration-150 ${
              rightDropdownOpen
                ? "scale-y-100 opacity-100"
                : "scale-y-0 opacity-0"
            } transform`}
          >
            <div className="py-1">
              {filteredPeople.map((person) => (
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
      {loadingDescription && (
        <div style={{ width: "100%", textAlign: "center", marginTop: "20px" }}>
          <div>Loading description...</div>
        </div>
      )}
      {mergedDescription && pdp1 && pdp2 && (
        <PersonDescriptionField description={mergedDescription} />
      )}
      <LoadingOverlay isLoading={loadingPeople} />
      <ToastContainer />
    </div>
  );
}
