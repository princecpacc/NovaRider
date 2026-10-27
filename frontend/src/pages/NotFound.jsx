import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="bg-gray-100 flex justify-center">

  <div className="bg-white border border-rose-100 w-full max-w-lg shadow-lg rounded-xl m-10 px-10 py-8 text-center space-y-4">
    
    <h1 className="text-5xl font-bold text-rose-500">
      404
    </h1>

    <p className="text-xl text-gray-900 font-semibold">
      Looking for something?
    </p>

    <p className="text-gray-600">
      We're sorry. The web address you entered is not a functioning page on our site.
    </p>

    <Link 
      to="/"
      className="inline-block mt-4 bg-rose-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-rose-600 transition"
    >
      Go to Home Page
    </Link>

  </div>

</div>

  )
}