const express = require("express");
const router = express.Router();

router.get("/search", async (req, res) => {

  try {

    const { q } = req.query;


    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&countrycodes=in&addressdetails=1`,
      {
        headers: {
          "User-Agent": "NovaRide-App/1.0"
        }
      }
    );



    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      throw new Error("Location provider failed");
    }



    const data = await response.json();
    res.json(data);
  }
  catch (error) {

    console.log(error);
    res.status(500).json({
      message: error.message
    });


  }


});

module.exports = router;