document.addEventListener("DOMContentLoaded", function () {
  var list = document.getElementById("product-list");
  var results = document.getElementById("product-results");
  var search = document.getElementById("product-search");
  var sort = document.getElementById("product-sort");
  var lightbox = document.getElementById("product-lightbox");
  var lightboxImage = document.getElementById("lightbox-image");
  var lightboxCaption = document.getElementById("lightbox-caption");

  if (!list || !results || !search || !sort || !lightbox || !lightboxImage || !lightboxCaption) {
    return;
  }

  var products = [];
  var prices = {};

  Promise.all([
    fetch("../data/products.json").then(readJsonResponse),
    fetch("../data/pricing.json").then(readJsonResponse)
  ])
    .then(function (data) {
      products = data[0];
      prices = data[1].rangePrices;
      renderProducts();
    })
    .catch(function (error) {
      console.error("Could not load the product catalogue.", error);
      results.textContent = "The product ranges could not be loaded. Please try again later.";
    });

  search.addEventListener("input", renderProducts);
  sort.addEventListener("change", renderProducts);

  list.addEventListener("click", function (event) {
    var button = event.target.closest("[data-product-image]");
    if (!button) {
      return;
    }

    var image = button.querySelector("img");
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = button.dataset.productImage;
    lightbox.showModal();
  });

  lightbox.addEventListener("click", function (event) {
    if (event.target === lightbox) {
      lightbox.close();
    }
  });

  function readJsonResponse(response) {
    if (!response.ok) {
      throw new Error("Request failed with status " + response.status);
    }
    return response.json();
  }

  function renderProducts() {
    var query = search.value.trim().toLowerCase();
    var visibleProducts = products.filter(function (product) {
      return (product.name + " " + product.description).toLowerCase().includes(query);
    });

    visibleProducts.sort(function (a, b) {
      if (sort.value === "name-desc") {
        return b.name.localeCompare(a.name);
      }
      if (sort.value === "price-asc") {
        return prices[a.id] - prices[b.id];
      }
      if (sort.value === "price-desc") {
        return prices[b.id] - prices[a.id];
      }
      return a.name.localeCompare(b.name);
    });

    list.replaceChildren();
    results.textContent = visibleProducts.length === 1
      ? "1 range found."
      : visibleProducts.length + " ranges found.";

    visibleProducts.forEach(function (product) {
      var article = document.createElement("article");
      article.className = "range-card product-card";

      var imageButton = document.createElement("button");
      imageButton.className = "product-image-button";
      imageButton.type = "button";
      imageButton.dataset.productImage = product.name;
      imageButton.setAttribute("aria-label", "View image: " + product.name);

      var image = document.createElement("img");
      image.src = product.image;
      image.alt = product.alt;
      image.loading = "lazy";
      image.width = 720;
      image.height = 480;
      imageButton.appendChild(image);

      var heading = document.createElement("h3");
      heading.textContent = product.name;

      var description = document.createElement("p");
      description.textContent = product.description;

      var price = document.createElement("p");
      price.className = "product-price";
      price.textContent = "From R" + Number(prices[product.id]).toFixed(2);

      var enquiryLink = document.createElement("a");
      enquiryLink.href = "../enquiry.html";
      enquiryLink.textContent = "Request a custom order";

      article.appendChild(imageButton);
      article.appendChild(heading);
      article.appendChild(description);
      article.appendChild(price);
      article.appendChild(enquiryLink);
      list.appendChild(article);
    });
  }
});
