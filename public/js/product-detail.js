/* ========================================
   PRODUCT-DETAIL.JS — Golden Motif
   Gallery behaviour for the static product
   page (content is rendered at build time).
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const thumbsContainer = document.getElementById("gallery-thumbs");
  const mainImg = document.getElementById("gallery-main-img");
  const mainPrev = document.getElementById("main-prev");
  const mainNext = document.getElementById("main-next");
  if (!thumbsContainer || !mainImg) return;

  const thumbs = Array.from(thumbsContainer.querySelectorAll(".product-gallery__thumb"));
  let currentIndex = 0;

  const updateGallery = (index) => {
    currentIndex = index;
    const thumb = thumbs[currentIndex];
    if (!thumb) return;

    mainImg.style.opacity = "0";
    setTimeout(() => {
      mainImg.removeAttribute("srcset");
      mainImg.removeAttribute("sizes");
      mainImg.src = thumb.dataset.img;
      mainImg.style.opacity = "1";
    }, 200);

    thumbs.forEach((t) => t.classList.remove("active"));
    thumb.classList.add("active");
    thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  thumbsContainer.addEventListener("click", (e) => {
    const thumb = e.target.closest(".product-gallery__thumb");
    if (!thumb) return;
    const index = thumbs.indexOf(thumb);
    if (index !== -1) updateGallery(index);
  });

  if (mainPrev) {
    mainPrev.addEventListener("click", () => {
      updateGallery(currentIndex - 1 < 0 ? thumbs.length - 1 : currentIndex - 1);
    });
  }
  if (mainNext) {
    mainNext.addEventListener("click", () => {
      updateGallery(currentIndex + 1 >= thumbs.length ? 0 : currentIndex + 1);
    });
  }
});
