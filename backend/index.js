require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const cors = require("cors");
// const nodemailer = require("nodemailer");

const multer = require("multer");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Define Schema
const paymentSchema = new mongoose.Schema({
  name: String,
  email: String,
  transactionId: String,
  quad: String,
  triple: String,
  double: String,
  single: String,
  totalPrice: String,
  date: { type: Date, default: Date.now },
});

// Create Model
const Payment = mongoose.model("Payment", paymentSchema);

// Test API Route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working!" });
});


// API Route to Save Payment
app.post("/api/payments", async (req, res) => {
  try {
    const payment = new Payment(req.body);
    await payment.save();
    res.status(201).json({ message: "Payment details saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Error saving payment details" });
  }
});
// // Payment Schema
// const PaymentSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   amount: Number,
//   trip: String,
//   payment_id: String,
//   order_id: String,
//   status: String,
//   date: { type: Date, default: Date.now },
// });
// const Payment = mongoose.model("Payment", PaymentSchema);

// // Initialize Razorpay
// const razorpay = new Razorpay({
//   key_id: 'rzp_test_XnuNbiu4AK9Qft',
//   key_secret: 'q1jjOY01pZsx4nfJ61eJA6zG',
// });

// // Create Order
// app.post("/create-order", async (req, res) => {
//   try {
//     const { amount, currency, name, email, trip } = req.body;

//     const options = {
//       amount: amount * 100, // Convert to paise
//       currency,
//       receipt: `order_rcptid_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);
//     res.json({ order, name, email, trip, amount });
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Verify Payment & Store Data
// app.post("/verify-payment", async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, name, email, amount, trip } = req.body;

//     const body = razorpay_order_id + "|" + razorpay_payment_id;
//     const expectedSignature = crypto.createHmac("sha256", 'rzp_test_XnuNbiu4AK9Qft').update(body).digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: "Invalid payment signature" });
//     }

//     // Store payment in database
//     const newPayment = new Payment({
//       name,
//       email,
//       amount,
//       trip,
//       payment_id: razorpay_payment_id,
//       order_id: razorpay_order_id,
//       status: "Paid",
//     });
//     await newPayment.save();

//     // Email setup
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: { user: 'ag952006@student.nitw.ac.in', pass: 'Iitjee2020@2024'},
//     });

//     const userMail = {
//       from: 'ag952006@student.nitw.ac.in',
//       to: email,
//       subject: "Payment Successful",
//       text: `Hi ${name},\n\nYour payment of ₹${amount} for the trip to ${trip} was successful.\nPayment ID: ${razorpay_payment_id}`,
//     };

//     const adminMail = {
//       from: 'ag952006@student.nitw.ac.in',
//       to: 'ag952006@student.nitw.ac.in',
//       subject: "New Payment Received",
//       text: `Payment received from ${name} (${email}) for ₹${amount}.\nTrip: ${trip}\nPayment ID: ${razorpay_payment_id}`,
//     };

//     await transporter.sendMail(userMail);
//     await transporter.sendMail(adminMail);

//     res.json({ message: "Payment successful and stored" });
//   } catch (error) {
//     res.status(500).json({ message: "Error verifying payment", error });
//   }
// });

// const destinations = [
//   {
//     id: 1,
//     heading: "Shimla",
//     description: "❄️ Snow-capped mountains & scenic valleys",
//     photo: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537830/Shimla_w1vfqe.jpg",
//     pdf: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537829/Shimla_tour_itinerary.pdf",
//     quadPrice: 15000, TriPrice: 18000, doubPrice: 20000, singlePrice: 25000,
//     inclusions:[
//       "Shikara Ride",
//       "Meals ( Breakfast & Dinner ) as mentioned in itinerary.",
//       "SUV/Tempo traveler/Coach/Volvo Vehicle for transfers and sightseeing as per mentioned above",
//       "Transfers as per itinerary",
//       "All toll taxes",
//       "Driver allowance with parking charges",
//       "Memories of a Lifetime",
//     ],
//     exclusions:[
//       "Anything else that is not mentioned in the inclusions",
//       "Personal expenses such as tips, telephone calls, laundry, medication etc.",
//       "Any Adventure Sport",
//       "Any extra transportation services availed",
//     ],
//     itenary:[
//       {day:1, stay:"Shimla", meals:"Dinner"},
//       {day:2, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:3, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:4, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:5, stay:"Shimla", meals:"Breakfast & Dinner"},
//     ]
//   },
//   {
//     id: 2,
//     heading: "Kashmir",
//     description: "🏞️ Experience the paradise of India",
//     photo: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537829/Kashmir_bxqg4z.jpg",
//     pdf: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537829/Shimla_tour_itinerary.pdf",
//     quadPrice: 15000, TriPrice: 18000, doubPrice: 20000, singlePrice: 25000,
//     inclusions:[
//       "Shikara Ride",
//       "Meals ( Breakfast & Dinner ) as mentioned in itinerary.",
//       "SUV/Tempo traveler/Coach/Volvo Vehicle for transfers and sightseeing as per mentioned above",
//       "Transfers as per itinerary",
//       "All toll taxes",
//       "Driver allowance with parking charges",
//       "Memories of a Lifetime",
//     ],
//     exclusions:[
//       "Anything else that is not mentioned in the inclusions",
//       "Personal expenses such as tips, telephone calls, laundry, medication etc.",
//       "Any Adventure Sport",
//       "Any extra transportation services availed",
//     ],
//     itenary:[
//       {day:1, stay:"Shimla", meals:"Dinner"},
//       {day:2, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:3, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:4, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:5, stay:"Shimla", meals:"Breakfast & Dinner"},
//     ]
//   },
//   {
//     id: 3,
//     heading: "Kerala",
//     description: "🌿 Lush backwaters & exotic wildlife",
//     photo: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537829/Kerela_xkrj2p.jpg",
//     pdf: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537829/Shimla_tour_itinerary.pdf",
//     quadPrice: 15000, TriPrice: 18000, doubPrice: 20000, singlePrice: 25000,
//     inclusions:[
//       "Shikara Ride",
//       "Meals ( Breakfast & Dinner ) as mentioned in itinerary.",
//       "SUV/Tempo traveler/Coach/Volvo Vehicle for transfers and sightseeing as per mentioned above",
//       "Transfers as per itinerary",
//       "All toll taxes",
//       "Driver allowance with parking charges",
//       "Memories of a Lifetime",
//     ],
//     exclusions:[
//       "Anything else that is not mentioned in the inclusions",
//       "Personal expenses such as tips, telephone calls, laundry, medication etc.",
//       "Any Adventure Sport",
//       "Any extra transportation services availed",
//     ],
//     itenary:[
//       {day:1, stay:"Shimla", meals:"Dinner"},
//       {day:2, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:3, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:4, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:5, stay:"Shimla", meals:"Breakfast & Dinner"},
//     ]
//   },
//   {
//     id: 4,
//     heading: "Manali",
//     description: "🏔️ Adventure, trekking & snowy peaks",
//     photo: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537830/Manali_gdzuhq.png",
//     pdf: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537829/Shimla_tour_itinerary.pdf",
//     quadPrice: 15000, TriPrice: 18000, doubPrice: 20000, singlePrice: 25000,
//     inclusions:[
//       "Shikara Ride",
//       "Meals ( Breakfast & Dinner ) as mentioned in itinerary.",
//       "SUV/Tempo traveler/Coach/Volvo Vehicle for transfers and sightseeing as per mentioned above",
//       "Transfers as per itinerary",
//       "All toll taxes",
//       "Driver allowance with parking charges",
//       "Memories of a Lifetime",
//     ],
//     exclusions:[
//       "Anything else that is not mentioned in the inclusions",
//       "Personal expenses such as tips, telephone calls, laundry, medication etc.",
//       "Any Adventure Sport",
//       "Any extra transportation services availed",
//     ],
//     itenary:[
//       {day:1, stay:"Shimla", meals:"Dinner"},
//       {day:2, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:3, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:4, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:5, stay:"Shimla", meals:"Breakfast & Dinner"},
//     ]
//   },
//   {
//     id: 5,
//     heading: "Mcleodganj",
//     description: "🛕 Spiritual vibes & mountain tranquility",
//     photo: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537830/Mcleodganj_ynqo7s.webp",
//     pdf: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537829/Shimla_tour_itinerary.pdf",
//     quadPrice: 15000, TriPrice: 18000, doubPrice: 20000, singlePrice: 25000,
//     inclusions:[
//       "Shikara Ride",
//       "Meals ( Breakfast & Dinner ) as mentioned in itinerary.",
//       "SUV/Tempo traveler/Coach/Volvo Vehicle for transfers and sightseeing as per mentioned above",
//       "Transfers as per itinerary",
//       "All toll taxes",
//       "Driver allowance with parking charges",
//       "Memories of a Lifetime",
//     ],
//     exclusions:[
//       "Anything else that is not mentioned in the inclusions",
//       "Personal expenses such as tips, telephone calls, laundry, medication etc.",
//       "Any Adventure Sport",
//       "Any extra transportation services availed",
//     ],
//     itenary:[
//       {day:1, stay:"Shimla", meals:"Dinner"},
//       {day:2, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:3, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:4, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:5, stay:"Shimla", meals:"Breakfast & Dinner"},
//     ]
//   },
//   {
//     id: 6,
//     heading: "Char Dham",
//     description: "🛤️ A divine pilgrimage journey",
//     photo: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537829/chardham_vu1ojt.jpg",
//     pdf: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537829/Shimla_tour_itinerary.pdf",
//     quadPrice: 15000, TriPrice: 18000, doubPrice: 20000, singlePrice: 25000,
//     inclusions:[
//       "Shikara Ride",
//       "Meals ( Breakfast & Dinner ) as mentioned in itinerary.",
//       "SUV/Tempo traveler/Coach/Volvo Vehicle for transfers and sightseeing as per mentioned above",
//       "Transfers as per itinerary",
//       "All toll taxes",
//       "Driver allowance with parking charges",
//       "Memories of a Lifetime",
//     ],
//     exclusions:[
//       "Anything else that is not mentioned in the inclusions",
//       "Personal expenses such as tips, telephone calls, laundry, medication etc.",
//       "Any Adventure Sport",
//       "Any extra transportation services availed",
//     ],
//     itenary:[
//       {day:1, stay:"Shimla", meals:"Dinner"},
//       {day:2, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:3, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:4, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:5, stay:"Shimla", meals:"Breakfast & Dinner"},
//     ]
//   },
//   {
//     id: 7,
//     heading: "Dalhousie",
//     description: "🌲 A charming hill station escape",
//     photo: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537829/dalhousie_nbrxes.webp",
//     pdf: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537829/Shimla_tour_itinerary.pdf",
//     quadPrice: 15000, TriPrice: 18000, doubPrice: 20000, singlePrice: 25000,
//     inclusions:[
//       "Shikara Ride",
//       "Meals ( Breakfast & Dinner ) as mentioned in itinerary.",
//       "SUV/Tempo traveler/Coach/Volvo Vehicle for transfers and sightseeing as per mentioned above",
//       "Transfers as per itinerary",
//       "All toll taxes",
//       "Driver allowance with parking charges",
//       "Memories of a Lifetime",
//     ],
//     exclusions:[
//       "Anything else that is not mentioned in the inclusions",
//       "Personal expenses such as tips, telephone calls, laundry, medication etc.",
//       "Any Adventure Sport",
//       "Any extra transportation services availed",
//     ],
//     itenary:[
//       {day:1, stay:"Shimla", meals:"Dinner"},
//       {day:2, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:3, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:4, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:5, stay:"Shimla", meals:"Breakfast & Dinner"},
//     ]
//   },
//   {
//     id: 8,
//     heading: "Chopta Chandrashila",
//     description: "⛺ Stunning treks & serene beauty",
//     photo: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537829/ChoptaChandrashila_dbepri.jpg",
//     pdf: "https://res.cloudinary.com/dmr86c1jv/image/upload/v1739537829/Shimla_tour_itinerary.pdf",
//     quadPrice: 15000, TriPrice: 18000, doubPrice: 20000, singlePrice: 25000,
//     inclusions:[
//       "Shikara Ride",
//       "Meals ( Breakfast & Dinner ) as mentioned in itinerary.",
//       "SUV/Tempo traveler/Coach/Volvo Vehicle for transfers and sightseeing as per mentioned above",
//       "Transfers as per itinerary",
//       "All toll taxes",
//       "Driver allowance with parking charges",
//       "Memories of a Lifetime",
//     ],
//     exclusions:[
//       "Anything else that is not mentioned in the inclusions",
//       "Personal expenses such as tips, telephone calls, laundry, medication etc.",
//       "Any Adventure Sport",
//       "Any extra transportation services availed",
//     ],
//     itenary:[
//       {day:1, stay:"Shimla", meals:"Dinner"},
//       {day:2, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:3, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:4, stay:"Shimla", meals:"Breakfast & Dinner"},
//       {day:5, stay:"Shimla", meals:"Breakfast & Dinner"},
//     ]
//   },
// ];

// const destinations = [{
//   heading: "Pushkar Holi Festival Trip",
//   description: "Experience the world-famous Pushkar Holi celebration with music, colors, and unforgettable memories. Enjoy sightseeing, pool parties, and an EDM night in the heart of Pushkar.",
//   photo: "pushkar_holi_festival.jpg",
//   quadPrice: 8500,
//   TriPrice: 9000,
//   doubPrice: 9500,
//   singlePrice: 0, // No single price mentioned in the PDF
//   inclusions: [
//     "Transfers from Delhi to Delhi",
//     "Accommodation for 2 Nights in Pushkar Resort",
//     "4 Meals: Day 1 (Dinner), Day 2 (Breakfast + Dinner), Day 3 (Breakfast)",
//     "Colors for Holi Celebration",
//     "DJ & Pool Party",
//     "All Required Permits",
//     "Trip Buddy for Assistance",
//     "Medical Kit with the Trip Buddy",
//     "Driver Night Charges, Toll Taxes, Parking Charges",
//     "Complimentary Holi T-shirt",
//     "Refreshments on the Bus",
//     "Traditional Thandai for an Authentic Holi Experience"
//   ],
//   exclusions: [
//     "5% GST",
//     "Snacks and Extra Drinks/Food",
//     "Tickets for Any Sightseeing or Extra Activities Outside the Camp Area",
//     "Medical Services Apart from Basic First Aid",
//     "Travel Insurance and Other Benefits",
//     "Anything Not Mentioned in the Inclusions",
//     "Cost Escalation Due to Unforeseen Reasons like Weather, Road Conditions, or Landslides"
//   ],
//   itenary: [
//     {
//       day: 0,
//       heading: "Departure from Delhi to Pushkar",
//       description: [
//         "AC Volvo with Recliner Seats",
//         "Evening departure from Delhi",
//         "En route pit stop for dinner",
//         "Overnight journey to Pushkar with games, music, and an interactive introduction session led by the trip captain",
//         "Visit Ajmer Sharif Dargah en route (depending on the schedule) to seek blessings"
//       ]
//     },
//     {
//       day: 1,
//       heading: "Arrival and Holika Dahan",
//       description: [
//         "Morning check-in at the resort with a welcome drink",
//         "Freshen up and join a pool party",
//         "Local sightseeing:",
//         "  - Savitri Mata Temple (Cable car ride with panoramic views)",
//         "  - Brahma Temple (One of the world’s rarest temples dedicated to Lord Brahma)",
//         "  - Sacred Ghats (Experience the spiritual essence of Pushkar)",
//         "In the evening, witness the Holika Dahan, embracing the festive spirit"
//       ]
//     },
//     {
//       day: 2,
//       heading: "The Grand Holi Celebration",
//       description: [
//         "Wake up to a vibrant morning and collect a complimentary Holi T-shirt",
//         "Enjoy a delicious breakfast with engaging conversations",
//         "Join a pool party with colors and music",
//         "Celebrate Holi in the streets of Pushkar with travelers from around the world",
//         "Visit Mela Ground for the biggest Holi festival with fire brigades used as water toys",
//         "Return to the resort, freshen up, and prepare for an electrifying EDM Night at the Mela Ground",
//         "End the day with a delightful dinner and DJ party at the resort"
//       ]
//     },
//     {
//       day: 3,
//       heading: "Departure to Delhi",
//       description: [
//         "Wake up to breathtaking views of Savitri Mata Temple hills",
//         "Freshen up and enjoy a relaxing breakfast",
//         "Bid farewell to Pushkar and embark on the journey back to Delhi",
//         "Say goodbye to newfound friends and cherished memories"
//       ]
//     }
//   ]
// }];



const destinationSchema = new mongoose.Schema({
  heading: String,
  description: String,
  photo: String,
  quadPrice: Number,
  TriPrice: Number,
  doubPrice: Number,
  singlePrice: Number,
  inclusions: [String],
  exclusions: [String],
  itenary: [{
    day: Number,
    heading: String,
    description: [String]
  }]
});

const Destination = mongoose.model("Destination", destinationSchema, "destinations");
// Destination.insertMany(destinations)
//   .then(() => {
//     console.log("Data inserted successfully");
//     mongoose.connection.close();
//   })
//   .catch((error) => console.error(error));


app.get("/api/destinations", async (req, res) => {
  try {
    const { heading } = req.query; // Get heading from request query

    if (heading) {
      const destination = await Destination.findOne({ heading }); // Find by heading
      if (!destination) {
        return res.status(404).json({ message: "Destination not found" });
      }
      res.json(destination);
    } else {
      const destinations = await Destination.find(); // Return all destinations if no heading is provided
      res.json(destinations);
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching data Aditya", error });
  }
});

const FeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  feedback: { type: String, required: true },
  rating: { type: Number, required: true },
  image: { type: String }, // Store filename of uploaded image
});

// Exporting the model correctly
const Feedback = mongoose.model("Feedback", FeedbackSchema);
module.exports = Feedback;
// Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// API to handle feedback submission along with image
app.post("/api/feedback", upload.single("image"), async (req, res) => {
  try {
    const { name, email, feedback, rating } = req.body;
    const image = req.file ? req.file.filename : null; // Save the filename

    // Ensure all fields are received
    if (!name || !email || !feedback || !rating) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save feedback to MongoDB
    const newFeedback = new Feedback({
      name,
      email,
      feedback,
      rating,
      image, // Store image filename in DB
    });

    await newFeedback.save();
    res.status(201).json({ message: "Feedback submitted successfully" });
  } catch (error) {
    console.error("Error saving feedback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// // Define the updated itinerary
// const updatedItinerary = [
//   {
//     day: 1,
//     heading: "Departure from Delhi",
//     description: [
//       "8:00 PM: Board an overnight Volvo or private cab from Delhi to Manali (~12-14 hrs journey)."
//     ]
//   },
//   {
//     day: 2,
//     heading: "Arrival in Manali & Local Sightseeing",
//     description: [
//       "10:00 AM: Reach Manali & check-in at the hotel. Freshen up & have breakfast.",
//       "11:30 AM: Explore Hadimba Devi Temple, a serene and historical site.",
//       "12:30 PM: Visit Manu Temple and enjoy Old Manali’s charming cafes.",
//       "2:00 PM: Lunch at a famous café like Cafe 1947 or Johnson’s Cafe.",
//       "4:00 PM: Explore Mall Road & Tibetan Monastery for shopping and souvenirs.",
//       "6:00 PM: Enjoy sunset at Van Vihar (optional).",
//       "8:00 PM: Dinner at your hotel or a popular restaurant.",
//       "Overnight stay in Manali."
//     ]
//   },
//   {
//     day: 3,
//     heading: "Sissu & Atal Tunnel Excursion",
//     description: [
//       "6:00 AM: Early morning departure for Sissu via Atal Tunnel (~40 km).",
//       "7:30 AM: Reach Sissu Waterfall, enjoy breathtaking views & take pictures.",
//       "9:00 AM: Visit Keylong (optional, if time permits).",
//       "10:30 AM: Breakfast at a local café with mountain views.",
//       "12:00 PM: Return to Manali, stopping at Solang Valley for adventure activities (paragliding, zorbing, snow activities in winter).",
//       "3:00 PM: Late lunch at a Solang Valley café.",
//       "5:00 PM: Head back to Manali & relax at your hotel or explore more cafés.",
//       "8:00 PM: Dinner & overnight stay in Manali."
//     ]
//   },
//   {
//     day: 4,
//     heading: "Manali to Kasol & Exploration",
//     description: [
//       "7:00 AM: Check out & drive towards Kasol (~75 km, 3 hrs).",
//       "10:00 AM: Reach Kasol, check-in at a riverside stay & relax.",
//       "11:30 AM: Explore Manikaran Sahib Gurudwara & enjoy hot springs.",
//       "1:00 PM: Visit Chalal village or Tosh (optional, if time permits).",
//       "3:00 PM: Have lunch at a famous café like Jim Morrison Café or Moon Dance Café.",
//       "5:00 PM: Enjoy a peaceful riverside walk & sunset views.",
//       "8:00 PM: Bonfire & chill at your stay. Overnight in Kasol."
//     ]
//   },
//   {
//     day: 5,
//     heading: "Return to Delhi",
//     description: [
//       "7:00 AM: Check out & board a bus/cab for Delhi (~12-14 hrs).",
//       "8:00 PM: Reach Delhi with unforgettable memories!"
//     ]
//   }
// ];

// // Find the document using `heading` and update the itinerary
// Destination.findOneAndUpdate(
//   { heading: "Manali-Sissu-Kasol Trip" }, // Find by heading
//   { $set: { itenary: updatedItinerary } },
//   { new: true } // Return updated document
// )
//   .then((updatedTrip) => {
//     if (!updatedTrip) {
//       console.log("No document found with the given heading.");
//     } else {
//       console.log("Updated Trip Itinerary:", updatedTrip);
//     }
//     mongoose.connection.close();
//   })
//   .catch((err) => {
//     console.error("Error updating trip:", err);
//     mongoose.connection.close();
//   });





// Serve uploaded images
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
