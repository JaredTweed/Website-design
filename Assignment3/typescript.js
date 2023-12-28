//npx tsc init
//npm init -y
//npm install -g typescript //installs typescript globally
//npx tsc typescript.ts //compiles typescript.ts to typescript.js
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Enum for Pig Categories
var PigCategory;
(function (PigCategory) {
    PigCategory["Grey"] = "Grey";
    PigCategory["Chestnut"] = "Chestnut";
    PigCategory["White"] = "White";
    PigCategory["Black"] = "Black";
})(PigCategory || (PigCategory = {}));
// Base Pig Class
var Pig = /** @class */ (function () {
    function Pig(name, height, weight, personality, category) {
        this.name = name;
        this.height = height;
        this.weight = weight;
        this.personality = personality;
        this.category = category;
    }
    return Pig;
}());
// Grey Pig Subclass
var GreyPig = /** @class */ (function (_super) {
    __extends(GreyPig, _super);
    function GreyPig(name, height, weight, personality, swimmingAbility) {
        var _this = _super.call(this, name, height, weight, personality, PigCategory.Grey) || this;
        _this.swimmingAbility = swimmingAbility;
        return _this;
    }
    return GreyPig;
}(Pig));
// ChestnutPig Subclass
var ChestnutPig = /** @class */ (function (_super) {
    __extends(ChestnutPig, _super);
    function ChestnutPig(name, height, weight, personality, language) {
        var _this = _super.call(this, name, height, weight, personality, PigCategory.Chestnut) || this;
        _this.language = language;
        return _this;
    }
    return ChestnutPig;
}(Pig));
// WhitePig Subclass
var WhitePig = /** @class */ (function (_super) {
    __extends(WhitePig, _super);
    function WhitePig(name, height, weight, personality, runningAbility) {
        var _this = _super.call(this, name, height, weight, personality, PigCategory.White) || this;
        _this.speed = runningAbility;
        return _this;
    }
    return WhitePig;
}(Pig));
// BlackPig Subclass
var BlackPig = /** @class */ (function (_super) {
    __extends(BlackPig, _super);
    function BlackPig(name, height, weight, personality, strengthAbility) {
        var _this = _super.call(this, name, height, weight, personality, PigCategory.Black) || this;
        _this.strengthAbility = strengthAbility;
        return _this;
    }
    return BlackPig;
}(Pig));
// LocalStorageUtil class
var LocalStorageUtil = /** @class */ (function () {
    function LocalStorageUtil() {
    }
    LocalStorageUtil.savePig = function (pig) {
        var pigs = LocalStorageUtil.getPigs();
        pigs.push(pig);
        localStorage.setItem(LocalStorageUtil.localStorageKey, JSON.stringify(pigs));
    };
    LocalStorageUtil.getPigs = function () {
        var pigsJson = localStorage.getItem(LocalStorageUtil.localStorageKey);
        if (pigsJson) {
            return JSON.parse(pigsJson);
        }
        return [];
    };
    LocalStorageUtil.deletePig = function (pigName) {
        var pigs = LocalStorageUtil.getPigs();
        var filteredPigs = pigs.filter(function (pig) { return pig.name !== pigName; });
        localStorage.setItem(LocalStorageUtil.localStorageKey, JSON.stringify(filteredPigs));
        updateTable(LocalStorageUtil.getPigs());
    };
    LocalStorageUtil.localStorageKey = 'farmerHoggettPigs';
    return LocalStorageUtil;
}());
document.addEventListener('DOMContentLoaded', function () {
    var form = document.querySelector('form');
    var nameInput = document.querySelector('#name-data');
    var weightInput = document.querySelector('#weight-data');
    var heightInput = document.querySelector('#height-data');
    var personalityInput = document.querySelector('#personality-data');
    var categorySelect = document.querySelector('#category');
    var swimmingInput = document.querySelector('#swimming-data');
    var languageInput = document.querySelector('#language-data');
    var speedInput = document.querySelector('#speed-data');
    var strengthInput = document.querySelector('#strength-data');
    // Clear all pigs from LocalStorage when the page loads
    var pigs = LocalStorageUtil.getPigs();
    pigs.forEach(function (pig) {
        LocalStorageUtil.deletePig(pig.name);
    });
    form.onsubmit = function (event) {
        event.preventDefault(); // Prevent form submission
        // Create pig object based on the input values
        var pig = {
            name: nameInput.value,
            weight: parseInt(weightInput.value),
            height: parseInt(heightInput.value),
            personality: personalityInput.value,
            category: categorySelect.value,
        };
        // Add specific properties based on the pig category
        switch (pig.category) {
            case PigCategory.Grey:
                pig.swimmingAbility = parseInt(swimmingInput.value);
                break;
            case PigCategory.Chestnut:
                pig.language = languageInput.value;
                break;
            case PigCategory.White:
                pig.speed = parseInt(speedInput.value);
                break;
            case PigCategory.Black:
                pig.strengthAbility = parseInt(strengthInput.value);
                break;
        }
        LocalStorageUtil.savePig(pig); // Use LocalStorageUtil to save the pig
        form.reset(); // Clear the form or provide feedback to the user
        updateTable(LocalStorageUtil.getPigs()); // Update HTML table
    };
});
function updateTable(pigs) {
    // const pigs = LocalStorageUtil.getPigs();
    var pigsTable = document.querySelector('#pigTable');
    // Clear all rows except the header row
    if (!pigsTable) {
        console.error('The table element does not exist!');
        return;
    }
    while (pigsTable.rows.length > 1) {
        pigsTable.deleteRow(-1); // delete the last row
    }
    pigs.forEach(function (pig) {
        var row = pigsTable.insertRow();
        var nameCell = row.insertCell();
        var categoryCell = row.insertCell();
        var infoCell = row.insertCell();
        var deleteCell = row.insertCell();
        nameCell.innerHTML = pig.name;
        categoryCell.innerHTML = pig.category;
        infoCell.innerHTML = '<button class="more-info-btn">More Info</button>';
        deleteCell.innerHTML = '<button onclick="LocalStorageUtil.deletePig(\'' + pig.name + '\')">Delete</button>';
        // Add event listener to More Info button
        var moreInfoBtn = infoCell.querySelector('.more-info-btn');
        moreInfoBtn.addEventListener('click', function () {
            // Display pig's information in a modal or a separate page
            switch (pig.category) {
                case 'Grey':
                    alert("Name: ".concat(pig.name, "\nHeight: ").concat(pig.height, "\nWeight: ").concat(pig.weight, "\nPersonality: ").concat(pig.personality, "\nCategory: ").concat(pig.category, "\nSwimming ability: ").concat(pig.swimmingAbility));
                    break;
                case 'Chestnut':
                    alert("Name: ".concat(pig.name, "\nHeight: ").concat(pig.height, "\nWeight: ").concat(pig.weight, "\nPersonality: ").concat(pig.personality, "\nCategory: ").concat(pig.category, "\nLanguage: ").concat(pig.language));
                    break;
                case 'White':
                    alert("Name: ".concat(pig.name, "\nHeight: ").concat(pig.height, "\nWeight: ").concat(pig.weight, "\nPersonality: ").concat(pig.personality, "\nCategory: ").concat(pig.category, "\nRunning ability: ").concat(pig.speed));
                    break;
                case 'Black':
                    alert("Name: ".concat(pig.name, "\nHeight: ").concat(pig.height, "\nWeight: ").concat(pig.weight, "\nPersonality: ").concat(pig.personality, "\nCategory: ").concat(pig.category, "\nStrength: ").concat(pig.strengthAbility));
                    break;
            }
        });
    });
}
// Showing and hiding input fields based on the category selection
document.addEventListener('DOMContentLoaded', function () {
    var select = document.querySelector('#category');
    console.log(select.value);
    var grey_inputs = document.querySelectorAll('.grey-input');
    var chestnut_inputs = document.querySelectorAll('.chestnut-input');
    var white_inputs = document.querySelectorAll('.white-input');
    var black_inputs = document.querySelectorAll('.black-input');
    // Function to change display style for a NodeList
    function changeDisplayStyle(elements, displayStyle) {
        elements.forEach(function (element) {
            element.style.display = displayStyle;
        });
    }
    changeDisplayStyle(grey_inputs, select.value == 'Grey' ? 'inline-block' : 'none');
    changeDisplayStyle(chestnut_inputs, select.value == 'Chestnut' ? 'inline-block' : 'none');
    changeDisplayStyle(white_inputs, select.value == 'White' ? 'inline-block' : 'none');
    changeDisplayStyle(black_inputs, select.value == 'Black' ? 'inline-block' : 'none');
    select.addEventListener('change', function () {
        // Re-querying the elements is redundant if they don't change, 
        // so this step can be optimized out unless there's a specific reason for re-querying.
        // Update the display style based on selection
        changeDisplayStyle(grey_inputs, select.value == 'Grey' ? 'inline-block' : 'none');
        changeDisplayStyle(chestnut_inputs, select.value == 'Chestnut' ? 'inline-block' : 'none');
        changeDisplayStyle(white_inputs, select.value == 'White' ? 'inline-block' : 'none');
        changeDisplayStyle(black_inputs, select.value == 'Black' ? 'inline-block' : 'none');
    });
});
