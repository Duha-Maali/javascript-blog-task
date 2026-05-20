const CONFIG = {
    API_BASE: "http://localhost:3000",
    ENDPOINTS: {
    blogs: "/blog",
},
};

const API = {
    createBlog: async (blogData) => {
    const response = await fetch(`${CONFIG.API_BASE}${CONFIG.ENDPOINTS.blogs}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
    });
    if (!response.ok) throw new Error("Failed to create blog.");
    return response.json();
},
};

const VALIDATION = {
  config: {
    title: {
      required: "Title is required.",
      invalidChars: "Only English letters and spaces are allowed.",
      firstCapital: "The first letter must be capitalised.",
      maxLength: 50,
      maxLengthMsg: "Title must be less than 50 characters.",
    },
    description: {
      required: "Description is required.",
      invalidChars: "Only English letters and spaces are allowed.",
      maxLength: 1000,
      maxLengthMsg: "Description must be less than 1000 characters.",
    },
  },
  
  validate: (type, value) => {
    const trimmed = value.trim();
    const rules = VALIDATION.config[type];

    if (!trimmed)
      return rules.required;
    if (!/^[A-Za-z ]+$/.test(trimmed))
      return rules.invalidChars;
    if (type === "title" && !/^[A-Z]/.test(trimmed))
      return rules.firstCapital;
    if (trimmed.length >= rules.maxLength)
      return rules.maxLengthMsg;

    return null; // valid
    },

  // Show or clear the error message under a field
  setError: (fieldName, errorMsg) => {
    const errorEl = document.getElementById(`${fieldName}-error`);
    const inputEl = document.getElementById(`form-${fieldName}`);

    if (errorMsg) {
      errorEl.textContent = errorMsg;
      errorEl.classList.add("visible");
      inputEl.classList.add("invalid");
    } else {
      errorEl.textContent = "";
      errorEl.classList.remove("visible");
      inputEl.classList.remove("invalid");
    }
  },

  // Validate one field, update its UI, return true if valid
  validateField: (fieldName, value) => {
        const errorMsg = VALIDATION.validate(fieldName, value);
        VALIDATION.setError(fieldName, errorMsg);
        return errorMsg === null;
    },

  updateSubmitButton: () => {
      const titleError = VALIDATION.validate("title", document.getElementById("form-title").value);
      const descError = VALIDATION.validate("description", document.getElementById("form-description").value);
      document.getElementById("form-submit-btn").disabled =
          titleError !== null || descError !== null;
  },
};


const FORM = {
    bindValidationListeners: () => {
        const titleInput = document.getElementById("form-title");
        const descInput = document.getElementById("form-description");
        titleInput.addEventListener("input", () => {
            VALIDATION.validateField("title", titleInput.value);
            VALIDATION.updateSubmitButton();
        });
        descInput.addEventListener("input", () => {
            VALIDATION.validateField("description", descInput.value);
            VALIDATION.updateSubmitButton();
        });
    },
    
    handleSubmit: async (event) => {
        event.preventDefault();
        const titleValid = VALIDATION.validateField("title", document.getElementById("form-title").value);
        const descValid = VALIDATION.validateField("description", document.getElementById("form-description").value);
        if (!titleValid || !descValid) return;
        const submitBtn = document.getElementById("form-submit-btn");
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Publishing...';
        
        const newBlog = {
            title: document.getElementById("form-title").value.trim(),
            description: document.getElementById("form-description").value.trim(),
        };
        
        try {
            await API.createBlog(newBlog);
            window.location.href = "index.html";
        } catch (err) {
            console.error("Submit failed:", err);
            alert("Something went wrong. Please try again.");
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Publish Post';
        }
    },
};

const init = () => {
    FORM.bindValidationListeners();
    document.getElementById("blog-form").addEventListener("submit", FORM.handleSubmit);
};

document.addEventListener("DOMContentLoaded", init);