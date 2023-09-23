"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../components/Spinner";
import PersonDescriptionField from "../components/Description";
import { useGlobal } from "../context/globalContext";
import LoadingOverlay from "../components/OverlayLoading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../components/LoadingText.css";
import LoadingText from "../components/LoadingText";
import { validUrl } from "../../../utils";
import { funnyLoadingMessages } from "../../../utils";

export default function DropdownPage() {
  const [mergedImage, setMergedImage] = useState<string>("");
  const [mergedName, setMergedName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPeople, setLoadingPeople] = useState<boolean>(true);

  const [mergedDescription, setMergedDescription] = useState<string>("");
  const [loadingDescription, setLoadingDescription] = useState<boolean>(false);
  const [person1Pic, setPerson1Pic] = useState<any>(null);
  const [person2Pic, setPerson2Pic] = useState<any>(null);
  const [person1Name, setPerson1Name] = useState<any>(null);
  const [person2Name, setPerson2Name] = useState<any>(null);
  const [person1Desc, setPerson1Desc] = useState<any>(null);
  const [person2Desc, setPerson2Desc] = useState<any>(null);

  async function merge() {
    setMergedDescription("");

    let mergedNameResponse;
    if (person1Pic && person2Pic && person1Name && person2Name) {
      setLoading(true);
      axios
        .post("/api/mix", {
          person1: { picture: person1Pic },
          person2: { picture: person2Pic },
        })
        .then((res) => {
          setMergedImage(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });

      const res = await axios.post("/api/gpt4", {
        prompt: `merge those two names into a name that is a combination of the two, the result must contain two words and should each word should not be exactly equal to the original names. The generated names must be capitalized, do not add punctuation\n${person1Name}\n${person2Name}`,
      });
      mergedNameResponse = res.data;
      setMergedName(mergedNameResponse);
    }

    if (person1Desc && person2Desc) {
      setLoadingDescription(true);
      const pdp1Desc = await axios.post("/api/gpt4", {
        prompt: `Give me a short description of this person based on all of this characteristics\n${person1Desc}`,
      });
      const pdp2Desc = await axios.post("/api/gpt4", {
        prompt: `Give me a short description of this person based on all of this characteristics\n${person2Desc}`,
      });

      const merged = await axios.post("/api/gpt4", {
        prompt: `Give me a very short description of ${mergedNameResponse} (${mergedNameResponse} is it's name, don't change it) a fictional person that is the fusion of these two people\nperson 1: ${pdp1Desc.data}\nperson 2: ${pdp2Desc.data}\n\nTry to actually merge their traits instead of just mentioning both of them. Also don't mention that they are a fictional character and don't mention that it is a fusion, treat it like it was a real person`,
      });
      setLoadingDescription(false);
      setMergedDescription(merged.data);
    }
  }

  function handleImageChange(value: any, number: number) {
    if (number === 1) {
      setPerson1Pic(value);
    } else {
      setPerson2Pic(value);
    }
  }

  function handleNameChange(value: any, number: number) {
    if (number === 1) {
      setPerson1Name(value);
    } else {
      setPerson2Name(value);
    }
  }

  function handleDescChange(value: any, number: number) {
    if (number === 1) {
      setPerson1Desc(value);
    } else {
      setPerson2Desc(value);
    }
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
        <div className={`relative inline-block text-left grow`}>
          <h1 className="text-3xl font-semibold text-blue-500 mb-5">
            Person 1
          </h1>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Image URL
            </label>
            <input
              placeholder="Insert image URL"
              type="text"
              onChange={(e) => handleImageChange(e.target.value, 1)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Person Name
            </label>
            <input
              placeholder="Insert person name"
              type="text"
              onChange={(e) => handleNameChange(e.target.value, 1)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Person Description
            </label>
            <input
              placeholder="Insert person description"
              type="text"
              onChange={(e) => handleDescChange(e.target.value, 1)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            />
          </div>
          {person1Pic && validUrl(person1Pic) && (
            <div className="max-w-md mx-auto">
              <div className="bg-white shadow-lg rounded-lg">
                <img
                  src={person1Pic}
                  alt="Your Image"
                  className="w-full h-auto rounded-t-lg"
                />
                <div className="px-6 py-4">{person1Name}</div>
              </div>
            </div>
          )}
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
        <div className={`relative inline-block text-left grow`}>
          <h1 className="text-3xl font-semibold text-blue-500 mb-5">
            Person 2
          </h1>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Image URL
            </label>
            <input
              placeholder="Insert image URL"
              type="text"
              onChange={(e) => handleImageChange(e.target.value, 2)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Person Name
            </label>
            <input
              placeholder="Insert person name"
              type="text"
              onChange={(e) => handleNameChange(e.target.value, 2)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-1">
              Person Description
            </label>
            <input
              placeholder="Insert person description"
              type="text"
              onChange={(e) => handleDescChange(e.target.value, 2)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            />
          </div>
          {person2Pic && validUrl(person2Pic) && (
            <div className="max-w-md mx-auto">
              <div className="bg-white shadow-lg rounded-lg">
                <img
                  src={person2Pic}
                  alt="Your Image"
                  className="w-full h-auto rounded-t-lg"
                />

                <div className="px-6 py-4">{person2Name}</div>
              </div>
            </div>
          )}
          <div
            className={`top-[30px] origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition ease-in-out duration-150 ${"scale-y-0 opacity-0"} transform`}
          ></div>
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
          <LoadingText strings={funnyLoadingMessages} />
        </div>
      )}
      {mergedDescription && person1Desc && person2Desc && (
        <PersonDescriptionField description={mergedDescription} />
      )}

      <ToastContainer />
    </div>
  );
}
