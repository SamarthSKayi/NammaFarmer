import React, { useState } from "react";
import { FaTools, FaBookOpen, FaPlayCircle, FaCheckCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Import Circular Progressbar styles

const courses = [
  {
    title: "Sustainable Farming Practices",
    progress: 50,
    videos: [
      {
        name: "Introduction to Sustainable Farming",
        url: "https://www.youtube.com/embed/dh3fK61EHFk", // Add your YouTube URL here
      },
      {
        name: "Advanced Techniques in Sustainable Farming",
        url: "https://www.youtube.com/embed/U4lzG3z8Srk", // Add your YouTube URL here
      },
    ],
    tests: [
      { name: "Basic Farming Knowledge", link: "/test/sustainable-farming/basic" },
      { name: "Advanced Farming Techniques", link: "/test/sustainable-farming/advanced" },
    ],
    additionalResources: "/resources/sustainable-farming",
  },
  {
    title: "Efficient Irrigation Techniques",
    progress: 70,
    videos: [
      {
        name: "Water Conservation Strategies",
        url: "https://www.youtube.com/embed/xHx7rx66f9w", // Add your YouTube URL here
      },
      {
        name: "Optimizing Irrigation Systems",
        url: "https://www.youtube.com/embed/Ygqxf-MtFGM", // Add your YouTube URL here
      },
    ],
    tests: [
      { name: "Water Conservation Strategies", link: "/test/irrigation-techniques/water" },
      { name: "Irrigation System Efficiency", link: "/test/irrigation-techniques/system" },
    ],
    additionalResources: "/resources/irrigation-techniques",
  },
  // Add other courses here...
];

export default function SupportResources() {
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedVideo, setExpandedVideo] = useState(null); // New state for video dropdown
  const [expandedTest, setExpandedTest] = useState(null); // New state for test dropdown
  const [expandedResources, setExpandedResources] = useState(null); // New state for resources dropdown
  const [videoUrl, setVideoUrl] = useState(null); // State to track which video to show

  const toggleCourse = (index) => {
    setExpandedCourse(expandedCourse === index ? null : index);
    setExpandedVideo(null); // Reset video dropdown when changing course
    setExpandedTest(null); // Reset test dropdown when changing course
    setExpandedResources(null); // Reset resources dropdown when changing course
  };

  const toggleVideo = (videoIndex) => {
    setExpandedVideo(expandedVideo === videoIndex ? null : videoIndex);
    setVideoUrl(expandedVideo === videoIndex ? null : courses[expandedCourse].videos[videoIndex].url); // Toggle video URL
  };

  const toggleTest = (testIndex) => {
    setExpandedTest(expandedTest === testIndex ? null : testIndex);
  };

  const toggleResources = () => {
    setExpandedResources(expandedResources === null ? true : null);
  };

  return (
    <div className="max-w-screen-xl mx-auto p-6 bg-gray-50" style={{ width: "73vw" }}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg p-4 shadow-md mb-6">
        <div className="flex items-center gap-3">
          <FaTools size={30} className="text-white" />
          <div>
            <h1 className="text-2xl font-semibold">Support & Resources</h1>
            <p className="text-sm text-teal-200 mt-1">
              Explore our farming courses, tools, and guides designed for modern farming techniques.
            </p>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white rounded-lg shadow-md p-5 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <FaBookOpen size={20} className="text-green-500" />
          <h2 className="text-lg font-semibold text-green-600">Farming Courses</h2>
        </div>

        <div className="space-y-6">
          {courses.map((course, index) => (
            <div key={index} className="border-b border-gray-200 pb-6">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleCourse(index)}
              >
                <div className="flex items-center gap-4">
                  <FaPlayCircle size={20} className="text-green-600" /> {/* Changed to play icon */}
                  <div>
                    <h3 className="text-xl font-semibold text-green-700">{course.title}</h3>
                    <p className="text-sm text-gray-500">Learn essential farming techniques</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div style={{ width: 60, height: 60 }}>
                    <CircularProgressbar
                      value={course.progress}
                      text={`${course.progress}%`}
                      strokeWidth={8}
                      styles={{
                        root: { width: "100%" },
                        path: {
                          stroke: "#4CAF50",
                          strokeLinecap: "round",
                        },
                        trail: {
                          stroke: "#e6e6e6",
                        },
                        text: {
                          fill: "#4CAF50",
                          fontSize: "14px",
                          fontWeight: "bold",
                        },
                      }}
                    />
                  </div>
                  {expandedCourse === index ? (
                    <FaChevronUp size={20} />
                  ) : (
                    <FaChevronDown size={20} />
                  )}
                </div>
              </div>

              {/* Dropdown Content */}
              {expandedCourse === index && (
                <div className="mt-6 space-y-6">
                  {/* Video Section */}
                  <div>
                    <h4 className="text-md font-semibold text-green-600">Videos</h4>
                    <div className="space-y-3">
                      {course.videos.map((video, videoIndex) => (
                        <div key={videoIndex} className="cursor-pointer">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200"
                            onClick={() => toggleVideo(videoIndex)}
                          >
                            <span className="text-sm font-semibold text-teal-600">{video.name}</span>
                            {expandedVideo === videoIndex ? <FaChevronUp /> : <FaChevronDown />}
                          </div>

                          {/* Video iframe section */}
                          {expandedVideo === videoIndex && videoUrl && (
                            <div className="mt-4 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-md">
                              <iframe
                                src={videoUrl}
                                title={video.name}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Test Section */}
                  <div>
                    <h4 className="text-md font-semibold text-green-600">Tests</h4>
                    <div className="space-y-3">
                      {course.tests.map((test, testIndex) => (
                        <div key={testIndex} className="cursor-pointer">
                          <div
                            className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200"
                            onClick={() => toggleTest(testIndex)}
                          >
                            <span className="text-sm font-semibold text-teal-600">{test.name}</span>
                            {expandedTest === testIndex ? <FaChevronUp /> : <FaChevronDown />}
                          </div>

                          {/* Test link */}
                          {expandedTest === testIndex && (
                            <div className="mt-4 px-2">
                              <a
                                href={test.link}
                                className="text-teal-500 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Take the Test
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Resources Section */}
                  <div>
                    <h4 className="text-md font-semibold text-green-600">Additional Resources</h4>
                    <div>
                      <div
                        className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 cursor-pointer"
                        onClick={toggleResources}
                      >
                        <span className="text-sm font-semibold text-teal-600">Explore Additional Resources</span>
                        {expandedResources === null ? <FaChevronDown /> : <FaChevronUp />}
                      </div>
                      {expandedResources && (
                        <div className="mt-4 px-2 space-y-3">
                          <a
                            href={course.additionalResources}
                            className="text-teal-500 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Go to Resources
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
