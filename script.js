// ========================================
// 1. MOBILE NAVIGATION
// ========================================

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

if (menuButton && nav) {

    menuButton.addEventListener("click", () => {

        const isOpen = nav.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.textContent = isOpen ? "×" : "☰";

    });

    nav.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            nav.classList.remove("open");
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.textContent = "☰";

        });

    });

}


// ========================================
// 2. FOOTER YEAR
// ========================================

const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}


// ========================================
// 3. DOCUMENTATION MODAL
// ========================================

const modal = document.getElementById("evidence-modal");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalImage = document.getElementById("modal-image");

let currentImages = [];
let currentImageIndex = 0;


// Gallery Controls

let galleryControls = null;
let prevButton = null;
let nextButton = null;
let counter = null;

if (modalImage) {

    galleryControls = document.createElement("div");
    galleryControls.className = "gallery-controls";

    galleryControls.innerHTML = `
        <button class="gallery-button gallery-prev"
            type="button"
            aria-label="Foto sebelumnya">‹</button>

        <span class="gallery-counter">1 / 1</span>

        <button class="gallery-button gallery-next"
            type="button"
            aria-label="Foto berikutnya">›</button>
    `;

    modalImage.appendChild(galleryControls);

    prevButton = galleryControls.querySelector(".gallery-prev");
    nextButton = galleryControls.querySelector(".gallery-next");
    counter = galleryControls.querySelector(".gallery-counter");

}


// ========================================
// 4. READ DOCUMENTATION IMAGES
// ========================================

function readImages(element) {

    return (element.dataset.images || element.dataset.image || "")
        .split("|")
        .map(image => image.trim())
        .filter(Boolean);

}


// ========================================
// 5. SHOW GALLERY IMAGE
// ========================================

function showGalleryImage() {

    if (!modalImage || !galleryControls) return;

    const image = currentImages[currentImageIndex];

    const placeholder = modalImage.querySelector("span");

    if (!image) {

        modalImage.style.backgroundImage = "";

        if (placeholder) {
            placeholder.style.display = "block";
        }

        galleryControls.style.display = "none";

        return;
    }

    modalImage.style.backgroundImage = `url("${image}")`;

    if (placeholder) {
        placeholder.style.display = "none";
    }

    if (counter) {
        counter.textContent =
            `${currentImageIndex + 1} / ${currentImages.length}`;
    }

    galleryControls.style.display =
        currentImages.length > 1 ? "flex" : "none";

}


// ========================================
// 6. OPEN DOCUMENTATION MODAL
// ========================================

function openGallery(title, description, images, startIndex = 0) {

    if (!modal || !modalTitle || !modalDescription) return;

    modalTitle.textContent = title;
    modalDescription.textContent = description;

    currentImages = images;

    currentImageIndex = Math.min(
        Math.max(startIndex, 0),
        Math.max(images.length - 1, 0)
    );

    showGalleryImage();

    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

}


// ========================================
// 7. INLINE EXPERIENCE GALLERY
// FOTO MUNCUL DI BAWAH PENGALAMAN KERJA
// ========================================

document.querySelectorAll(".inline-gallery-toggle").forEach(button => {

    button.addEventListener("click", () => {

        const card = button.closest(".exp-content");

        if (!card) return;

        const currentGallery = card.querySelector(
            ".inline-evidence-gallery"
        );


        // Jika galeri sudah terbuka, tutup.

        if (currentGallery) {

            currentGallery.remove();

            button.setAttribute("aria-expanded", "false");

            return;

        }


        // Tutup galeri pengalaman lainnya.

        document.querySelectorAll(".inline-evidence-gallery")
            .forEach(gallery => gallery.remove());

        document.querySelectorAll(".inline-gallery-toggle")
            .forEach(toggle => {
                toggle.setAttribute("aria-expanded", "false");
            });


        // Ambil foto berdasarkan data-images.

        const images = readImages(button);

        const gallery = document.createElement("div");

        gallery.className = "inline-evidence-gallery";

        gallery.setAttribute(
            "aria-label",
            `Galeri ${button.dataset.title}`
        );


        // Tampilkan seluruh thumbnail foto.

        images.forEach((src, index) => {

            const thumb = document.createElement("button");

            thumb.type = "button";
            thumb.className = "inline-evidence-thumb";

            thumb.setAttribute(
                "aria-label",
                `Perbesar foto ${index + 1}`
            );

            const image = document.createElement("img");

            image.src = src;

            image.alt =
                `Dokumentasi ${button.dataset.title} ${index + 1}`;

            image.loading = "lazy";

            thumb.appendChild(image);


            // Klik foto untuk memperbesar.

            thumb.addEventListener("click", () => {

                openGallery(
                    button.dataset.title,
                    button.dataset.description,
                    images,
                    index
                );

            });

            gallery.appendChild(thumb);

        });


        // Jika foto belum tersedia.

        if (!images.length) {

            gallery.textContent =
                "Belum ada foto dokumentasi untuk ditampilkan.";

        }


        // Tampilkan galeri tepat di bawah tombol.

        button.insertAdjacentElement("afterend", gallery);

        button.setAttribute("aria-expanded", "true");

    });

});


// ========================================
// 8. DOCUMENTATION CARD GALLERY
// BAGIAN DOKUMENTASI & SERTIFIKAT
// ========================================

document.querySelectorAll(".evidence-card").forEach(card => {

    card.addEventListener("click", () => {

        openGallery(
            card.dataset.title,
            card.dataset.description,
            readImages(card)
        );

    });

});


// ========================================
// 9. NEXT AND PREVIOUS PHOTO
// ========================================

if (prevButton) {

    prevButton.addEventListener("click", () => {

        if (currentImages.length <= 1) return;

        currentImageIndex =
            (currentImageIndex - 1 + currentImages.length)
            % currentImages.length;

        showGalleryImage();

    });

}


if (nextButton) {

    nextButton.addEventListener("click", () => {

        if (currentImages.length <= 1) return;

        currentImageIndex =
            (currentImageIndex + 1) % currentImages.length;

        showGalleryImage();

    });

}


// ========================================
// 10. CLOSE MODAL
// ========================================

function closeModal() {

    if (!modal) return;

    modal.classList.remove("open");

    modal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

    currentImages = [];

    currentImageIndex = 0;

    if (modalImage) {
        modalImage.style.backgroundImage = "";
    }

}


if (modal) {

    modal.querySelectorAll("[data-close]").forEach(button => {

        button.addEventListener("click", closeModal);

    });

}


// ========================================
// 11. KEYBOARD NAVIGATION
// ========================================

document.addEventListener("keydown", event => {

    if (!modal || !modal.classList.contains("open")) return;

    if (event.key === "Escape") {
        closeModal();
    }

    if (event.key === "ArrowLeft" && prevButton) {
        prevButton.click();
    }

    if (event.key === "ArrowRight" && nextButton) {
        nextButton.click();
    }

});


// ========================================
// 12. ACTIVE NAVIGATION
// ========================================

const sections = document.querySelectorAll("main section[id]");

const navLinks = document.querySelectorAll(".nav-links a");

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                navLinks.forEach(link => {

                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") ===
                        `#${entry.target.id}`
                    );

                });

            }

        });

    }, {
        rootMargin: "-35% 0px -55% 0px"
    });

    sections.forEach(section => observer.observe(section));

}