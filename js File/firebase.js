// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsZ-L1fUDFRCcCPIf3IMS67CDbKx2kbx0",
  authDomain: "lumexia-technologies.firebaseapp.com",
  projectId: "lumexia-technologies",
  storageBucket: "lumexia-technologies.firebasestorage.app",
  messagingSenderId: "960416856432",
  appId: "1:960416856432:web:540251f82b6c1c999b77b5",
  measurementId: "G-10KLQZQR2D"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

//Firebase Reviews Submissions & Display 

// DOM Elements
const form = document.getElementById("submitReview");
const reviewList = document.querySelector(".review-list");

// Create review card
function createReviewCard(name, rating, message) {
  const div = document.createElement("div");
  div.className = "review";
  div.innerHTML = `
    <h4>${name}</h4>
    <div class="stars">${rating}</div>
    <p>${message}</p>
  `;
  return div;
}

// Load reviews
async function loadReviews() {
    try {
      const reviewsRef = collection(db, "reviews");
      const q = query(reviewsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
  
      snapshot.forEach((doc) => {
        const { name, rating, message } = doc.data();
        const reviewCard = createReviewCard(name, rating, message);
        reviewList.appendChild(reviewCard);
      });
    } catch (error) {
      console.error("⚠️ Error loading reviews:", error);
    }
  }
  

loadReviews();

// Submit review
if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
      
        const name = document.getElementById("reviewerName").value;
        const rating = document.getElementById("starRating").value;
        const message = document.getElementById("reviewMessage").value;
      
        try {
          await addDoc(collection(db, "reviews"), {
            name,
            rating,
            message,
            createdAt: new Date()
          });
      
          form.reset();
          alert("✅ Review submitted!");
          
        } catch (error) {
          console.error("❌ Error submitting review:", error);
          alert("There was an error. Please try again.");
        }
    });      
}

// Firebase Contact Form - Services Packages

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const selectedPackage = document.getElementById("package").value;
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !phone || !selectedPackage) {
      alert("⚠️ Please fill in all required fields.");
      return;
    }

    try {
      await addDoc(collection(db, "contacts-servicePackages"), {
        name,
        email,
        phone,
        package: selectedPackage,
        message,
        submittedAt: new Date()
      });

      alert("✅ Your request has been sent! We'll be in touch.");
      contactForm.reset();
    } catch (error) {
      console.error("❌ Error saving contact form:", error);
      alert("There was an issue submitting your form. Please try again.");
    }
  });
}


//Firebase Contact Us Submissions

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactinfoForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const phone = form.phone.value.trim();
    //const packageSelected = form.package.value;
    const message = form.message.value.trim();

    try {
      await addDoc(collection(db, "contact-us-Submissions"), {
        name,
        email,
        phone,
        //package: packageSelected,
        message,
        submittedAt: new Date()
      });

      alert("Thank you! Your message has been submitted.");
      form.reset();
    } catch (error) {
      console.error("Error submitting form: ", error);
      alert("Something went wrong. Please try again.");
    }
  });
});