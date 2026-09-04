// ==========================================
// 1. MAGNETIC 2D SERVICE CARDS INITIALIZER
// ==========================================
function initMagneticCards() {
  const cards = document.querySelectorAll(".service-card");

  if (cards.length > 0) {
    cards.forEach((card) => {
      // Wait for the CSS entrance animation to finish, then free the transform property
      card.addEventListener("animationend", () => {
        card.style.animation = "none";
        card.style.opacity = "1";
      });

      // Smooth ease-out while actively tracking
      card.addEventListener("mouseenter", () => {
        card.style.transition =
          "transform 0.1s ease-out, background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease";
      });

      // The Subtle Magnetic Tracking Loop (5% pull + subtle 1.01 scale)
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;

        const magneticPullX = distanceX * 0.05;
        const magneticPullY = distanceY * 0.05;

        card.style.transform = `translate(${magneticPullX}px, ${magneticPullY}px) scale(1.01)`;
      });

      // The Loose Spring Release (1.2s lazy elastic curve)
      card.addEventListener("mouseleave", () => {
        card.style.transition =
          "transform 1.2s cubic-bezier(0.3, 1.2, 0.4, 1), background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease";
        card.style.transform = "translate(0px, 0px) scale(1)";
      });
    });
  }
}

// Expose globally so Swup hooks can trigger it after page transitions
window.initMagneticCards = initMagneticCards;

// ==========================================
// 2. DOM CONTENT LOADED RUNNER
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  // --- Video Background Crossfader ---
  const video1 = document.getElementById("bg-video-1");
  const video2 = document.getElementById("bg-video-2");

  // Safety Check: Only run if background videos exist on the current page
  if (video1 && video2) {
    let isVideo1Active = true;
    const crossfadeDuration = 1.5;

    function handleCrossfade(activeVid, nextVid) {
      if (activeVid.currentTime > activeVid.duration - crossfadeDuration) {
        nextVid.play();
        activeVid.classList.remove("active-video");
        nextVid.classList.add("active-video");

        isVideo1Active = !isVideo1Active;

        setTimeout(() => {
          activeVid.pause();
          activeVid.currentTime = 0;
        }, crossfadeDuration * 1000);
      }
    }

    video1.addEventListener("timeupdate", () => {
      if (isVideo1Active) handleCrossfade(video1, video2);
    });

    video2.addEventListener("timeupdate", () => {
      if (!isVideo1Active) handleCrossfade(video2, video1);
    });
  }

  // Global Form Listener for Power Automate (Immune to Swup transitions)
  document.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "contactForm") {
      e.preventDefault();

      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      // Ensure the checkbox sends a true/false boolean
      data.smsConsent = formData.has("smsConsent");

      // Your specific Power Automate Webhook
      const webhookUrl =
        "https://default39e141900b234ecd99f9606ad12158.81.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/05/workflows/a9a0815d65fa426e9258a1b424c8e285/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=tT0rfHvbzXN6Im_Ry4oU3wM-5NmJvzklmpr0cAL7CS0";

      fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (response.ok) {
            alert(
              "Thank you! Your request has been submitted. A representative will be in touch shortly.",
            );
            e.target.reset(); // Clear the form
          } else {
            alert("Oops! Something went wrong. Please try again later.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Oops! Something went wrong. Please try again later.");
        });
    }
  });
  // --- Initial Card Physics Run ---
  initMagneticCards();
});
