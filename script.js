const checkboxes = document.querySelectorAll(".check__box");
const ranger = document.getElementById("ranger");
const copyBtn = document.getElementById("copy__btn");
const generator = document.getElementById("generate");
const password = document.getElementById("passs");

//  password charset data
const passData = [
  {
    lowercase: false,
    number: false,
    uppercase: false,
    symbol: false,
  },
];

// passsword character length
let passCharacterLen = 0;

// how many checkboxes are checked
const countCheckbox = () => {
  count = 0;
  Object.values(passData[0]).filter((key) => key && count++);
  return count;
};

//  transition when password copied
const removeTransition = (e) => {
  if (e.propertyName !== "color" && e.propertyName !== "border-left-width")
    return;
  e.target.classList.remove("copy__alert");
};

password.addEventListener("transitionend", removeTransition);

// copy password
const copyPassword = () => {
  if (password.textContent === "P4$5WOrD!") return;
  navigator.clipboard.writeText(password.textContent);
  password.classList.add("copy__alert");
};

copyBtn.addEventListener("click", copyPassword);

// add css to to the slider and
const handleSlider = (slider) => {
  const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
  slider.style.background = `linear-gradient(to right, #a4ffaf 0%, #a4ffaf ${value}%, #14141b  ${value}%, #14141b 100%`;
  let finalValue = Math.floor(value / 5);
  slider.parentElement.querySelector(".pass__length").textContent = finalValue;
  // assign slider value to passCharacterLen
  passCharacterLen = finalValue;
};

// for password Strength
const showStrength = () => {
  const elm = document.getElementById("quality");
  const bars = document.querySelectorAll(".strength__bars");

  if (countCheckbox() == 0 || passCharacterLen == 0) {
    password.classList.add("pass__opacity");
    password.textContent = "P4$5WOrD!";
    elm.textContent = "";
    bars.forEach((bar) =>
      bar.classList.remove("good", "strong", "too__weak", "weak")
    );
  } else if (countCheckbox() == 1 || passCharacterLen < 4) {
    elm.textContent = "TOO WEAK";
    bars.forEach((bar) => bar.classList.remove("good", "weak", "strong"));
    for (let i = 0; i < 1; i++) {
      bars[i].classList.add("too__weak");
    }
  } else if (countCheckbox() == 2 || passCharacterLen < 8) {
    elm.textContent = "WEAK";
    bars.forEach((bar) => bar.classList.remove("good", "too__weak", "strong"));
    for (let i = 0; i < 2; i++) {
      bars[i].classList.add("weak");
    }
  } else if (countCheckbox() == 3 || passCharacterLen < 12) {
    bars.forEach((bar) => bar.classList.remove("too__weak", "weak", "strong"));
    elm.textContent = "GOOD";
    for (let i = 0; i < 3; i++) {
      bars[i].classList.add("good");
    }
  } else {
    bars.forEach((bar) => bar.classList.remove("too__weak", "weak", "good"));
    elm.textContent = "STRONG";
    for (let i = 0; i < bars.length; i++) {
      bars[i].classList.add("strong");
    }
  }
};

// add event listner on ranger (slider)
ranger.addEventListener("input", (e) => {
  let target = e.target;
  handleSlider(target);
  showStrength();
});

// function for handle checkboxes
const handleChecBox = (e) => {
  let target = e.target;
  target.checked
    ? passData.forEach((item) => (item[target.name] = true))
    : passData.forEach((item) => (item[target.name] = false));
  showStrength();
};

// add function on checkboxes
checkboxes.forEach((item) =>
  item.addEventListener("input", (e) => handleChecBox(e))
);

//function to generate password
const generate = () => {
  //create set
  const symbolsSet = "~!@#$%^&*?";
  const lowercaseSet = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbersSet = "0123456789";

  let charSet = [];
  //change charset depending on how many checkboxes are checked
  generateCharSet(passData[0].lowercase, lowercaseSet, charSet);
  generateCharSet(passData[0].uppercase, uppercaseSet, charSet);
  generateCharSet(passData[0].number, numbersSet, charSet);
  generateCharSet(passData[0].symbol, symbolsSet, charSet);

  //generate result
  let result = [];
  for (let i = passCharacterLen; i > 0; i--) {
    result.push(charSet[Math.floor(Math.random() * charSet.length)]);
  }

  //check if it contains all its char
  checkIfContains(passData[0].lowercase, lowercaseSet, result);
  checkIfContains(passData[0].uppercase, uppercaseSet, result);
  checkIfContains(passData[0].number, numbersSet, result);
  checkIfContains(passData[0].symbol, symbolsSet, result);

  //we have result, assign it to the password
  password.textContent = result.join("");

  //brighten the password, remove opacity
  password.classList.remove("pass__opacity");
};

// function to check if it contains what it should
const checkIfContains = (what, whatSet, arr) => {
  if (what) {
    let arrayIncludesThis = false;
    for (let char of arr) {
      if (whatSet.includes(char)) {
        arrayIncludesThis = true;
      }
    }
    if (passData[0].lowercase && !arrayIncludesThis) {
      arr[Math.floor(Math.random() * arr.length)] =
        whatSet[Math.floor(Math.random() * whatSet.length)];
    }
  }
};

//function to change charset depending on how many checkboxes are checked
const generateCharSet = (IsChecked, wantedSet, desiredResult) => {
  if (!IsChecked) return;
  for (let i of wantedSet) {
    desiredResult.push(i);
  }
};

// add the functionality to the button and enter keypress
generator.addEventListener("click", () => {
  if (passCharacterLen !== 0 && countCheckbox() !== 0) {
    return generate();
  }
});

// generate password on enter key press
window.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    passCharacterLen !== 0 && countCheckbox() !== 0 && generate();
  }
});
