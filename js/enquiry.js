
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("enquiry-form");
  var resultBox = document.getElementById("enquiry-result");

  if (!form || !resultBox) {
    return;
  }

  form.setAttribute("novalidate", "");

  // Backup prices, used only if data/pricing.json cannot be loaded
  var pricing = {
    currency: "R",
    rangePrices: { "abundance": 189, "love-self-care": 179, "confidence": 199, "calm-peace": 169, "glow-radiance": 189 },
    packagingFees: { "standard": 0, "gift-box": 35, "eco": 20 },
    discountTiers: [{ minQuantity: 10, percent: 10 }, { minQuantity: 25, percent: 15 }],
    availability: [
      { maxQuantity: 50, status: "In stock", message: "Ready to ship within 2-3 business days." },
      { maxQuantity: 200, status: "Limited stock", message: "Made to order. Please allow 7-10 business days." },
      { maxQuantity: 100000, status: "Please contact us", message: "Large orders need confirmation. We will contact you with a custom timeline." }
    ]
  };
  var pricingWarning = "";

  // AJAX: load the latest prices without reloading the page
  var pricingRequest = fetch("data/pricing.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Pricing request failed with status " + response.status);
      }
      return response.json();
    })
    .then(function (data) {
      pricing = data;
      return pricing;
    })
    .catch(function (error) {
      pricingWarning = "Current pricing could not be loaded. This estimate uses backup prices; please ask us to confirm the final quote.";
      console.warn("Could not load pricing; using the built-in backup prices.", error);
      return pricing;
    });

  // Fields that use the shared validation rules (checkboxes are handled below)
  var fields = form.querySelectorAll("input:not([type='checkbox']), textarea, select");

  fields.forEach(function (field) {
    field.addEventListener("blur", function () {
      validateField(field);
    });
    field.addEventListener("input", function () {
      if (field.classList.contains("invalid")) {
        validateField(field);
      }
    });
  });

  form.querySelectorAll("input[name='range']").forEach(function (box) {
    box.addEventListener("change", validateRanges);
  });

  /* ---------- Submit ---------- */
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var isValid = true;
    var firstInvalid = null;

    fields.forEach(function (field) {
      if (!validateField(field)) {
        isValid = false;
        if (!firstInvalid) {
          firstInvalid = field;
        }
      }
    });

    if (!validateRanges()) {
      isValid = false;
      if (!firstInvalid) {
        firstInvalid = form.querySelector("input[name='range']");
      }
    }

    if (!isValid) {
      resultBox.hidden = true;
      firstInvalid.focus();
      return;
    }

    pricingRequest.then(showEstimate);
  });

  /* ---------- At least one range must be chosen ---------- */
  function validateRanges() {
    var checked = form.querySelectorAll("input[name='range']:checked");
    var errorBox = document.getElementById("range-error");

    if (checked.length === 0) {
      if (errorBox) {
        errorBox.textContent = "Please choose at least one range.";
      }
      return false;
    }
    if (errorBox) {
      errorBox.textContent = "";
    }
    return true;
  }

  /* ---------- Work out the estimate ---------- */
  function showEstimate() {
    var name = form.elements["full-name"].value.trim();
    var email = form.elements["email"].value.trim();
    var quantity = parseInt(form.elements["quantity"].value, 10);
    var orderTypeField = form.elements["order-type"];
    var orderType = orderTypeField.options[orderTypeField.selectedIndex].text;
    var packaging = form.elements["packaging"].value;
    var packagingText = form.elements["packaging"].options[form.elements["packaging"].selectedIndex].text;

    // Selected ranges: names for display, prices for the maths
    var rangeNames = [];
    var priceTotal = 0;
    form.querySelectorAll("input[name='range']:checked").forEach(function (box) {
      rangeNames.push(box.parentElement.textContent.trim());
      priceTotal += pricing.rangePrices[box.value];
    });
    var averagePrice = priceTotal / rangeNames.length;

    var subtotal = averagePrice * quantity;

    // Highest discount tier that the quantity qualifies for
    var discountPercent = 0;
    pricing.discountTiers.forEach(function (tier) {
      if (quantity >= tier.minQuantity) {
        discountPercent = tier.percent;
      }
    });
    var discountAmount = subtotal * (discountPercent / 100);

    var packagingFee = pricing.packagingFees[packaging] || 0;
    var total = subtotal - discountAmount + packagingFee;

    // First availability band the quantity fits into
    var stock = pricing.availability[pricing.availability.length - 1];
    for (var i = 0; i < pricing.availability.length; i++) {
      if (quantity <= pricing.availability[i].maxQuantity) {
        stock = pricing.availability[i];
        break;
      }
    }

    // Build the response using textContent so user input is never run as HTML
    resultBox.replaceChildren();

    if (pricingWarning) {
      var warning = document.createElement("p");
      warning.className = "estimate-warning";
      warning.textContent = pricingWarning;
      resultBox.appendChild(warning);
    }

    var heading = document.createElement("h3");
    heading.textContent = "Thank you, " + name + "! Here is your estimate";
    resultBox.appendChild(heading);

    var table = document.createElement("table");
    table.className = "estimate-table";
    addRow(table, "Order type", orderType);
    addRow(table, "Ranges", rangeNames.join(", "));
    addRow(table, "Quantity", quantity + " item(s)");
    addRow(table, "Average price per item", money(averagePrice));
    addRow(table, "Subtotal", money(subtotal));
    if (discountPercent > 0) {
      addRow(table, "Bulk discount (" + discountPercent + "%)", "-" + money(discountAmount));
    }
    addRow(table, "Packaging (" + packagingText + ")", money(packagingFee));
    addRow(table, "Estimated total", money(total), true);
    resultBox.appendChild(table);

    var availability = document.createElement("p");
    var strong = document.createElement("strong");
    strong.textContent = "Availability: " + stock.status + ". ";
    availability.appendChild(strong);
    availability.appendChild(document.createTextNode(stock.message));
    resultBox.appendChild(availability);

    var note = document.createElement("p");
    note.className = "estimate-note";
    note.textContent =
      "This is an estimate only. Our team will confirm the final quote and availability by email at " +
      email + " within 1-2 business days.";
    resultBox.appendChild(note);

    resultBox.hidden = false;
    resultBox.focus();
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addRow(table, label, value, isTotal) {
    var row = document.createElement("tr");
    var th = document.createElement("th");
    var td = document.createElement("td");
    th.textContent = label;
    td.textContent = value;
    if (isTotal) {
      row.className = "estimate-total";
    }
    row.appendChild(th);
    row.appendChild(td);
    table.appendChild(row);
  }

  function money(amount) {
    return pricing.currency + amount.toFixed(2);
  }
});
