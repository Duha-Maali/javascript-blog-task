const CONFIG = {
    API_URL: "http://localhost:3000",
    ENDPOINTS: {
        blogs: "/blog",
    },
};

const API = {
    fetchBlogs: async () => {
        const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.blogs}`);
        if(!response.ok) throw new Error("Failed to fetch blogs");
        return response.json();
    },
    deleteBlog: async (id) => {
        const response = await fetch(`${CONFIG.API_URL}${CONFIG.ENDPOINTS.blogs}/${id}`, {method: "DELETE"});
        if(!response.ok) throw new Error(`Failed to delete blog with id ${id}`);
    },
};

const RENDER = {
    buildCard: (blog) => `
    <div class="card" data-id="${blog.id}">
        <div class="image-placeholder">
            <i class="fa-regular fa-image"></i>
        </div>
        <div class="info">
            <h3>${blog.title}</h3>
            <p>${blog.description}</p>
        </div>
        <button class="delete-btn" data-id="${blog.id}" data-title="${blog.title}">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>
    `,
    renderBlogs: (blogs) => {
        const container = document.getElementById("cards-container");

        if (!blogs.length) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-newspaper"></i>
                    <p>No blog posts yet.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = blogs.map(RENDER.buildCard).join("");

        container.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation(); 
                MODAL.open(btn.dataset.id, btn.dataset.title);
            });
        });

        container.querySelectorAll(".card").forEach((card) => {
            card.addEventListener("click", () => {
                DETAIL.open(
                    card.querySelector("h3").textContent,
                    card.querySelector("p").textContent
                );
            });
        });
    }
};

const MODAL = {
    _pendingId: null,
    open: (id, title) => {
        MODAL._pendingId = id;
        document.getElementById("modal-blog-title").textContent = `"${title}"`;
        document.getElementById("delete-modal").classList.add("active");
        document.body.classList.add("modal-open");
    },
    close: () => {
        MODAL._pendingId = null;
        document.getElementById("delete-modal").classList.remove("active");
        document.body.classList.remove("modal-open");
    },
    confirmDelete: async() => {
        if(!MODAL._pendingId) return;
        const confirmBtn = document.getElementById("modal-confirm-btn");
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Deleting...';
        try {
            await API.deleteBlog(MODAL._pendingId);
            const updatedBlogs = await API.fetchBlogs();
            RENDER.renderBlogs(updatedBlogs);
            MODAL.close();
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Yes, Delete';
        }
    },
};

const DETAIL = {
    open: (title, description) => {
        document.getElementById("detail-modal-title").textContent = title;
        document.getElementById("detail-modal-description").textContent = description;
        document.getElementById("detail-modal").classList.add("active");
        document.body.classList.add("modal-open");
    },

    close: () => {
        document.getElementById("detail-modal").classList.remove("active");
        document.body.classList.remove("modal-open");
    },
};

const init = async () => {
    try {
        const blogs = await API.fetchBlogs();
        RENDER.renderBlogs(blogs);
    } catch(error) {
        console.error("Initialization error:", error);
    }

    // Delete modal events
    document.getElementById("modal-confirm-btn").addEventListener("click", MODAL.confirmDelete);
    document.getElementById("modal-cancel-btn").addEventListener("click", MODAL.close);
    document.getElementById("delete-modal").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) MODAL.close();
    });

     // Detail modal events
    document.getElementById("detail-modal-close").addEventListener("click", DETAIL.close);
    document.getElementById("detail-modal").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) DETAIL.close();
    });

    // ESC key closes any open modal
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            MODAL.close();
            DETAIL.close();
        }
});
};

document.addEventListener("DOMContentLoaded", init);