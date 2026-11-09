document.addEventListener("DOMContentLoaded", function () {
  var forms = document.querySelectorAll("form[data-validate]");
 
  forms.forEach(function (form) {
    // Turn off the browser's default pop-ups so our own messages show
    form.setAttribute("novalidate", "");
 
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // no backend yet, so we handle submit here
      clearSuccess(form);
 
      var isFormValid = true;
      var firstInvalid = null;
 
      form.querySelectorAll("input:not([type='hidden']), textarea, select").forEach(function (field) {
        if (!validateField(field)) {
          isFormValid = false;
          if (!firstInvalid) {
            firstInvalid = field;
          }
        }
      });
 
      if (isFormValid) {
        if (form.dataset.mailto) {
          // Contact form: compile the details into an email
          var link = buildMailto(form);
          showSuccess(
            form,
            "Thank you! Your email is ready. Your email app should open so you can press send. If it does not open, ",
            link
          );
          window.location.href = link;
        } else {
          showSuccess(form, "Thank you! Your form has been submitted.");
        }
        form.reset();
      } else {
        firstInvalid.focus();
      }
    });
 
    // Live feedback: check a field when the user leaves it,
    // and re-check while typing once an error is showing
    form.querySelectorAll("input:not([type='hidden']), textarea, select").forEach(function (field) {
      field.addEventListener("blur", function () {
        validateField(field);
      });
      field.addEventListener("input", function () {
        if (field.classList.contains("invalid")) {
          validateField(field);
        }
      });
    });
  });
});
 
/* ---------- Validation rules ---------- */
function getError(field) {
  var value = field.value.trim();
  var name = field.name;
 
  // Required fields
  if (field.hasAttribute("required") && value === "") {
    return "Please fill in this field.";
  }
 
  // Optional field left empty is fine
  if (value === "") {
    return "";
  }
 
  if (name === "full-name") {
    if (value.length < 2) {
      return "Name must be at least 2 characters.";
    }
    if (!/^[A-Za-z\u00C0-\u024F' -]+$/.test(value)) {
      return "Name can only contain letters, spaces, hyphens and apostrophes.";
    }
  }
 
  if (field.type === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      return "Please enter a valid email address, e.g. name@example.com.";
    }
  }
 
  if (field.type === "tel") {
    // South African numbers: 0671446283, 067 144 6283 or +27671446283
    var digits = value.replace(/[\s-]/g, "");
    if (!/^(\+27|0)[0-9]{9}$/.test(digits)) {
      return "Please enter a valid South African phone number.";
    }
  }
 
  if (name === "subject" && value.length > 100) {
    return "Subject must be 100 characters or fewer.";
  }
 
  if (name === "message") {
    if (value.length < 10) {
      return "Message must be at least 10 characters.";
    }
    if (value.length > 1000) {
      return "Message must be 1000 characters or fewer.";
    }
  }
 
  if (field.type === "number") {
    var num = Number(value);
    if (!Number.isFinite(num)) {
      return "Please enter a valid number.";
    }
    if (field.min !== "" && num < Number(field.min)) {
      return "Value must be at least " + field.min + ".";
    }
    if (field.max !== "" && num > Number(field.max)) {
      return "Value must be no more than " + field.max + ".";
    }
    if (field.step && field.step !== "any" && Number.isFinite(Number(field.step))) {
      var step = Number(field.step);
      var min = field.min === "" ? 0 : Number(field.min);
      if (Math.abs((num - min) / step - Math.round((num - min) / step)) > 1e-8) {
        return "Please enter a value in increments of " + field.step + ".";
      }
    }
  }
 
  return "";
}
 
/* ---------- Show / hide errors ---------- */
function validateField(field) {
  var message = getError(field);

  if (message) {
    var errorBox = getErrorBox(field);
    field.classList.add("invalid");
    field.setAttribute("aria-invalid", "true");
    errorBox.textContent = message;
    return false;
  }
 
  field.classList.remove("invalid");
  field.removeAttribute("aria-invalid");
  var errorBox = document.getElementById(field.id + "-error");
  if (errorBox) {
    errorBox.textContent = "";
  }
  return true;
}
 
function getErrorBox(field) {
  var id = field.id + "-error";
  var box = document.getElementById(id);
 
  if (!box) {
    box = document.createElement("span");
    box.id = id;
    box.className = "field-error";
    box.setAttribute("role", "alert");
    field.insertAdjacentElement("afterend", box);
    field.setAttribute("aria-describedby", id);
  }
  return box;
}
 
/* ---------- Success message ---------- */
function showSuccess(form, message, mailtoLink) {
  var note = document.createElement("p");
  note.className = "form-success";
  note.setAttribute("role", "status");
  note.textContent = message;

  if (mailtoLink) {
    var anchor = document.createElement("a");
    anchor.href = mailtoLink;
    anchor.textContent = "click here to open the email";
    note.appendChild(anchor);
    note.appendChild(document.createTextNode("."));
  }
  form.appendChild(note);
}
 
/* ---------- Compile the form into an email ---------- */
function buildMailto(form) {
  var to = form.dataset.mailto;
  var typeField = form.querySelector('[name="message-type"]');
  var subjectField = form.querySelector('[name="subject"]');

  // Subject line: "Type of message - subject"
  var subject = typeField && typeField.value ? typeField.value : "Website message";
  if (subjectField && subjectField.value.trim() !== "") {
    subject += " - " + subjectField.value.trim();
  }

  // Body: one line per field, using each field's label
  var lines = [];
  form.querySelectorAll("input, textarea, select").forEach(function (field) {
    if (field.name === "subject") {
      return; // already in the subject line
    }
    var label = form.querySelector('label[for="' + field.id + '"]');
    var text = label ? label.textContent.trim() : field.name;
    lines.push(text + ": " + field.value.trim());
  });

  return (
    "mailto:" + to +
    "?subject=" + encodeURIComponent(subject) +
    "&body=" + encodeURIComponent(lines.join("\n"))
  );
}

function clearSuccess(form) {
  var old = form.querySelector(".form-success");
  if (old) {
    old.remove();
  }
}
