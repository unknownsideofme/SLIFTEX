import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";  // Import Link from React Router

function Card() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-3/4 m-auto">
      <h1 className="text-center text-3xl font-semibold my-8">Meet the Team</h1>

      <div className="mt-20">
        <Slider {...settings}>
          {data.map((d) => (
            <div
              key={d.name}
              className="bg-white h-[450px] text-black rounded-xl shadow-lg transform transition-transform duration-300 hover:translate-y-[-10px]"
            >
              <div className="h-56 bg-indigo-500 flex justify-center items-center rounded-t-xl">
                <img
                  src={d.img}
                  alt={d.name}
                  className="h-36 w-36 rounded-full border-4 border-white" // Decreased the size of the image
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-4 p-4">
                <p className="text-xl font-semibold">{d.name}</p>
                <p className="text-center">{d.review}</p>
                {/* Link to LinkedIn profile with hover effect */}
                <button className="bg-indigo-500 text-white text-lg px-6 py-1 rounded-xl hover:bg-indigo-600 transition">
                <a
                  href={d.linkedin}  // LinkedIn profile URL
                  target="_blank"     // Open the link in a new tab
                  rel="noopener noreferrer" // Security feature to prevent reverse tabnabbing
                  className="bg-indigo-500 text-white text-lg px-6 py-1 rounded-xl hover:bg-black hover:text-white transition duration-300"
                >
                  Read More
                </a>
                </button>
               
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

// Sample Next Arrow
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-arrow`}
      style={{
        ...style,
        display: "block",
        borderRadius: "50%",
        height: "40px",
        width: "40px",
        zIndex: 2,
        position: "absolute",
        top: "50%",
        right: "20px",
        transform: "translateY(-50%)",
      }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} slick-arrow`}
      style={{
        ...style,
        display: "block",
        borderRadius: "50%",
        height: "40px",
        width: "40px",
        zIndex: 2,
        position: "absolute",
        top: "50%",
        left: "20px",
        transform: "translateY(-50%)",
      }}
      onClick={onClick}
    />
  );
}

const data = [
  {
    name: `Dhanvi Shah`,
    img: `/photos/Dhanvi_Shah.jpeg`,
    review: `Hi there! I’m a second-year B.Tech undergraduate in ECE with a strong passion for full-stack development and a deep interest in data structures and algorithms.`,
    linkedin: "https://www.linkedin.com/in/dhanvi-shah-084080294?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app", // LinkedIn profile URL
  },
  {
    name: `Parth Arora`,
    img: `/photos/WhatsApp Image 2024-12-05 at 01.33.21.jpeg`,
    review: `Hi there! I’m a second-year B.Tech undergraduate in CSE with a deep interest in data structures and algorithms. .`,
    linkedin: "https://www.linkedin.com/in/parth-arora-971070281/", // LinkedIn profile URL
  },
  {
    name: `Saksham Chopra`,
    img: `photos/Saksham.jpeg`,
    review: `Hi there! I’m a second-year B.Tech undergraduate in CSE with a strong passion for Competitive Programming and data structures and algorithms.`,
    linkedin: "https://www.linkedin.com/in/saksham-chopra-778250287/", // LinkedIn profile URL
  },
  {
    name: `Arnav Surana`,
    img: `/photos/WhatsApp Image 2024-12-05 at 01.32.45.jpeg`,
    review: `Hi there! I’m a second-year B.Tech undergraduate in CSE with a strong passion for Competitive Programming and interest in frontend development.`,
    linkedin: "https://www.linkedin.com/in/arnav-surana-07a9551b5/", // LinkedIn profile URL
  },
  {
    name: `Debanjan Rakshit`,
    img: `/photos/WhatsApp Image 2024-12-07 at 14.08.42.jpeg`,
    review: `Hi there! I’m a second-year B.Tech undergraduate in ECE with a strong passion for Machine Learning and a deep interest in development and programming.`,
    linkedin: "https://www.linkedin.com/in/debanjan-rakshit-558912289/", // LinkedIn profile URL
  },
  {
    name: `Hozefa Travadi`,
    img: `/photos/WhatsApp Image 2024-12-07 at 14.14.07.jpeg`,
    review: `Hi there! I’m a second-year B.Tech undergraduate in ECE with a strong passion for Competitive Programming and interest in Trading and crypto.`,
    linkedin: "https://www.linkedin.com/in/hozefa-travadi-o7/", // LinkedIn profile URL
  },
];

export default Card;



