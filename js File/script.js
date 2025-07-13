// script.js

// Open modal

document.addEventListener("DOMContentLoaded", () => {
    const serviceBoxes = document.querySelectorAll(".services");
    const modals = {
      0: document.getElementById("website-modal"),
      1: document.getElementById("mobile-modal"),
      2: document.getElementById("uiux-modal"),
      3: document.getElementById("cross-modal"),
    };
    const closeButtons = document.querySelectorAll(".close-button");
  
    serviceBoxes.forEach((box, index) => {
      box.addEventListener("click", () => {
        modals[index].classList.remove("hidden");
      });
  
      box.addEventListener("mouseover", () => {
        box.style.cursor = "pointer";
        box.style.boxShadow = "0 0 15px rgba(255, 215, 0, 0.4)";
      });
  
      box.addEventListener("mouseout", () => {
        box.style.boxShadow = "none";
      });
    });
  
    closeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.closest(".modal").classList.add("hidden");
      });
    });
  
    window.addEventListener("click", (event) => {
      if (event.target.classList.contains("modal")) {
        event.target.classList.add("hidden");
      }
    });
  });
  

  // Open modal by ID

  document.querySelectorAll('footer [data-modal]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
  
      // Scroll to the services section
      document.querySelector('#services').scrollIntoView({ behavior: 'smooth' });
  
      // Open the corresponding modal after scroll delay
      const modalId = this.getAttribute('data-modal');
      setTimeout(() => {
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.remove('hidden');
        }
      }, 600); // Delay slightly after scroll
    });
  });


  window.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const modalId = urlParams.get("modal");
    
    if (modalId) {
      const targetModal = document.getElementById(modalId);
      const serviceSection = document.getElementById("services");

      // Scroll to the services section
      if (serviceSection) {
        serviceSection.scrollIntoView({ behavior: "smooth" });
      }

      // Open modal after slight delay
      setTimeout(() => {
        if (targetModal) {
          targetModal.classList.remove("hidden");
        }
      }, 500); // Adjust delay if needed

      // Clean up the URL so modal doesn't reopen on reload
      const cleanURL = window.location.origin + window.location.pathname + "#services";
      window.history.replaceState({}, document.title, cleanURL);
    }
  });


  window.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const modalId = params.get("modal");

    if (modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // Prevent background scroll
      }

      // Optional: Scroll to services section
      const servicesSection = document.getElementById("services");
      if (servicesSection) {
        servicesSection.scrollIntoView({ behavior: "smooth" });
      }
    }

    // Handle modal close
    document.querySelectorAll(".close-button").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.closest(".modal").classList.add("hidden");
        document.body.style.overflow = "auto";
        history.replaceState(null, "", window.location.pathname); // Remove ?modal= param
      });
    });
  });


  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("hidden");
    }
  }

  // Close modals when clicking the X
  document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', function() {
      this.closest('.modal').classList.add('hidden');
    });
  });

  // Close modal when clicking outside content
  window.addEventListener("click", e => {
    document.querySelectorAll(".modal").forEach(modal => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  });


  document.addEventListener("DOMContentLoaded", () => {
    const serviceBoxes = document.querySelectorAll(".services");
    const packageModals = document.querySelectorAll(".modal:not(#contact-modal)");
    const contactModal = document.getElementById("contact-modal");
    const contactSelect = document.getElementById("package");
    const allCloseButtons = document.querySelectorAll(".close-button");
  
    // Handle hover and pointer for services
    serviceBoxes.forEach((box) => {
      box.addEventListener("mouseover", () => {
        box.style.cursor = "pointer";
        box.style.boxShadow = "0 0 15px rgba(255, 215, 0, 0.4)";
      });
      box.addEventListener("mouseout", () => {
        box.style.boxShadow = "none";
      });
    });
  
    // Handle Start Project buttons inside package modals
    const startButtons = document.querySelectorAll(".modal .start-project");
  
    startButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const parentModal = btn.closest(".modal-content");
        const titleText = parentModal.querySelector("h2")?.textContent || "";
  
        // Close all modals
        packageModals.forEach(modal => modal.classList.add("hidden"));
  
        // Pre-fill package dropdown with matching value
        for (const option of contactSelect.options) {
          if (titleText.includes(option.text)) {
            option.selected = true;
            break;
          }
        }
  
        // Show contact form modal
        contactModal.classList.remove("hidden");
      });
    });
  
    // Close any modal
    allCloseButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        btn.closest(".modal").classList.add("hidden");
      });
    });
  
    // Close modal when clicking outside
    window.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal")) {
        e.target.classList.add("hidden");
      }
    });
  });
  



  document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.getElementById("submitReview");
  const reviewList = document.querySelector(".review-list");

  const reviewModal = document.getElementById("review-modal");
  const openReviewModal = document.getElementById("openReviewModal");
  const closeReviewModal = reviewModal.querySelector(".close-button");

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

  
  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("reviewerName").value.trim();
    const stars = document.getElementById("starRating").value;
    const message = document.getElementById("reviewMessage").value.trim();

    if (name && stars && message) {
      const reviewDiv = document.createElement("div");
      reviewDiv.classList.add("review");

      reviewDiv.innerHTML = `
        <h4>${name}</h4>
        <div class="stars">${stars}</div>
        <p>${message}</p>
      `;

      reviewList.prepend(reviewDiv);
      reviewForm.reset();
      reviewModal.classList.add("hidden");
    }
  });
});

  // Show/hide back-to-top button on scroll
  document.addEventListener("DOMContentLoaded", function () {
    const backToTopBtn = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.display = "block";
      } else {
        backToTopBtn.style.display = "none";
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  function openModal(id) {
    document.getElementById(id).style.display = "block";
  }
  
  function closeModal(id) {
    document.getElementById(id).style.display = "none";
  }
  


