// script.js

document.addEventListener("DOMContentLoaded", () => {
  // === MODAL FUNCTIONALITY ===
  const modals = document.querySelectorAll(".modal");
  const contactModal = document.getElementById("contact-modal");
  const contactSelect = document.getElementById("package");
  const closeButtons = document.querySelectorAll(".close-button");
  const serviceBoxes = document.querySelectorAll(".service-box");

  // === ORDER BUTTONS OPEN CONTACT MODAL ===
  const orderButtons = document.querySelectorAll(".order-button");

  orderButtons.forEach(button => {
    button.addEventListener("click", () => {
      const selectedPackage = button.getAttribute("data-package"); // e.g. "Startup", "Pro", etc.

      // Set package dropdown value if applicable
      if (contactSelect && selectedPackage) {
        contactSelect.value = selectedPackage;
      }

      // Open contact modal
      if (contactModal) {
        contactModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      }
    });
  });
  document.querySelectorAll(".package-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      // Remove active from all tabs and contents
      document.querySelectorAll(".package-tab").forEach(btn => btn.classList.remove("active"));
      document.querySelectorAll(".package-content").forEach(content => content.classList.remove("active"));

      // Add active to clicked tab and corresponding content
      tab.classList.add("active");
      document.getElementById(tab.dataset.target).classList.add("active");
    });
  });

  // === CONTACT MODAL CLOSE FUNCTIONALITY ===
if (contactModal) {
  // Close when clicking outside the modal content
  contactModal.addEventListener("click", (e) => {
    if (e.target === contactModal) {
      contactModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });

  // Close when clicking the close button inside the modal
  const contactCloseBtn = contactModal.querySelector(".close-button");
  if (contactCloseBtn) {
    contactCloseBtn.addEventListener("click", () => {
      contactModal.classList.add("hidden");
      document.body.style.overflow = "auto";
    });
  }
}

  // Hover effect for service boxes
  serviceBoxes.forEach((box) => {
    box.addEventListener("mouseover", () => {
      box.style.cursor = "pointer";
      box.style.boxShadow = "0 0 15px rgba(255, 215, 0, 0.4)";
    });
    box.addEventListener("mouseout", () => {
      box.style.boxShadow = "none";
    });
  });

  // Open modal from URL param ?modal=
  const urlParams = new URLSearchParams(window.location.search);
  const modalIdFromUrl = urlParams.get("modal");
  if (modalIdFromUrl) {
    const targetModal = document.getElementById(modalIdFromUrl);
    const serviceSection = document.getElementById("services");
    if (serviceSection) {
      serviceSection.scrollIntoView({ behavior: "smooth" });
    }

    setTimeout(() => {
      if (targetModal) {
        targetModal.classList.remove("hidden");
        document.body.style.overflow = "hidden";
      }
    }, 500);

    // Clean URL
    const cleanURL = window.location.origin + window.location.pathname + "#services";
    window.history.replaceState({}, document.title, cleanURL);
  }

  // === REVIEW MODAL ===
  const reviewForm = document.getElementById("submitReview");
  const reviewList = document.querySelector(".review-list");
  const reviewModal = document.getElementById("review-modal");
  const openReviewModal = document.getElementById("openReviewModal");
  const closeReviewModal = reviewModal?.querySelector(".close-button");

  if (openReviewModal && closeReviewModal && reviewModal) {
    openReviewModal.addEventListener("click", () => {
      reviewModal.classList.remove("hidden");
    });

    closeReviewModal.addEventListener("click", () => {
      reviewModal.classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
      if (e.target === reviewModal) {
        reviewModal.classList.add("hidden");
      }
    });
  }

  // === BACK TO TOP BUTTON ===
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

// === GLOBAL OPEN/CLOSE MODAL FUNCTIONS ===
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
  }
}

// === JQUERY SLIDER ===
$(document).ready(function () {
  let currentIndex = 0;
  const slides = $(".slide");
  const total = slides.length;

  function showSlide(index) {
    slides.removeClass("active");
    slides.eq(index).addClass("active");
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % total;
    showSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + total) % total;
    showSlide(currentIndex);
  }

  // Auto-play every 4 seconds
  let autoSlide = setInterval(nextSlide, 4000);

  // Manual controls
  $("#nextSlide").click(function () {
    clearInterval(autoSlide);
    nextSlide();
    autoSlide = setInterval(nextSlide, 4000); // restart autoplay
  });

  $("#prevSlide").click(function () {
    clearInterval(autoSlide);
    prevSlide();
    autoSlide = setInterval(nextSlide, 4000); // restart autoplay
  });

  // Initial display
  showSlide(currentIndex);
});
