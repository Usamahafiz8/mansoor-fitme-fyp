import Image from "next/image";
import NextLink from "next/link";
import { useState } from "react";

const typeWriterEffect = (text, elementId, delay = 30) => {
  // Decreased delay for faster typing
  const element = document.getElementById(elementId);
  if (!element) return;

  element.innerHTML = ""; // Clear previous content
  let index = 0;

  function type() {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      setTimeout(type, delay);
    } else {
      // Add glowing effect once typing is complete
      element.classList.add("glow");
    }
  }

  type();
};

const Hero = () => {
  const [inputValue, setInputValue] = useState("");
  const [placeholder, setPlaceholder] = useState(
    "This is your AI personalized styling coach..."
  );

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSend = async () => {
    // Dummy PDF text for demonstration purposes
    const pdfText = "Sample text from the PDF for AI to analyze.";

    // Check for empty input
    if (!inputValue.trim()) return;

    const messageToSend = [
      {
        role: "user",
        content: `ROLE: You are integrated into an e-commerce store website as a personalized fashion and styling coach.
    -------
    TASK:
    1. Analyze the user's prompt and suggest the best styling of clothes according to their requirement.
    2. Provide short and concise advice, with a maximum of 5 lines.
    3. Responses should start with "Hey, this is your personal styling coach." for the first response afterward continue as you want
	4. You will judge the language of the user and answer the user in the same language

    -------
    RESTRICTIONS:
    - You are not allowed to search the web for the user.
    - You are not allowed to create DALL-E images.
    - Avoid generating irrelevant results that do not pertain to styling advice.
    -------
    USER MESSAGE: ${inputValue}`,
      },
    ];

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: Bearer `${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, // Use the environment variable
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: messageToSend,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const aiMessage =
        data.choices[0]?.message?.content || "No response from AI.";

      // Clear previous response and update with typewriter effect
      typeWriterEffect(aiMessage, "aiai");

      // Change placeholder after the first prompt
      setPlaceholder("Anything Else!");
    } catch (error) {
      console.error("Error fetching AI response:", error);
      // Handle error appropriately
    }

    // Clear input field
    setInputValue("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="relative overflow-hidden bg-slate-900 full-bleed">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:static">
          <div className="sm:max-w-lg">
            <h1 className="text-2xl font-bold tracking-tight text-gray-100 sm:text-6xl">
              Make your fashion more perfect
            </h1>

            <div className="mt-8 flex items-center space-x-4">
              <input
                type="text"
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                className="flex-1 p-3 text-white bg-indigo-600 border-2 border-indigo-600 rounded-full outline-none placeholder-white placeholder-italic focus:border-indigo-700 focus:ring-2 focus:ring-indigo-400 hover:shadow-glow"
              />
              <button
                onClick={handleSend}
                className="w-12 h-12 bg-indigo-700 text-white rounded-full flex items-center justify-center focus:outline-none hover:bg-indigo-800 hover:shadow-glow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12l16-8-8 16L4 12z"></path>
                </svg>
              </button>
            </div>

            <p className="mt-8 text-xl text-gray-500" id="aiai">
              {/* Response will be written by typewriter effect */}
            </p>

            <div className="mt-10">
              <NextLink href="/products" passHref>
                <span className="inline-block text-center bg-indigo-600 border border-transparent rounded-md py-3 px-8 font-medium text-white hover:bg-indigo-700 cursor-pointer">
                  Shop Now
                </span>
              </NextLink>
            </div>
          </div>
          <div>
            <div
              aria-hidden="true"
              className="pointer-events-none lg:absolute lg:inset-y-0 lg:max-w-7xl lg:mx-auto lg:w-full"
            >
              <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex-shrink-0 grid grid-cols-1 gap-y-6 lg:gap-y-8">
                    <div className="rounded-lg overflow-hidden sm:opacity-0 lg:opacity-100">
                      <Image
                        width={176}
                        height={256}
                        src="https://i.postimg.cc/F1tpBjds/tile-01.jpg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        width={176}
                        height={256}
                        src="https://i.postimg.cc/CLLbwrYT/tile-02.jpg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 grid grid-cols-1 gap-y-6 lg:gap-y-8">
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        width={176}
                        height={256}
                        src="https://i.postimg.cc/fbX9867X/tile-03.jpg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        width={176}
                        height={256}
                        src="https://i.postimg.cc/zBrR60pQ/tile-04.jpg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        width={176}
                        height={256}
                        src="https://i.postimg.cc/52Dzqxzb/tile-05.jpg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-shrink-0 grid grid-cols-1 gap-y-6 lg:gap-y-8">
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        width={176}
                        height={256}
                        src="https://i.postimg.cc/cLvYnKrF/tile-06.jpg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                    <div className="rounded-lg overflow-hidden">
                      <Image
                        width={176}
                        height={256}
                        src="https://i.postimg.cc/G3jkwwWx/tile-07.jpg"
                        alt=""
                        className="w-full h-full object-center object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .glow {
          animation: glow-animation 1.5s ease-in-out infinite;
          color: #fff;
        }

        @keyframes glow-animation {
          0% {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.6);
          }
          50% {
            text-shadow: 0 0 15px rgba(255, 255, 255, 1);
          }
          100% {
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.6);
          }
        }
      `}</style>
    </div>
  );
};

export default Hero;